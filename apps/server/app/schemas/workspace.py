from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WorkspaceCreate(BaseModel):
    name: str

class WorkspaceResponse(BaseModel):
    id: int
    name: str
    owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
