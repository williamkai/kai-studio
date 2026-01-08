# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# ----------------------------
# 使用者資訊輸出
# ----------------------------
class UserInfo(BaseModel):
    id: int
    email: EmailStr
    is_superuser: bool

# ----------------------------
# 登入請求格式
# ----------------------------
class LoginRequest(BaseModel):
    email: EmailStr = Field(description="使用者的電子郵件")
    password: str = Field(description="使用者的密碼")
    device_name: Optional[str] = Field(default="Web Browser", description="設備名稱")
    turnstile_token: str = Field(..., description="Cloudflare Turnstile 驗證 token")

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "william@example.com",
                "password": "your_password",
                "device_name": "Chrome on Windows",
                "turnstile_token": "你的_turnstile_token_由前端提供"
            }
        }
    }

# ----------------------------
# 登入成功回傳
# ----------------------------
class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    device_id: str
    user: UserInfo
    token_type: str = "bearer"
    message: str

# ----------------------------
# Refresh Token 回傳
# ----------------------------
class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    message: str
