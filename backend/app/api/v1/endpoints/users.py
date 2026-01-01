from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....database import get_db
from ....schemas.user import UserCreate, UserOut
from ....crud import user as user_crud

router = APIRouter()

@router.post(
    "/", 
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED, # 成功建立通常用 201
    summary="註冊新使用者",
    description="輸入 Email 與密碼來建立新帳號。系統會檢查 Email 是否重複。",
    responses={
        400: {"description": "Email 已被註冊"},
        422: {"description": "輸入格式錯誤 (例如 Email 格式不正確)"}
    }
)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    這裡也可以寫詳細的邏輯說明（Docstring），會顯示在 Swagger 的描述欄：
    - **email**: 必須是有效的電子郵件格式
    - **password**: 目前暫存為明文
    """
    db_user = user_crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="此 Email 已被註冊"
        )
    return user_crud.create_user(db, user)