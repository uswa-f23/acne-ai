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
from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/register", status_code=201)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == payload.email))
    existing = result.scalar_one_or_none()

    if existing:
        return error_response(
            code=errors.EMAIL_ALREADY_EXISTS,
            message="An account with this email already exists.",
            status_code=409
        )

    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Generate tokens
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
    # Find user
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        return error_response(
            code=errors.INVALID_TOKEN,
            message="Invalid email or password.",
            status_code=401
        )

    # Generate tokens
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