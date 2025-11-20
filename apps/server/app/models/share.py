from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class ShareRole(str, enum.Enum):
    VIEWER = "viewer"
    COMMENTER = "commenter"
    EDITOR = "editor"

class Share(Base):
    __tablename__ = "shares"
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    share_token = Column(String, unique=True, nullable=False, index=True)
    role = Column(Enum(ShareRole), default=ShareRole.VIEWER)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
