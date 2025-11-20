from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.workspace import WorkspaceMember
from app.models.notebook import Notebook
from app.models.section import Section
from app.schemas.section import SectionCreate, SectionUpdate, SectionResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/sections", tags=["sections"])

def check_notebook_access(notebook_id: int, user_id: int, db: Session):
    notebook = db.query(Notebook).filter(Notebook.id == notebook_id).first()
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook not found")
    
    membership = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == notebook.workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return notebook

@router.get("/notebook/{notebook_id}", response_model=List[SectionResponse])
async def list_sections(
    notebook_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_notebook_access(notebook_id, current_user.id, db)
    sections = db.query(Section).filter(Section.notebook_id == notebook_id).order_by(Section.position).all()
    return sections

@router.post("/notebook/{notebook_id}", response_model=SectionResponse)
async def create_section(
    notebook_id: int,
    section_data: SectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_notebook_access(notebook_id, current_user.id, db)
    
    max_position = db.query(Section).filter(Section.notebook_id == notebook_id).count()
    section = Section(
        notebook_id=notebook_id,
        name=section_data.name,
        position=max_position
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section

@router.patch("/{section_id}", response_model=SectionResponse)
async def update_section(
    section_id: int,
    section_data: SectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    
    check_notebook_access(section.notebook_id, current_user.id, db)
    
    if section_data.name is not None:
        section.name = section_data.name
    if section_data.position is not None:
        section.position = section_data.position
    
    db.commit()
    db.refresh(section)
    return section

@router.delete("/{section_id}")
async def delete_section(
    section_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    
    check_notebook_access(section.notebook_id, current_user.id, db)
    
    db.delete(section)
    db.commit()
    return {"status": "deleted"}
