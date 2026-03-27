import uuid
from sqlalchemy import String, Boolean, Float, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Result(Base):
    __tablename__ = "results"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id: Mapped[str] = mapped_column(String, ForeignKey("analyses.id", ondelete="CASCADE"), unique=True, nullable=False)
    has_acne: Mapped[bool] = mapped_column(Boolean, nullable=True)
    acne_types: Mapped[str] = mapped_column(Text, nullable=True)  # JSON string e.g. '["papules", "pustules"]'
    severity: Mapped[str] = mapped_column(String(20), nullable=True)  # mild | moderate | severe | very_severe
    severity_score: Mapped[float] = mapped_column(Float, nullable=True)  # 0.0 - 1.0
    confidence: Mapped[float] = mapped_column(Float, nullable=True)
    annotated_image_key: Mapped[str] = mapped_column(String(500), nullable=True)
    analyzed_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())