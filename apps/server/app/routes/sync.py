from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Set
from app.database import get_db
from app.models.page import Page, DocUpdate, Snapshot
import json

router = APIRouter(prefix="/sync", tags=["sync"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, page_id: int):
        await websocket.accept()
        if page_id not in self.active_connections:
            self.active_connections[page_id] = set()
        self.active_connections[page_id].add(websocket)
    
    def disconnect(self, websocket: WebSocket, page_id: int):
        if page_id in self.active_connections:
            self.active_connections[page_id].discard(websocket)
            if not self.active_connections[page_id]:
                del self.active_connections[page_id]
    
    async def broadcast(self, message: bytes, page_id: int, exclude: WebSocket = None):
        if page_id in self.active_connections:
            for connection in self.active_connections[page_id]:
                if connection != exclude:
                    try:
                        await connection.send_bytes(message)
                    except:
                        pass

manager = ConnectionManager()

@router.websocket("/ws/{page_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    page_id: int,
    user_id: int = Query(None)
):
    await manager.connect(websocket, page_id)
    
    try:
        db = next(get_db())
        
        page = db.query(Page).filter(Page.id == page_id).first()
        if not page:
            await websocket.close(code=1008, reason="Page not found")
            return
        
        latest_snapshot = db.query(Snapshot).filter(Snapshot.page_id == page_id).order_by(Snapshot.created_at.desc()).first()
        if latest_snapshot:
            await websocket.send_json({
                "type": "snapshot",
                "data": latest_snapshot.snapshot_blob.hex()
            })
        
        updates = db.query(DocUpdate).filter(DocUpdate.page_id == page_id)
        if latest_snapshot:
            updates = updates.filter(DocUpdate.created_at > latest_snapshot.created_at)
        updates = updates.order_by(DocUpdate.created_at).all()
        
        for update in updates:
            await websocket.send_json({
                "type": "update",
                "data": update.update_blob.hex()
            })
        
        while True:
            data = await websocket.receive_bytes()
            
            doc_update = DocUpdate(
                page_id=page_id,
                update_blob=data,
                user_id=user_id
            )
            db.add(doc_update)
            db.commit()
            
            await manager.broadcast(data, page_id, exclude=websocket)
            
            update_count = db.query(DocUpdate).filter(DocUpdate.page_id == page_id).count()
            if latest_snapshot is None or update_count - latest_snapshot.update_count >= 100:
                pass
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, page_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, page_id)
    finally:
        db.close()
