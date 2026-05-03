import uuid
from sqlalchemy import Column, String, Integer, DateTime, func
from app.db.base import Base

class Story(Base):
    __tablename__ = "stories"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username   = Column(String(30), nullable=False)
    story      = Column(String(500), nullable=False)
    likes      = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())