from typing import Any, Optional
from pydantic import BaseModel


class BaseResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[Any] = None