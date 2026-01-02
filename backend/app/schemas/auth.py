# backend/app/schemas/auth.py
from pydantic import BaseModel
from typing import Optional

# 專門給登入成功後回傳的格式
class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    device_id: str
    user_id: int
    token_type: str = "bearer"
    message: str

# 給 Refresh API 回傳的格式
class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    message: str