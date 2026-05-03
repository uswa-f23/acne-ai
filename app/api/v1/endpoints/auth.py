from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest
from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token
)
from app.utils.response import success_response, error_response
from app.utils import errors
import uuid
import httpx
from app.core.dependencies import get_current_user

from app.core.security import create_access_token
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.schemas.auth import ForgotPasswordRequest, ResetPasswordRequest
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_ADDRESS      = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD     = os.getenv("EMAIL_PASSWORD")
ZEROBOUNCE_API_KEY = os.getenv("ZEROBOUNCE_API_KEY")

router = APIRouter()


async def verify_email_exists(email: str) -> tuple[bool, str]:
    """
    Calls ZeroBounce API to verify the email is real and deliverable.
    Returns (is_valid, error_message).
    Falls back to allowing signup if the API is unavailable.
    """
    if not ZEROBOUNCE_API_KEY:
        return True, ""

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                "https://api.zerobounce.net/v2/validate",
                params={
                    "api_key": ZEROBOUNCE_API_KEY,
                    "email": email,
                    "ip_address": ""
                }
            )

        if response.status_code != 200:
            return True, ""

        data = response.json()
        print("ZeroBounce response:", data)  # remove after confirming it works

        email_status = data.get("status", "")
        sub_status   = data.get("sub_status", "")

        # "valid" — mailbox exists and is deliverable
        if email_status == "valid":
            return True, ""

        # "invalid" — mailbox does not exist
        if email_status == "invalid":
            return False, "This email address does not exist. Please use a valid and existing email."

        # disposable/temp email service
        if email_status == "do_not_mail" and sub_status == "disposable":
            return False, "Disposable email addresses are not allowed."

        # spamtrap, abuse, do_not_mail — block all
        if email_status in ("spamtrap", "abuse", "do_not_mail"):
            return False, "This email address is not allowed. Please use a different email."

        # "unknown" — mail server unreachable, fail open
        return True, ""

    except Exception as e:
        print(f"ZeroBounce error: {e}")
        return True, ""


@router.post("/register", status_code=201)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # ── Step 1: Check if email already exists ───────
    result = await db.execute(select(User).where(User.email == payload.email))
    existing = result.scalar_one_or_none()

    if existing:
        return error_response(
            code=errors.EMAIL_ALREADY_EXISTS,
            message="An account with this email already exists.",
            status_code=409
        )

    # ── Step 2: Verify email is real via ZeroBounce ──
    is_valid, validation_error = await verify_email_exists(payload.email)
    if not is_valid:
        return error_response(
            code="INVALID_EMAIL",
            message=validation_error,
            status_code=422
        )

    # ── Step 3: Create new user ──────────────────────
    user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # ── Step 4: Generate tokens ──────────────────────
    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})

    return success_response(
        data={
            "user_id": user.id,
            "email": user.email,
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
        status_code=201
    )


@router.post("/login")
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        return error_response(
            code=errors.INVALID_TOKEN,
            message="Invalid email or password.",
            status_code=401
        )

    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})

    return success_response(data={
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 3600
    })


@router.post("/refresh")
async def refresh_token(payload: RefreshRequest, db: AsyncSession = Depends(get_db)):
    token_data = decode_token(payload.refresh_token)

    if not token_data or token_data.get("type") != "refresh":
        return error_response(
            code=errors.INVALID_TOKEN,
            message="Invalid or expired refresh token.",
            status_code=401
        )

    user_id = token_data.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        return error_response(
            code=errors.INVALID_TOKEN,
            message="User not found.",
            status_code=401
        )

    new_access_token = create_access_token({"sub": user.id})

    return success_response(data={
        "access_token": new_access_token,
        "expires_in": 3600
    })


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return success_response(data={
        "user_id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
    })


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    email = payload.email

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        return success_response(data={"message": "If this email exists, a reset link has been sent."})

    reset_token = create_access_token({"sub": user.id, "type": "reset"})
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    try:
        msg = MIMEMultipart()
        msg['From']    = EMAIL_ADDRESS
        msg['To']      = email
        msg['Subject'] = "AcneAI — Password Reset"

        body = f"""
        Hi {user.full_name},

        You requested a password reset for your AcneAI account.
        Click the link below to reset your password:

        {reset_link}

        This link expires in 1 hour.
        If you didn't request this, ignore this email.

        — AcneAI Team
        """
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Email send error: {e}")

    return success_response(data={"message": "If this email exists, a reset link has been sent."})


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    token    = payload.token
    new_pass = payload.new_password

    token_data = decode_token(token)
    if not token_data or token_data.get("type") != "reset":
        return error_response(code=errors.INVALID_TOKEN, message="Invalid or expired reset link.", status_code=401)

    user_id = token_data.get("sub")
    result  = await db.execute(select(User).where(User.id == user_id))
    user    = result.scalar_one_or_none()

    if not user:
        return error_response(code=errors.INVALID_TOKEN, message="User not found.", status_code=404)

    user.hashed_password = hash_password(new_pass)
    await db.commit()

    return success_response(data={"message": "Password reset successful."})