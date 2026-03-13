from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProgressDataPoint(BaseModel):
    date: datetime
    severity_score: float
    severity_label: Optional[str]


class ProgressSummaryResponse(BaseModel):
    user_id: str
    period_days: int
    total_scans: int
    trend: str  # improving | worsening | stable
    severity_change: float
    data_points: List[ProgressDataPoint]


class ProgressCompareResponse(BaseModel):
    result_a: dict
    result_b: dict
    improvement_percent: float