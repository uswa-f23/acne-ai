import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.result import Result
from app.models.analysis import Analysis
from app.utils.response import success_response, error_response
from app.utils import errors

router = APIRouter()


@router.get("/history")
async def get_results_history(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * limit

    # Get analyses belonging to user
    analyses_stmt = select(Analysis.id).where(
        Analysis.user_id == current_user.id
    )
    analyses_result = await db.execute(analyses_stmt)
    analysis_ids = [row[0] for row in analyses_result.fetchall()]

    if not analysis_ids:
        return success_response(data={
            "items": [],
            "total": 0,
            "page": page,
            "pages": 0
        })

    # Count total results
    count_stmt = select(func.count(Result.id)).where(
        Result.analysis_id.in_(analysis_ids)
    )
    count_result = await db.execute(count_stmt)
    total = count_result.scalar()

    # Get paginated results
    results_stmt = select(Result).where(
        Result.analysis_id.in_(analysis_ids)
    ).order_by(Result.analyzed_at.desc()).offset(offset).limit(limit)

    results = await db.execute(results_stmt)
    results_list = results.scalars().all()

    items = []
    for r in results_list:
        items.append({
            "result_id": r.id,
            "has_acne": r.has_acne,
            "severity": r.severity,
            "severity_score": r.severity_score,
            "analyzed_at": r.analyzed_at.isoformat() if r.analyzed_at else None
        })

    return success_response(data={
        "items": items,
        "total": total,
        "page": page,
        "pages": -(-total // limit)  # ceiling division
    })


@router.get("/{result_id}")
async def get_result(
    result_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get result
    result_stmt = await db.execute(
        select(Result).where(Result.id == result_id)
    )
    result = result_stmt.scalar_one_or_none()

    if not result:
        return error_response(
            code=errors.RESULT_NOT_FOUND,
            message="Result not found.",
            status_code=404
        )

    # Verify ownership
    analysis_stmt = await db.execute(
        select(Analysis).where(Analysis.id == result.analysis_id)
    )
    analysis = analysis_stmt.scalar_one_or_none()

    if not analysis or analysis.user_id != current_user.id:
        return error_response(
            code=errors.FORBIDDEN,
            message="You don't have access to this result.",
            status_code=403
        )

    # Parse acne_types from JSON string
    acne_types = []
    if result.acne_types:
        try:
            acne_types = json.loads(result.acne_types)
        except Exception:
            acne_types = []

    return success_response(data={
        "result_id": result.id,
        "has_acne": result.has_acne,
        "acne_types": acne_types,
        "severity": result.severity,
        "severity_score": result.severity_score,
        "confidence": result.confidence,
        "annotated_image_url": result.annotated_image_key,
        "analyzed_at": result.analyzed_at.isoformat() if result.analyzed_at else None,
        "disclaimer": (
            "This analysis is for informational purposes only and is not a "
            "substitute for professional medical advice. Please consult a "
            "licensed dermatologist for diagnosis and treatment."
        )
    })