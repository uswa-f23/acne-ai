import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, validator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.models.story import Story

router = APIRouter()


class StoryCreate(BaseModel):
    username: str
    story: str

    @validator('username')
    def username_valid(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Username must be at least 2 characters')
        return v.strip()

    @validator('story')
    def story_valid(cls, v):
        if len(v.strip()) < 20:
            raise ValueError('Story must be at least 20 characters')
        if len(v.strip()) > 500:
            raise ValueError('Story must be under 500 characters')
        return v.strip()


class StoryResponse(BaseModel):
    id: str
    username: str
    story: str
    likes: int
    created_at: str

    class Config:
        from_attributes = True


@router.get("/", response_model=List[StoryResponse])
async def get_stories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Story).order_by(Story.created_at.desc())
    )
    stories = result.scalars().all()
    return [
        {
            "id": s.id,
            "username": s.username,
            "story": s.story,
            "likes": s.likes,
            "created_at": s.created_at.isoformat(),
        }
        for s in stories
    ]


@router.post("/", response_model=StoryResponse, status_code=201)
async def create_story(data: StoryCreate, db: AsyncSession = Depends(get_db)):
    story = Story(
        id=str(uuid.uuid4()),
        username=data.username,
        story=data.story,
        likes=0,
    )
    db.add(story)
    await db.commit()
    await db.refresh(story)
    return {
        "id": story.id,
        "username": story.username,
        "story": story.story,
        "likes": story.likes,
        "created_at": story.created_at.isoformat(),
    }


@router.post("/{story_id}/like")
async def like_story(story_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Story).where(Story.id == story_id))
    story = result.scalar_one_or_none()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    story.likes += 1
    await db.commit()
    return {"likes": story.likes}