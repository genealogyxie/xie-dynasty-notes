from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PageCreate(BaseModel):
    title: str = "Untitled"

class PageUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None
    is_favorite: Optional[bool] = None

class PageResponse(BaseModel):
    id: int
    section_id: int
    title: str
    position: int
    is_favorite: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
