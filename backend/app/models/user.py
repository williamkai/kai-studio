from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base  # 注意路徑變為 ..

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 一對一關聯權限表
    permissions = relationship("UserPermission", back_populates="user", uselist=False)
    # 一對多關聯筆記
    notes = relationship("Note", back_populates="author")

class UserPermission(Base):
    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    is_superuser = Column(Boolean, default=False)
    can_post_note = Column(Boolean, default=True)
    can_use_fitness = Column(Boolean, default=True)
    is_banned = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="permissions")