from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession # 這裡改用異步 Session
from ....database import get_db
from .... import schemas
from ....crud import user as user_crud
from ....services.email import send_verification_email

router = APIRouter()

@router.post(
    "/", 
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="註冊新使用者"
)
async def register(
    user: schemas.UserCreate, 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db) # 注入異步 Session
):
    # 1. 檢查 Email (必須 await)
    db_user = await user_crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="此 Email 已被註冊"
        )
    
    # 2. 建立新使用者 (必須 await)
    new_user = await user_crud.create_user(db, user)
    
    # --- 關鍵修正處 ---
    # 確保 new_user 真的存在，消除 "None" 屬性存取警告
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="使用者建立失敗"
        )
    
    # 3. 寄出驗證郵件
    # 使用 str() 確保轉型，並明確從 new_user 提取
    background_tasks.add_task(
        send_verification_email, 
        email=str(new_user.email), 
        token=str(new_user.verification_token)
    )
    
    return new_user

@router.get("/verify", summary="驗證電子郵件")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)): # 改為 async def
    """
    驗證成功後開通帳號。
    """
    # 呼叫異步 CRUD (必須 await)
    user = await user_crud.verify_user_token(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="驗證碼無效或已過期"
        )
    return {"message": "帳號驗證成功！您現在可以登入了。"}