from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.workspace import WorkspaceMember
from app.models.notebook import Notebook
from app.models.section import Section
from app.models.page import Page
from app.schemas.page import PageCreate, PageUpdate, PageResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/pages", tags=["pages"])

def check_section_access(section_id: int, user_id: int, db: Session):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    
    notebook = db.query(Notebook).filter(Notebook.id == section.notebook_id).first()
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook not found")
    
    membership = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == notebook.workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return section

@router.get("/section/{section_id}", response_model=List[PageResponse])
async def list_pages(
    section_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_section_access(section_id, current_user.id, db)
    pages = db.query(Page).filter(Page.section_id == section_id).order_by(Page.position).all()
    return pages

@router.post("/section/{section_id}", response_model=PageResponse)
async def create_page(
    section_id: int,
    page_data: PageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_section_access(section_id, current_user.id, db)
    
    max_position = db.query(Page).filter(Page.section_id == section_id).count()
    page = Page(
        section_id=section_id,
        title=page_data.title,
        position=max_position
    )
    db.add(page)
    db.commit()
    db.refresh(page)
    return page

@router.get("/{page_id}", response_model=PageResponse)
async def get_page(
    page_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    
    check_section_access(page.section_id, current_user.id, db)
    return page

@router.patch("/{page_id}", response_model=PageResponse)
async def update_page(
    page_id: int,
    page_data: PageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    
    check_section_access(page.section_id, current_user.id, db)
    
    if page_data.title is not None:
        page.title = page_data.title
    if page_data.position is not None:
        page.position = page_data.position
    if page_data.is_favorite is not None:
        page.is_favorite = page_data.is_favorite
    
    db.commit()
    db.refresh(page)
    return page

@router.delete("/{page_id}")
async def delete_page(
    page_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    
    check_section_access(page.section_id, current_user.id, db)
    
    db.delete(page)
    db.commit()
    return {"status": "deleted"}
