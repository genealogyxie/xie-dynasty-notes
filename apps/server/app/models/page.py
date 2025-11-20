from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Page(Base):
    __tablename__ = "pages"
    
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    title = Column(String, default="Untitled")
    position = Column(Integer, default=0)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    section = relationship("Section", back_populates="pages")
    doc_updates = relationship("DocUpdate", back_populates="page", cascade="all, delete-orphan")
    snapshots = relationship("Snapshot", back_populates="page", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="page", cascade="all, delete-orphan")

class DocUpdate(Base):
    __tablename__ = "doc_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    update_blob = Column(LargeBinary, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    client_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    page = relationship("Page", back_populates="doc_updates")

class Snapshot(Base):
    __tablename__ = "snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    snapshot_blob = Column(LargeBinary, nullable=False)
    update_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    page = relationship("Page", back_populates="snapshots")
