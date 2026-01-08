# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path
from typing import Optional

# -----------------------------
# 環境檔路徑
DOTENV_PATH = Path(__file__).parent.parent.parent / ".env"

class Settings(BaseSettings):
    # --- 基本資訊 ---
    PROJECT_NAME: str = "Kai Studio"
    DEBUG: bool = Field(default=False, description="是否開啟偵錯模式")

    # --- PostgreSQL 設定 ---
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    @property
    def DATABASE_URL(self) -> str:
        """
        返回完整的異步資料庫連線字串，適用於 SQLAlchemy async
        """
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # --- Redis 設定 ---
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    @property
    def REDIS_URL(self) -> str:
        """
        返回 Redis 連線 URL，支援密碼
        """
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # --- JWT 設定 ---
    SECRET_KEY: str = Field(default="你的超強加密字串")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS: int = 1

    # --- 郵件設定 ---
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "onboarding@resend.dev"
    FRONTEND_URL: str = "http://localhost:5173"

    # --- 清理設定 ---
    UNVERIFIED_ACCOUNT_CLEANUP_HOURS: int = 24

    # --- Cloudflare Turnstile ---
    TURNSTILE_SECRET_KEY: Optional[str] = None

    # --- Pydantic 設定 ---
    model_config = SettingsConfigDict(
        env_file=str(DOTENV_PATH),
        env_file_encoding='utf-8',
        extra='ignore'  # 忽略多餘變數
    )

# 全域單例，所有檔案引用 settings
settings = Settings()
