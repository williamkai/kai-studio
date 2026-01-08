# app/core/security.py
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Union, Optional
from jose import jwt, JWTError
import httpx
from fastapi import Request
from .config import settings

# ----------------------------
# 密碼相關函數
# ----------------------------

def get_password_hash(password: str) -> str:
    """
    將明文密碼轉換成 bcrypt hash
    用於存入資料庫
    """
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password_bytes.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    驗證使用者輸入的密碼是否與資料庫中的 hash 匹配
    返回 True / False
    """
    user_input_bytes = plain_password.encode('utf-8')
    db_hash_bytes = hashed_password.encode('utf-8')
    try:
        return bcrypt.checkpw(user_input_bytes, db_hash_bytes)
    except Exception:
        return False


# ----------------------------
# JWT Token 相關函數
# ----------------------------

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    """
    建立 JWT Access Token
    data: dict -> 要加到 token 裡的 payload (如 user_id)
    expires_delta: 過期時間 (timedelta)，預設 15 分鐘
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def generate_email_verification_token(email: str) -> str:
    """
    建立 email 驗證專用的 JWT token
    過期時間由 settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS 決定
    """
    delta = timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)
    return create_access_token(data={"sub": email}, expires_delta=delta)


def verify_email_verification_token(token: str) -> Optional[str]:
    """
    驗證 email 驗證 token 是否有效
    成功回傳 email，失敗回傳 None
    """
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return decoded_token.get("sub")
    except JWTError:
        return None


# ----------------------------
# Cloudflare Turnstile 驗證
# ----------------------------

async def verify_turnstile_token(token: str, remote_ip: Optional[str] = None) -> bool:
    """
    驗證 Cloudflare Turnstile token 是否有效
    token: 前端傳過來的 turnstile token
    remote_ip: 客戶端 IP (可選)
    返回 True / False
    """
    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    payload = {
        "secret": settings.TURNSTILE_SECRET_KEY,
        "response": token
    }
    if remote_ip:
        payload["remoteip"] = remote_ip

    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(url, data=payload, timeout=5)
            r.raise_for_status()
            result = r.json()
            # success 為 True 表示驗證成功
            return result.get("success", False)
        except Exception:
            # 若呼叫 Cloudflare API 發生例外，視為驗證失敗
            return False
