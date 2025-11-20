from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import (
    auth_router,
    workspaces_router,
    notebooks_router,
    sections_router,
    pages_router,
    sync_router
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Xie Dynasty Notes API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router)
app.include_router(workspaces_router)
app.include_router(notebooks_router)
app.include_router(sections_router)
app.include_router(pages_router)
app.include_router(sync_router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
