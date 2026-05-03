import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.analysis import Analysis
from app.services.storage import upload_image
from app.tasks.ml_tasks import run_ml_inference
from app.utils.response import success_response, error_response
from app.utils import errors

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload", status_code=202)
async def upload_analysis(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ── Validate file type ───────────────────────────
    if file.content_type not in ALLOWED_TYPES:
        return error_response(
            code=errors.INVALID_IMAGE_FORMAT,
            message="Only JPEG and PNG images are accepted.",
            status_code=400
        )

    # ── Read and validate file size ──────────────────
    image_bytes = await file.read()
    if len(image_bytes) > MAX_SIZE:
        return error_response(
            code=errors.IMAGE_TOO_LARGE,
            message="Image must be under 10MB.",
            status_code=400
        )
    from app.services.ml.preprocessor import preprocess_image
    tensor, face_detected = preprocess_image(image_bytes)
    if not face_detected:
        return error_response(
        code="NO_FACE_DETECTED",
        message="No face detected. Please upload a clear face photo.",
        status_code=400
    )

    # ── Check image quality ──────────────────────────
    from app.services.ml.preprocessor import check_image_quality
    is_good, reason = check_image_quality(image_bytes)
    if not is_good:
        return error_response(
            code=errors.LOW_QUALITY_IMAGE,
            message=f"Image quality issue: {reason}",
            status_code=400
        )
    

    # ── Upload to Cloudinary ─────────────────────────
    try:
        upload_result = await upload_image(image_bytes)
        image_url = upload_result["url"]
        image_key = upload_result["public_id"]
    except Exception as e:
        return error_response(
            code="UPLOAD_FAILED",
            message="Failed to upload image. Please try again.",
            status_code=500,
            detail=str(e)
        )

    # ── Create analysis record ───────────────────────
    analysis_id = str(uuid.uuid4())
    analysis = Analysis(
        id=analysis_id,
        user_id=current_user.id,
        image_s3_key=image_key,
        image_url=image_url,
        status="pending"
    )
    db.add(analysis)
    await db.commit()

    # ── Queue Celery task ────────────────────────────
    task = run_ml_inference.delay(
        analysis_id,
        image_bytes.hex()  # pass as hex string (JSON serializable)
    )

    # Update analysis with task_id
    analysis.task_id = task.id
    await db.commit()

    return success_response(
        data={
            "analysis_id": analysis_id,
            "job_id": task.id,
            "status": "processing",
            "poll_url": f"/v1/analysis/status/{task.id}"
        },
        status_code=202
    )


@router.get("/status/{job_id}")
async def get_analysis_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.tasks.celery_app import celery_app
    from celery.result import AsyncResult
    from app.models.analysis import Analysis

    task_result = AsyncResult(job_id, app=celery_app)
    state = task_result.state

    # Check DB directly for completed status
    analysis_stmt = await db.execute(
        select(Analysis).where(Analysis.task_id == job_id)
    )
    analysis = analysis_stmt.scalar_one_or_none()

    if analysis and analysis.status == "completed":
        # Get result_id from DB
        from app.models.result import Result
        result_stmt = await db.execute(
            select(Result).where(Result.analysis_id == analysis.id)
        )
        result = result_stmt.scalar_one_or_none()
        if result:
            return success_response(data={
                "status": "completed",
                "progress": 100,
                "result_id": result.id,
                "redirect_url": f"/v1/results/{result.id}"
            })

    if analysis and analysis.status == "failed":
        return success_response(data={"status": "failed", "progress": 0})

    if state == "PENDING" or state == "STARTED":
        progress = 0
        if task_result.info and isinstance(task_result.info, dict):
            progress = task_result.info.get("progress", 0)
        return success_response(data={"status": "processing", "progress": progress})

    elif state == "SUCCESS":
        result = task_result.result
        return success_response(data={
            "status": "completed",
            "progress": 100,
            "result_id": result.get("result_id"),
            "redirect_url": f"/v1/results/{result.get('result_id')}"
        })

    elif state == "FAILURE":
        return success_response(data={"status": "failed", "progress": 0})

    return success_response(data={"status": "processing", "progress": 0})