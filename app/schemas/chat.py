from pydantic import BaseModel
from typing import Optional


class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    session_id: str
    message: str
    role: str = "assistant"