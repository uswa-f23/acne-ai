import json
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.progress import Progress
from app.models.result import Result
from app.utils.response import success_response, error_response
from app.utils import errors
from datetime import datetime, timedelta, timezone

router = APIRouter()

SEVERITY_LABELS = {
    0.2: "mild",
    0.5: "moderate",
    0.75: "severe",
    0.95: "very_severe"
}


def score_to_label(score: float) -> str:
    if score <= 0.2:
        return "mild"
    elif score <= 0.5:
        return "moderate"
    elif score <= 0.75:
        return "severe"
    else:
        return "very_severe"


@router.get("/summary")
async def get_progress_summary(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    since = datetime.now(timezone.utc) - timedelta(days=days)

    # Get progress entries for user within period
    stmt = select(Progress).where(
        Progress.user_id == current_user.id,
        Progress.created_at >= since
    ).order_by(Progress.created_at.asc())

    result = await db.execute(stmt)
    entries = result.scalars().all()

    if not entries:
        return success_response(data={
            "user_id": current_user.id,
            "period_days": days,
            "total_scans": 0,
            "trend": "stable",
            "severity_change": 0.0,
            "data_points": []
        })

    # Build data points
    data_points = []
    for e in entries:
        data_points.append({
            "date": e.created_at.isoformat(),
            "severity_score": e.severity_score,
            "severity_label": score_to_label(e.severity_score)
        })

    # Calculate trend
    first_score = entries[0].severity_score
    last_score = entries[-1].severity_score
    severity_change = round(last_score - first_score, 4)

    if severity_change < -0.05:
        trend = "improving"
    elif severity_change > 0.05:
        trend = "worsening"
    else:
        trend = "stable"

    return success_response(data={
        "user_id": current_user.id,
        "period_days": days,
        "total_scans": len(entries),
        "trend": trend,
        "severity_change": severity_change,
        "data_points": data_points
    })


@router.get("/compare")
async def compare_results(
    result_id_a: str,
    result_id_b: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get both results
    stmt_a = await db.execute(select(Result).where(Result.id == result_id_a))
    result_a = stmt_a.scalar_one_or_none()

    stmt_b = await db.execute(select(Result).where(Result.id == result_id_b))
    result_b = stmt_b.scalar_one_or_none()

    if not result_a or not result_b:
        return error_response(
            code=errors.RESULT_NOT_FOUND,
            message="One or both results not found.",
            status_code=404
        )

    # Calculate improvement
    score_a = result_a.severity_score or 0
    score_b = result_b.severity_score or 0
    if score_a > 0:
        improvement_percent = round(((score_a - score_b) / score_a) * 100, 2)
    else:
        improvement_percent = 0.0

    return success_response(data={
        "result_a": {
            "date": result_a.analyzed_at.isoformat() if result_a.analyzed_at else None,
            "severity_score": score_a,
            "severity": result_a.severity
        },
        "result_b": {
            "date": result_b.analyzed_at.isoformat() if result_b.analyzed_at else None,
            "severity_score": score_b,
            "severity": result_b.severity
        },
        "improvement_percent": improvement_percent
    })