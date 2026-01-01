from ..database import Base  # 從 database 匯入 Base
from .user import User, UserPermission
from .note import Note

# 確保 Base 能被外部以 models.Base 存取
__all__ = ["Base", "User", "UserPermission", "Note"]