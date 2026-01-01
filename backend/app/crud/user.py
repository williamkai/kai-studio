from sqlalchemy.orm import Session
from .. import models
from ..schemas.user import UserCreate
from ..core.security import get_password_hash # 匯入加密工具

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: UserCreate):
    # 重點：將明文密碼加密後再存入 password_hash 欄位
    hashed_password = get_password_hash(user.password)
    
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user