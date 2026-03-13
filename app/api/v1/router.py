from fastapi import APIRouter
from app.api.v1.endpoints import auth, analysis, results, treatment, progress

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
api_router.include_router(results.router, prefix="/results", tags=["Results"])
api_router.include_router(treatment.router, prefix="/treatment", tags=["Treatment"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])