import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Union, Optional
from jose import jwt, JWTError
from .config import settings

# --- 密碼加密 ---
def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    user_input_bytes = plain_password.encode('utf-8')
    db_hash_bytes = hashed_password.encode('utf-8')
    try:
        return bcrypt.checkpw(user_input_bytes, db_hash_bytes)
    except Exception:
        return False

# --- JWT Token ---
def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def generate_email_verification_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)
    return create_access_token(data={"sub": email}, expires_delta=delta)

def verify_email_verification_token(token: str) -> Optional[str]:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return decoded_token.get("sub")
    except JWTError:
        return None
