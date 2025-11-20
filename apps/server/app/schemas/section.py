from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SectionCreate(BaseModel):
    name: str

class SectionUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[int] = None

class SectionResponse(BaseModel):
    id: int
    notebook_id: int
    name: str
    position: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
