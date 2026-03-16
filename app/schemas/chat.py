from pydantic import BaseModel
from typing import Optional


class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None  # if None, starts new session


class ChatMessageResponse(BaseModel):
    session_id: str
    message: str
    role: str = "assistant"