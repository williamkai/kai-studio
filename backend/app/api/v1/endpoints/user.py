# backend/app/api/v1/endpoints/user.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from ....database import get_db
from .... import schemas
from ....crud import user as user_crud
from ....services.email import send_verification_email

router = APIRouter()

@router.post(
    "", 
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="🚀 註冊新使用者",
    description="""
### 建立新帳號流程說明
本端點會執行以下自動化流程：
1. **資料驗證**：檢查 Email 格式與密碼強度。
2. **查重**：確認資料庫中無重複 Email。
3. **加密**：使用 bcrypt 對密碼進行安全雜湊。
4. **非同步郵件**：註冊完成後，系統會透過 Background Tasks 自動發送驗證郵件，不會延遲回應時間。

---
> **注意**：註冊後 `is_active` 預設為 `false`，必須通過 `/verify` 驗證後方可登入。
""",
    responses={
        201: {"description": "使用者建立成功"},
        400: {
            "model": schemas.ErrorResponse, 
            "description": "用戶請求錯誤 (如 Email 重複)",
            "content": {
                "application/json": {
                    "example": {"detail": "EMAIL_ALREADY_EXISTS", "error_code": "USER_001"}
                }
            }
        },
        500: {"model": schemas.ErrorResponse, "description": "伺服器內部錯誤"}
    }
)
async def register(
    user: schemas.UserCreate, 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db)
):
    # 1. 檢查 Email (先查重)
    db_user = await user_crud.get_user_by_email(db, user.email)
    if db_user:
        # 專業做法：在 detail 傳入更細緻的代碼
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="EMAIL_ALREADY_EXISTS"
        )
    
    # 2. 建立新使用者
    new_user = await user_crud.create_user(db, user)
    
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DATABASE_WRITE_ERROR"
        )
    
    # 3. 寄出驗證郵件
    background_tasks.add_task(
        send_verification_email, 
        email=str(new_user.email), 
        token=str(new_user.verification_token)
    )
    
    return new_user

@router.get(
    "/verify", 
    summary="📧 驗證電子郵件",
    response_model=schemas.MessageResponse,
    description="驗證使用者在郵件中點擊的 Token。成功後將開啟帳號登入權限。",
    responses={
        200: {"description": "驗證成功"},
        400: {
            "model": schemas.ErrorResponse, 
            "description": "Token 無效或過期",
            "content": {
                "application/json": {
                    "example": {"detail": "INVALID_OR_EXPIRED_TOKEN", "error_code": "AUTH_001"}
                }
            }
        }
    }
)
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    user = await user_crud.verify_user_token(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="INVALID_OR_EXPIRED_TOKEN"
        )
    return {"message": "VERIFICATION_SUCCESS"}