from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    DATABASE_URL: str

    # Redis / Celery
    REDIS_URL: str
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # ML
    ML_MODE: str = "real"
    MODEL_REGISTRY_PATH: str = "models"
    DETECTION_MODEL_PATH: str = "models/detection_v1.onnx"
    TYPE_MODEL_PATH: str = "models/type_v1.onnx"
    SEVERITY_MODEL_PATH: str = "models/severity_v1.onnx"

    # Chatbot
    LLM_PROVIDER: str = "anthropic"
    ANTHROPIC_API_KEY: Optional[str] = None
    LLM_MODEL: str = "claude-sonnet-4-20250514"

    # Monitoring
    SENTRY_DSN: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"
    }


settings = Settings()