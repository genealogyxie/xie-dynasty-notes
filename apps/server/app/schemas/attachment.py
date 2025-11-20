from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AttachmentResponse(BaseModel):
    id: int
    page_id: int
    filename: str
    size: int
    mime_type: str
    s3_key: str
    thumbnail_key: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
