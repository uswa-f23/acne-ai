from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import List
from datetime import datetime

router = APIRouter()

# In-memory store (replace with DB later)
stories_db = []
next_id = 1

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
    id: int
    username: str
    story: str
    likes: int
    created_at: str

@router.get("/", response_model=List[StoryResponse])
async def get_stories():
    return sorted(stories_db, key=lambda x: x['created_at'], reverse=True)

@router.post("/", response_model=StoryResponse, status_code=201)
async def create_story(data: StoryCreate):
    global next_id
    new_story = {
        "id": next_id,
        "username": data.username,
        "story": data.story,
        "likes": 0,
        "created_at": datetime.now().isoformat(),
    }
    stories_db.append(new_story)
    next_id += 1
    return new_story

@router.post("/{story_id}/like")
async def like_story(story_id: int):
    story = next((s for s in stories_db if s['id'] == story_id), None)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    story['likes'] += 1
    return {"likes": story['likes']}