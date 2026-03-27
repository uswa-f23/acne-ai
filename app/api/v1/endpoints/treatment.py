import json
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.result import Result
from app.models.analysis import Analysis
from app.models.treatment import Treatment
from app.services.treatment_engine import get_lifestyle_tips, should_see_dermatologist
from app.utils.response import success_response, error_response
from app.utils import errors

router = APIRouter()


@router.get("/{result_id}")
async def get_treatment(
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

    # Get treatments from DB
    treatments_stmt = await db.execute(
        select(Treatment).where(Treatment.result_id == result_id)
    )
    treatments = treatments_stmt.scalars().all()

    # Separate medicated and herbal
    medicated = []
    herbal = []
    for t in treatments:
        item = {
            "name": t.name,
            "description": t.description,
            "active_ingredient": t.active_ingredient,
            "application_method": t.application_method,
            "frequency": t.frequency,
        }
        if t.type == "medicated":
            medicated.append(item)
        else:
            herbal.append(item)

    # Parse acne_types
    acne_types = []
    if result.acne_types:
        try:
            acne_types = json.loads(result.acne_types)
        except Exception:
            acne_types = []

    return success_response(data={
        "result_id": result_id,
        "severity": result.severity,
        "acne_types": acne_types,
        "recommendations": {
            "medicated": medicated,
            "herbal": herbal
        },
        "lifestyle_tips": get_lifestyle_tips(result.severity),
        "see_dermatologist": should_see_dermatologist(result.severity),
        "disclaimer": (
            "This analysis is for informational purposes only and is not a "
            "substitute for professional medical advice. Please consult a "
            "licensed dermatologist for diagnosis and treatment."
        )
    })