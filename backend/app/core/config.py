from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path
from typing import Optional

# 找到 .env 檔案的路徑
# 根據你的目錄結構：backend/app/core/config.py -> 往上三層是 backend/
DOTENV_PATH = Path(__file__).parent.parent.parent.parent / ".env"

class Settings(BaseSettings):
    # 定義變數名稱與類型，Pydantic 會自動去 .env 找對應的大寫名稱
    PROJECT_NAME: str = "Kai Studio"

    # 使用 Optional 並給予預設值 None，解決 Pylance 的報錯
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@localhost:5432/{self.POSTGRES_DB}"

    # 郵件設定
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "onboarding@resend.dev"
    FRONTEND_URL: str = "http://localhost:5173"

    # 讀取 .env 的設定
    model_config = SettingsConfigDict(
        env_file=DOTENV_PATH,
        env_file_encoding='utf-8',
        extra='ignore' # 如果 .env 有多餘變數就忽略
    )

    # Redis 設定
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    # JWT 設定
    SECRET_KEY: str = Field(default="你的超強加密字串") # 之後要改到 .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
# 實例化，之後在其他地方 import settings 即可
settings = Settings()