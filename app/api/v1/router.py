from fastapi import APIRouter
from app.api.v1.endpoints import auth, analysis, results, treatment, progress, chat, product_scanner

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
api_router.include_router(results.router, prefix="/results", tags=["Results"])
api_router.include_router(treatment.router, prefix="/treatment", tags=["Treatment"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(product_scanner.router, prefix="/product", tags=["Product Scanner"])