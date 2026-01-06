# backend/app/api/v1/endpoints/auth.py
import uuid
from user_agents import parse
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
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
    summary="🔑 使用者登入",
    description="""
### 登入與設備識別流程
1. **身分驗證**：比對資料庫中的 Email 與 Hash 密碼。
2. **狀態檢查**：確認帳號是否已通過郵件驗證 (`is_active`)。
3. **設備識別**：
    - 自動解析請求頭中的 `User-Agent`。
    - 若前端未提供 `device_name`，則自動生成設備名稱。
4. **雙 Token 發放**：
    - **Access Token**: 短效期，用於 API 請求授權。
    - **Refresh Token**: 長效期，存於 Redis，用於無感刷新登入狀態。
""",
    responses={
        200: {"description": "登入成功，返回雙 Token"},
        401: {
            "model": schemas.ErrorResponse,
            "description": "認證失敗 (帳密錯誤)",
            "content": {"application/json": {"example": {"detail": "INVALID_CREDENTIALS", "error_code": "ERR_401"}}}
        },
        403: {
            "model": schemas.ErrorResponse,
            "description": "帳號權限受限 (使用者尚未通過郵件驗證)", # 這裡用中文描述
            "content": {
                "application/json": {
                    "example": {
                        "detail": "ACCOUNT_INACTIVE", 
                        "error_code": "ERR_403",
                        "message": "帳號未激活，請先完成郵件驗證" # 可以在 message 放中文提示
                    }
                }
            }
        }
    }
)
async def login_for_access_token(
    request: Request,
    login_data: schemas.LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    # 1. 驗證帳密
    user = await user_crud.get_user_by_email(db, email=login_data.email)
    if not user or not security.verify_password(login_data.password, str(user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="INVALID_CREDENTIALS",
        )
    
    # 2. 檢查帳號狀態
    if not bool(user.is_active):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ACCOUNT_INACTIVE"
        )

    # 3. 設備識別
    device_id = str(uuid.uuid4())
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    ua_string = request.headers.get("User-Agent", "")
    user_agent = parse(ua_string)
    detected_device = f"{user_agent.os.family} ({user_agent.browser.family})"
    final_device_name: str = login_data.device_name if login_data.device_name and login_data.device_name != "Web Browser" else detected_device
    
    # 4. 產生雙 Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = str(uuid.uuid4())
    
    # 5. 存入 Redis (加上 await)
    redis_key = f"refresh_token:{user.id}:{device_id}"
    await redis_client.setex(
        redis_key,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        refresh_token
    )
    
    # 6. 紀錄設備登入
    await user_crud.record_device_login(
        db, 
        user_id=user.id, 
        device_id=device_id, 
        ip=client_ip, 
        device_name=final_device_name
    )
    is_admin = user.permissions.is_superuser if user.permissions else False
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "device_id": device_id,
        "user": {
            "id": user.id,
            "email": user.email,
            "is_superuser": is_admin
        },  
        "token_type": "bearer",
        "message": "Login Successful"
    }

@router.post(
    "/refresh", 
    summary="🔄 重新整理通行證",
    description="使用有效的 Refresh Token 換取新的 Access Token，實現無感登入。",
    response_model=schemas.TokenRefreshResponse
)
async def refresh_access_token(
    user_id: int = Body(..., embed=True),
    device_id: str = Body(..., embed=True),
    refresh_token: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db)
):
    redis_key = f"refresh_token:{user_id}:{device_id}"
    stored_token = await redis_client.get(redis_key)
    
    if not stored_token or stored_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="REFRESH_TOKEN_INVALID"
        )
    
    user = await user_crud.get_user_by_id(db, user_id=user_id)
    if not user:
         raise HTTPException(status_code=404, detail="USER_NOT_FOUND")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = security.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "message": "TOKEN_REFRESHED"
    }

@router.post(
    "/logout", 
    summary="🚪 使用者登出",
    description="移除 Redis 中的 Refresh Token 並紀錄登出時間。"
)
async def logout(
    user_id: int = Body(..., embed=True),
    device_id: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db)
):
    redis_key = f"refresh_token:{user_id}:{device_id}"
    await redis_client.delete(redis_key)
    await user_crud.record_device_logout(db, user_id=user_id, device_id=device_id)
    
    return {"message": "LOGOUT_SUCCESS"}