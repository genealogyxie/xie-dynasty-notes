from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotebookCreate(BaseModel):
    name: str
    color: Optional[str] = None
    icon: Optional[str] = None

class NotebookUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    position: Optional[int] = None

class NotebookResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    color: Optional[str]
    icon: Optional[str]
    position: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
