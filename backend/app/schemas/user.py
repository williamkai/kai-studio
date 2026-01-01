from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserPermissionOut(BaseModel):
    is_superuser: bool
    can_post_note: bool
    can_use_fitness: bool
    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    permissions: Optional[UserPermissionOut] = None 
    class Config:
        from_attributes = True