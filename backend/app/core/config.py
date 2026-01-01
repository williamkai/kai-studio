import os
from dotenv import load_dotenv
from pathlib import Path

# 指向根目錄的 .env (app 的上上一層)
env_path = Path(__file__).parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Kai Studio"
    DATABASE_URL: str = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@localhost:5432/{os.getenv('POSTGRES_DB')}"

settings = Settings()