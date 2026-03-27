from pydantic import BaseModel
from typing import List, Optional


class TreatmentItem(BaseModel):
    name: str
    description: str
    active_ingredient: Optional[str] = None
    application_method: str
    frequency: str


class TreatmentResponse(BaseModel):
    result_id: str
    severity: Optional[str]
    acne_types: List[str]
    recommendations: dict
    lifestyle_tips: List[str]
    see_dermatologist: bool
    disclaimer: str = (
        "This analysis is for informational purposes only and is not a "
        "substitute for professional medical advice. Please consult a "
        "licensed dermatologist for diagnosis and treatment."
    )