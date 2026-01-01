from pydantic import BaseModel, EmailStr
from typing import Optional

# 註冊時輸入的資料
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# 專門用來表示權限的 Schema
class UserPermissionOut(BaseModel):
    is_superuser: bool
    can_post_note: bool
    can_use_fitness: bool
    
    class Config:
        from_attributes = True

# 回傳給前端的使用者資料
class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    # 這裡很酷：你可以直接嵌套權限表，讓前端一次拿到所有資訊
    permissions: Optional[UserPermissionOut] = None 
    
    class Config:
        from_attributes = True