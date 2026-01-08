from fastapi import APIRouter
from .endpoints import user, auth, note

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["使用者管理 (Users)"])
api_router.include_router(auth.router, prefix="/auth", tags=["認證管理 (Auth)"])
api_router.include_router(note.router, prefix="/notes", tags=["筆記管理 (Notes)"])
