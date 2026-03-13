import uuid
from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Treatment(Base):
    __tablename__ = "treatments"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id: Mapped[str] = mapped_column(String, ForeignKey("results.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # medicated | herbal
    name: Mapped[str] = mapped_column(String(200), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    active_ingredient: Mapped[str] = mapped_column(String(100), nullable=True)
    application_method: Mapped[str] = mapped_column(Text, nullable=True)
    frequency: Mapped[str] = mapped_column(String(100), nullable=True)
    severity_applicability: Mapped[str] = mapped_column(String(20), nullable=True)
    acne_types_applicability: Mapped[str] = mapped_column(Text, nullable=True)  # JSON string
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())