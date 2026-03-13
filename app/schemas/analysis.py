from pydantic import BaseModel
from typing import Optional


class AnalysisUploadResponse(BaseModel):
    analysis_id: str
    job_id: str
    status: str
    poll_url: str


class AnalysisStatusResponse(BaseModel):
    status: str
    progress: Optional[int] = None
    result_id: Optional[str] = None
    redirect_url: Optional[str] = None