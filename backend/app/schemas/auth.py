# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserInfo(BaseModel):
    id: int
    email: EmailStr
    is_superuser: bool
    
# 新增：登入請求格式
class LoginRequest(BaseModel):
    # 使用 json_schema_extra 來設定範例，這是 V2 最標準的寫法
    email: EmailStr = Field(description="使用者的電子郵件")
    password: str = Field(description="使用者的密碼")
    device_name: Optional[str] = Field(default="Web Browser", description="設備名稱")

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "william@example.com",
                "password": "your_password",
                "device_name": "Chrome on Windows"
            }
        }
    }
    
# 登入成功回傳 (增加一些欄位描述)
class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    device_id: str
    user: UserInfo
    token_type: str = "bearer"
    message: str

class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    message: str