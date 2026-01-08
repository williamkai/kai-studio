from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from typing import Optional
import re

# ----------------------------
# 使用者註冊請求
# ----------------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    turnstile_token: str

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        """
        驗證密碼強度：
        - 至少 8 個字元
        - 至少包含一個小寫字母
        - 至少包含一個大寫字母
        - 至少包含一個數字
        """
        if len(v) < 8:
            raise ValueError('密碼長度至少需要 8 個字元')
        if not re.search(r'[a-z]', v):
            raise ValueError('密碼需要包含至少一個小寫字母')
        if not re.search(r'[A-Z]', v):
            raise ValueError('密碼需要包含至少一個大寫字母')
        if not re.search(r'[0-9]', v):
            raise ValueError('密碼需要包含至少一個數字')
        return v

# ----------------------------
# 重新發送驗證請求
# ----------------------------
class ResendVerificationRequest(BaseModel):
    email: EmailStr

# ----------------------------
# 使用者權限輸出
# ----------------------------
class UserPermissionOut(BaseModel):
    is_superuser: bool
    can_post_note: bool
    can_use_fitness: bool

    model_config = ConfigDict(from_attributes=True)


# ----------------------------
# 使用者輸出
# ----------------------------
class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    permissions: Optional[UserPermissionOut] = None

    model_config = ConfigDict(from_attributes=True)
