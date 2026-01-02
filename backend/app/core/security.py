# backend/app/core/security.py
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt
from .config import settings

# --- 密碼加密部分 (保留你原本的 bcrypt 寫法) ---

def get_password_hash(password: str) -> str:
    """
    將明文密碼轉成加密亂碼
    """
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password_bytes.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    驗證用戶輸入的密碼，是否跟資料庫存的那串亂碼匹配
    """
    user_input_bytes = plain_password.encode('utf-8')
    db_hash_bytes = hashed_password.encode('utf-8')
    # 使用 try-except 是為了防止資料庫裡面的舊資料格式不對導致程式當掉
    try:
        return bcrypt.checkpw(user_input_bytes, db_hash_bytes)
    except Exception:
        return False


# --- JWT 通行證部分 (新增的擴充) ---

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    """
    產生 JWT Token (數位通行證)
    """
    to_encode = data.copy()
    
    # 設定過期時間
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # 如果沒指定，預設 15 分鐘過期
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    # 將過期時間加入 Token 的資料內容中
    to_encode.update({"exp": expire})
    
    # 使用 config.py 裡的 SECRET_KEY 和 演算法進行加密簽署
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt