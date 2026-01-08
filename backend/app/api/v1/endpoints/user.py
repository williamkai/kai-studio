# src/app/api/v1/endpoints/user.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from ....infrastructure.database.database import get_db
from .... import schemas
from ....application.services import user as user_service
from ....infrastructure.rate_limit.limiter import limiter
from ..examples.user_examples import (
    register_user_example,
    verify_email_example,
    resend_verification_example,
    error_email_exists_example,
    error_rate_limit_example,
    error_invalid_token_example,
    user_out_example
)
from ..descriptions.user_description import (
    register_user_description,
    verify_email_description,
    resend_verification_description
)
from ....core.security import verify_turnstile_token

router = APIRouter()

# ----------------------------
# 註冊新使用者
# ----------------------------
@router.post(
    "",
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="🚀 註冊新使用者 (POST)",
    description=register_user_description,
    responses={
        201: {"description": "使用者建立成功，並已發送驗證郵件",
              "content": {"application/json": {"example": register_user_example}}},
        400: {"description": "Email 已存在、資料驗證失敗或 Turnstile 驗證失敗",
              "content": {"application/json": {"example": error_email_exists_example}}},
        429: {"description": "請求頻率過高",
              "content": {"application/json": {"example": error_rate_limit_example}}},
    }
)
@limiter.limit("5/minute")
async def register(
    request: Request,
    user: schemas.UserCreate,
    turnstileToken: str,  # 前端必須傳來的 Turnstile token
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    註冊使用者流程：
    1. 驗證 Cloudflare Turnstile token
    2. 若成功，呼叫 user_service.register_user 建立新使用者
    3. 回傳 UserOut
    """
    # 取得使用者 IP
    client_host = request.client.host if request.client else None

    # 1️⃣ 驗證 Turnstile token
    is_human = await verify_turnstile_token(turnstileToken, remote_ip=client_host)
    if not is_human:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="TURNSTILE_VALIDATION_FAILED")

    # 2️⃣ 呼叫 service 註冊使用者
    new_user, error = await user_service.register_user(user, db, background_tasks)

    # 3️⃣ 處理錯誤
    if error == "EMAIL_ALREADY_EXISTS":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="EMAIL_ALREADY_EXISTS")
    if error == "DATABASE_WRITE_ERROR":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DATABASE_WRITE_ERROR")

    # 4️⃣ 成功回傳
    return new_user


# ----------------------------
# 驗證電子郵件
# ----------------------------
@router.get(
    "/verify",
    response_model=schemas.MessageResponse,
    summary="📧 驗證電子郵件 (GET)",
    description=verify_email_description,
    responses={
        200: {"description": "電子郵件驗證成功",
              "content": {"application/json": {"example": verify_email_example}}},
        400: {"description": "Token 無效或過期",
              "content": {"application/json": {"example": error_invalid_token_example}}},
    },
)
async def verify_email(
    request: Request,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    驗證 email token 是否有效
    成功 -> 回傳 message
    失敗 -> HTTP 400
    """
    user = await user_service.verify_user_email(token, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_OR_EXPIRED_TOKEN")
    return {"message": "VERIFICATION_SUCCESS"}


# ----------------------------
# 重新發送驗證郵件
# ----------------------------
@router.post(
    "/resend-verification",
    response_model=schemas.MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="📬 重新發送驗證郵件 (POST)",
    description=resend_verification_description,
    responses={
        200: {"description": "重新發送驗證郵件請求已處理",
              "content": {"application/json": {"example": resend_verification_example}}},
        429: {"description": "請求頻率過高",
              "content": {"example": error_rate_limit_example}},
    }
)
@limiter.limit("3/minute")
async def resend_verification_email(
    request: Request,
    req_body: schemas.ResendVerificationRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    重新發送 email 驗證信
    """
    message = await user_service.resend_verification_email(req_body.email, db, background_tasks)
    return {"message": message}
