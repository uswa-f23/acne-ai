import uuid
from sqlalchemy import String, Float, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Progress(Base):
    __tablename__ = "progress_entries"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    result_id: Mapped[str] = mapped_column(String, ForeignKey("results.id", ondelete="CASCADE"), nullable=False)
    severity_score: Mapped[float] = mapped_column(Float, nullable=True)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())