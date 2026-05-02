from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title="AcneAI API",
    version="1.0.0",
    description="Acne detection and treatment recommendation API"
)

# CORS - allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/v1")


@app.get("/")
async def root():
    return {"message": "AcneAI API is running 🚀", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy", "env": settings.APP_ENV}