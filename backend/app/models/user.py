# backend/app/models/user.py
from sqlalchemy import String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from ..database import Base

# 1. 解決循環引用：只有在型別檢查時才匯入 Note
if TYPE_CHECKING:
    from .note import Note

# 2. 先定義權限表 (讓 User 類別可以參考它)
class UserPermission(Base):
    __tablename__ = "user_permissions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    
    is_superuser: Mapped[bool] = mapped_column(default=False)
    can_post_note: Mapped[bool] = mapped_column(default=True)
    can_use_fitness: Mapped[bool] = mapped_column(default=True)
    is_banned: Mapped[bool] = mapped_column(default=False)
    
    # 建立與 User 的反向關聯
    user: Mapped["User"] = relationship(back_populates="permissions")

# 3. 定義主使用者表
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # 一對一關聯權限表 (uselist=False)
    permissions: Mapped["UserPermission"] = relationship(back_populates="user", uselist=False)
    # 一對多關聯筆記 (注意這裡需要 List)
    notes: Mapped[List["Note"]] = relationship(back_populates="author")

# 4. 定義設備表 (用於登入與多裝置管理)
class UserDevice(Base):
    __tablename__ = "user_devices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    device_id: Mapped[str] = mapped_column(String, index=True)
    device_name: Mapped[Optional[str]] = mapped_column(String)
    last_ip: Mapped[Optional[str]] = mapped_column(String)
    
    # 新增狀態追蹤
    is_active: Mapped[bool] = mapped_column(default=True) 
    last_login: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    last_logout: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # 自動更新最後活動時間
    last_active: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )