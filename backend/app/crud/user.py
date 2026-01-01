import secrets
from typing import Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from .. import models
from ..schemas.user import UserCreate
from ..core.security import get_password_hash

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

# 3. 建立使用者與權限
async def create_user(db: AsyncSession, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    v_token = secrets.token_urlsafe(32)
    
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        verification_token=v_token
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
    
    # 重要：commit 後重新抓取，確保 permissions 被 selectinload 進來，避免回傳 Schema 時噴錯
    return await get_user_by_email(db, user.email)

# 4. 驗證 Token
async def verify_user_token(db: AsyncSession, token: str):
    result = await db.execute(select(models.User).filter(models.User.verification_token == token))
    user = result.scalars().first()
    
    if user:
        user.is_active = True
        user.verification_token = None
        await db.commit()
        await db.refresh(user)
        return user
    return None

# 5. 紀錄裝置登入
async def record_device_login(db: AsyncSession, user_id: int, device_id: str, ip: str, device_name: str):
    result = await db.execute(
        select(models.UserDevice).filter(
            models.UserDevice.user_id == user_id,
            models.UserDevice.device_id == device_id
        )
    )
    db_device = result.scalars().first()
    now = datetime.now()

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
        db_device.last_logout = datetime.now()
        await db.commit()