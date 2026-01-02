# backend/app/api/v1/endpoints/auth.py
import uuid
from user_agents import parse
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from ....crud import user as user_crud
from ....core import security
from ....core.config import settings
from ....core.redis import redis_client
from .... import schemas

router = APIRouter()

@router.post(
    "/login",
    response_model=schemas.LoginResponse,
    summary="使用者登入",
    description="驗證帳密並發放雙 Token 與 設備ID。會自動解析 User-Agent 來識別設備。"
)
async def login_for_access_token(
    request: Request,
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
    device_name: str = Body("Unknown Device", embed=True)
):
    # 1. 驗證帳密
    user = await user_crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, str(user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="帳號或密碼錯誤"
        )
    
    # 2. 檢查帳號狀態
    if not bool(user.is_active):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="帳號尚未開通，請先查看信箱進行驗證"
        )

    # 3. 設備識別與解析
    device_id = str(uuid.uuid4())
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    # 自動解析 User-Agent (如果前端傳 Unknown Device，就用解析結果)
    ua_string = request.headers.get("User-Agent", "")
    user_agent = parse(ua_string)
    detected_device = f"{user_agent.os.family} ({user_agent.browser.family})"
    final_device_name = device_name if device_name != "Unknown Device" else detected_device

    # 4. 產生雙 Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = str(uuid.uuid4())
    
    # 5. 存入 Redis (Await)
    redis_key = f"refresh_token:{user.id}:{device_id}"
    await redis_client.setex(
        redis_key,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        refresh_token
    )
    
    # 6. 紀錄設備登入 (Await)
    await user_crud.record_device_login(
        db, 
        user_id=user.id, 
        device_id=device_id, 
        ip=client_ip, 
        device_name=final_device_name
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "device_id": device_id,
        "user_id": user.id,  
        "token_type": "bearer",
        "message": "登入成功"
    }

@router.post("/refresh", summary="重新整理通行證")
async def refresh_access_token(
    user_id: int = Body(..., embed=True),
    device_id: str = Body(..., embed=True),
    refresh_token: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db)
):
    # 1. 從 Redis 核對
    redis_key = f"refresh_token:{user_id}:{device_id}"
    stored_token = await redis_client.get(redis_key)
    
    if not stored_token or stored_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認證已過期或無效，請重新登入"
        )
    
    # 2. 找回使用者
    user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not user:
         raise HTTPException(status_code=404, detail="找不到使用者")

    # 3. 給予新 Access Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "message": "通行證已更新"
    }

@router.post("/logout", summary="使用者登出")
async def logout(
    user_id: int = Body(..., embed=True),
    device_id: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db) # 注入 DB 連線
):
    # 1. 刪除 Redis 紀錄 (確保 Token 失效)
    redis_key = f"refresh_token:{user_id}:{device_id}"
    await redis_client.delete(redis_key)
    
    # 2. 更新資料庫狀態 (保留歷史紀錄)
    await user_crud.record_device_logout(db, user_id=user_id, device_id=device_id)
    
    return {"message": "登出成功，該裝置已取消授權"}