# backend/app/models/__init__.py
from ..database import Base  # 確保 database.py 裡是用新的 DeclarativeBase
from .user import User, UserPermission, UserDevice
from .note import Note

# 這裡一定要包含 Base，這樣 main.py 呼叫 models.Base.metadata 時才找得到所有表
__all__ = ["Base", "User", "UserPermission", "Note", "UserDevice"]