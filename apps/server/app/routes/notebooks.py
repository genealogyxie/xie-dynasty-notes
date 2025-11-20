from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.workspace import WorkspaceMember
from app.models.notebook import Notebook
from app.schemas.notebook import NotebookCreate, NotebookUpdate, NotebookResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/notebooks", tags=["notebooks"])

def check_workspace_access(workspace_id: int, user_id: int, db: Session):
    membership = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return membership

@router.get("/workspace/{workspace_id}", response_model=List[NotebookResponse])
async def list_notebooks(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_workspace_access(workspace_id, current_user.id, db)
    notebooks = db.query(Notebook).filter(Notebook.workspace_id == workspace_id).order_by(Notebook.position).all()
    return notebooks

@router.post("/workspace/{workspace_id}", response_model=NotebookResponse)
async def create_notebook(
    workspace_id: int,
    notebook_data: NotebookCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_workspace_access(workspace_id, current_user.id, db)
    
    max_position = db.query(Notebook).filter(Notebook.workspace_id == workspace_id).count()
    notebook = Notebook(
        workspace_id=workspace_id,
        name=notebook_data.name,
        color=notebook_data.color,
        icon=notebook_data.icon,
        position=max_position
    )
    db.add(notebook)
    db.commit()
    db.refresh(notebook)
    return notebook

@router.get("/{notebook_id}", response_model=NotebookResponse)
async def get_notebook(
    notebook_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notebook = db.query(Notebook).filter(Notebook.id == notebook_id).first()
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook not found")
    
    check_workspace_access(notebook.workspace_id, current_user.id, db)
    return notebook

@router.patch("/{notebook_id}", response_model=NotebookResponse)
async def update_notebook(
    notebook_id: int,
    notebook_data: NotebookUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notebook = db.query(Notebook).filter(Notebook.id == notebook_id).first()
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook not found")
    
    check_workspace_access(notebook.workspace_id, current_user.id, db)
    
    if notebook_data.name is not None:
        notebook.name = notebook_data.name
    if notebook_data.color is not None:
        notebook.color = notebook_data.color
    if notebook_data.icon is not None:
        notebook.icon = notebook_data.icon
    if notebook_data.position is not None:
        notebook.position = notebook_data.position
    
    db.commit()
    db.refresh(notebook)
    return notebook

@router.delete("/{notebook_id}")
async def delete_notebook(
    notebook_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notebook = db.query(Notebook).filter(Notebook.id == notebook_id).first()
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notebook not found")
    
    check_workspace_access(notebook.workspace_id, current_user.id, db)
    
    db.delete(notebook)
    db.commit()
    return {"status": "deleted"}
