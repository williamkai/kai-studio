# backend/app/api/v1/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from ...database import get_db
from ...core.config import settings
from ...crud import user as user_crud

# 指定 Token 獲取路徑
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="無法驗證憑證",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 從資料庫抓取使用者
    user = await user_crud.get_user_by_id(db, user_id=int(user_id))
    if user is None:
        raise credentials_exception
    
    # 這裡可以根據 ERD 檢查 is_active 或 is_banned
    if not user.is_active:
        raise HTTPException(status_code=400, detail="帳號未啟用")
        
    return user