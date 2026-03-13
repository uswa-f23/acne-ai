from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ResultResponse(BaseModel):
    result_id: str
    has_acne: bool
    acne_types: List[str]
    severity: Optional[str]
    severity_score: float
    confidence: float
    annotated_image_url: Optional[str]
    analyzed_at: datetime
    disclaimer: str = (
        "This analysis is for informational purposes only and is not a "
        "substitute for professional medical advice. Please consult a "
        "licensed dermatologist for diagnosis and treatment."
    )


class ResultHistoryItem(BaseModel):
    result_id: str
    has_acne: bool
    severity: Optional[str]
    severity_score: float
    analyzed_at: datetime


class ResultHistoryResponse(BaseModel):
    items: List[ResultHistoryItem]
    total: int
    page: int
    pages: int