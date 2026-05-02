from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.analysis import Analysis
from app.models.result import Result
from app.services.product_scanner import extract_ingredients_from_image, analyze_product_for_acne
from app.utils.response import success_response, error_response
import json

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_SIZE = 10 * 1024 * 1024


@router.post("/scan")
async def scan_product(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file
    if file.content_type not in ALLOWED_TYPES:
        return error_response(
            code="INVALID_IMAGE_FORMAT",
            message="Only JPEG and PNG images are accepted.",
            status_code=400
        )

    image_bytes = await file.read()
    if len(image_bytes) > MAX_SIZE:
        return error_response(
            code="IMAGE_TOO_LARGE",
            message="Image must be under 10MB.",
            status_code=400
        )

    # Get user's latest scan result for personalization
    acne_types = []
    severity = None

    try:
        analyses_stmt = await db.execute(
            select(Analysis)
            .where(Analysis.user_id == current_user.id)
            .order_by(Analysis.created_at.desc())
            .limit(1)
        )
        analysis = analyses_stmt.scalar_one_or_none()

        if analysis:
            result_stmt = await db.execute(
                select(Result).where(Result.analysis_id == analysis.id)
            )
            result = result_stmt.scalar_one_or_none()
            if result:
                severity = result.severity
                if result.acne_types:
                    try:
                        acne_types = json.loads(result.acne_types)
                    except Exception:
                        acne_types = []
    except Exception as e:
        print(f"Error fetching user scan: {e}")

    # Step 1: Extract ingredients via OCR
    ingredients_text = extract_ingredients_from_image(image_bytes)

    if not ingredients_text or len(ingredients_text.strip()) < 10:
        return error_response(
            code="OCR_FAILED",
            message="Could not extract ingredients from image. Please ensure the ingredients list is clearly visible and well-lit.",
            status_code=400
        )

    # Step 2: Analyze with Groq AI
    analysis_result = analyze_product_for_acne(
        ingredients_text=ingredients_text,
        acne_types=acne_types,
        severity=severity
    )

    if not analysis_result["success"]:
        return error_response(
            code="ANALYSIS_FAILED",
            message=analysis_result.get("error", "Analysis failed."),
            status_code=500
        )

    return success_response(data={
        "extracted_ingredients": ingredients_text,
        "acne_profile": {
            "acne_types": acne_types,
            "severity": severity
        },
        "analysis": analysis_result["analysis"]
    })