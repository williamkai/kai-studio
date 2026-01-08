from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import user as user_crud
from app.application.services.email import send_verification_email
from app.core.security import generate_email_verification_token

async def register_user(user_data, db: AsyncSession, background_tasks):
    """
    註冊新使用者並寄送驗證信
    """
    # 1. 查重
    db_user = await user_crud.get_user_by_email(db, user_data.email)
    if db_user:
        return None, "EMAIL_ALREADY_EXISTS"
    
    # 2. 建立使用者
    new_user = await user_crud.create_user(db, user_data)
    if not new_user:
        return None, "DATABASE_WRITE_ERROR"
    
    # 3. 產生驗證 Token
    email_token = generate_email_verification_token(str(new_user.email))
    
    # 4. 加入背景任務寄信
    background_tasks.add_task(
        send_verification_email,
        email=str(new_user.email),
        token=email_token
    )

    return new_user, None


async def verify_user_email(token: str, db: AsyncSession):
    """
    驗證使用者帳號
    """
    user = await user_crud.verify_user_by_token(db, token)
    if not user:
        return None
    return user


async def resend_verification_email(email: str, db: AsyncSession, background_tasks):
    """
    重新發送驗證信
    """
    user = await user_crud.get_user_by_email(db, email)
    if not user or user.is_active:
        return "VERIFICATION_EMAIL_SENT_IF_APPLICABLE"
    
    email_token = generate_email_verification_token(str(user.email))
    background_tasks.add_task(
        send_verification_email,
        email=str(user.email),
        token=email_token
    )
    return "VERIFICATION_EMAIL_SENT_IF_APPLICABLE"
