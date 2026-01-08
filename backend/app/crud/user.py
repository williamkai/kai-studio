# backend/app/crud/user.py
from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .. import models
from ..schemas.user import UserCreate
from ..core.security import get_password_hash, verify_email_verification_token
from ..core import security # 為了使用 security.py 中的新函式

# 1. 透過 Email 查詢使用者 (包含權限預載)
async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(models.User)
        .options(selectinload(models.User.permissions)) 
        .filter(models.User.email == email)
    )
    return result.scalars().first()

# 2. 透過 ID 查詢使用者 (包含權限預載)
async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.User)
        .options(selectinload(models.User.permissions))
        .filter(models.User.id == user_id)
    )
    return result.scalars().first()

# 3. 建立使用者與權限 (已更新)
async def create_user(db: AsyncSession, user: UserCreate) -> models.User:
    """
    建立使用者並設定初始權限，不再處理 verification token。
    """
    hashed_password = get_password_hash(user.password)
    
    # 不再產生和儲存 token
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
    )
    db.add(db_user)
    await db.flush() 
    
    db_permissions = models.UserPermission(
        user_id=db_user.id,
        can_post_note=True,
        can_use_fitness=True
    )
    db.add(db_permissions)
    
    await db.commit()
    
    # 重新查詢以確保關聯資料被載入
    created_user = await get_user_by_id(db, db_user.id)
    if not created_user:
        raise Exception("Could not retrieve user after creation.") # 理論上不應該發生
    return created_user

# 4. 驗證 Token (已更新為 JWT 邏輯)
async def verify_user_by_token(db: AsyncSession, token: str) -> Optional[models.User]:
    """
    驗證 JWT Token，如果有效，則啟用使用者。
    """
    email = security.verify_email_verification_token(token)
    if not email:
        return None # Token 無效或過期
    
    user = await get_user_by_email(db, email)
    if not user:
        return None # 找不到對應使用者

    if not user.is_active:
        user.is_active = True
        await db.commit()
        await db.refresh(user)
    
    return user

# 5. 紀錄裝置登入
async def record_device_login(db: AsyncSession, user_id: int, device_id: str, ip: str, device_name: str):
    result = await db.execute(
        select(models.UserDevice).filter(
            models.UserDevice.user_id == user_id,
            models.UserDevice.device_id == device_id
        )
    )
    db_device = result.scalars().first()
    # now = datetime.now()
    now = datetime.now(timezone.utc)

    if db_device:
        db_device.last_ip = ip
        db_device.device_name = device_name
        db_device.is_active = True
        db_device.last_login = now
        db_device.last_logout = None 
    else:
        db_device = models.UserDevice(
            user_id=user_id,
            device_id=device_id,
            last_ip=ip,
            device_name=device_name,
            is_active=True,
            last_login=now
        )
        db.add(db_device)
    
    await db.commit()

# 6. 紀錄裝置登出
async def record_device_logout(db: AsyncSession, user_id: int, device_id: str):
    result = await db.execute(
        select(models.UserDevice).filter(
            models.UserDevice.user_id == user_id,
            models.UserDevice.device_id == device_id
        )
    )
    db_device = result.scalars().first()
    if db_device:
        db_device.is_active = False
        db_device.last_logout = datetime.now(timezone.utc)
        await db.commit()