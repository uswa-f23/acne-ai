import uuid
import json
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.models.result import Result
from app.models.analysis import Analysis
from app.schemas.chat import ChatMessageRequest
from app.services.chat.chatbot import chatbot
from app.utils.response import success_response, error_response
from app.utils import errors

router = APIRouter()


async def get_latest_result(user_id: str, db: AsyncSession):
    analyses_stmt = await db.execute(
        select(Analysis)
        .where(Analysis.user_id == user_id)
        .order_by(Analysis.created_at.desc())
        .limit(1)
    )
    analysis = analyses_stmt.scalar_one_or_none()
    if not analysis:
        return None

    result_stmt = await db.execute(
        select(Result).where(Result.analysis_id == analysis.id)
    )
    result = result_stmt.scalar_one_or_none()
    if not result:
        return None

    acne_types = []
    if result.acne_types:
        try:
            acne_types = json.loads(result.acne_types)
        except Exception:
            pass

    return {
        "has_acne": result.has_acne,
        "acne_types": acne_types,
        "severity": result.severity,
        "severity_score": result.severity_score,
    }


@router.post("/message")
async def send_message(
    payload: ChatMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session_id = payload.session_id
    is_first_message = False

    # Get or create session
    if not session_id:
        session_id = str(uuid.uuid4())
        session = ChatSession(id=session_id, user_id=current_user.id)
        db.add(session)
        await db.commit()
        is_first_message = True
    else:
        session_stmt = await db.execute(
            select(ChatSession).where(
                ChatSession.id == session_id,
                ChatSession.user_id == current_user.id
            )
        )
        session = session_stmt.scalar_one_or_none()
        if not session:
            return error_response(
                code=errors.FORBIDDEN,
                message="Session not found or access denied.",
                status_code=404
            )

    # Load chat history
    history_stmt = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    history_messages = history_stmt.scalars().all()

    if len(history_messages) == 0:
        is_first_message = True

    chat_history = [
        {"role": msg.role, "content": msg.content}
        for msg in history_messages
    ]

    # Get user's latest scan result for context
    latest_result = await get_latest_result(current_user.id, db)

    # Save user message
    user_message = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="user",
        content=payload.message
    )
    db.add(user_message)
    await db.commit()

    # Get AI response
    ai_response = chatbot.chat(
        message=payload.message,
        chat_history=chat_history,
        latest_result=latest_result,
        is_first_message=is_first_message
    )

    # Save AI response
    assistant_message = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="assistant",
        content=ai_response
    )
    db.add(assistant_message)
    await db.commit()

    return success_response(data={
        "session_id": session_id,
        "message": ai_response,
        "role": "assistant"
    })


@router.get("/history/{session_id}")
async def get_chat_history(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session_stmt = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
    )
    session = session_stmt.scalar_one_or_none()
    if not session:
        return error_response(
            code=errors.FORBIDDEN,
            message="Session not found.",
            status_code=404
        )

    messages_stmt = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    messages = messages_stmt.scalars().all()

    return success_response(data={
        "session_id": session_id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat() if msg.created_at else None
            }
            for msg in messages
        ],
        "total": len(messages)
    })


@router.get("/sessions")
async def get_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions_stmt = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    sessions = sessions_stmt.scalars().all()

    return success_response(data={
        "sessions": [
            {
                "session_id": s.id,
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in sessions
        ],
        "total": len(sessions)
    })