from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from .core.config import settings

# 1. 檢查你的 settings.DATABASE_URL
# 注意：異步連線字串必須以 +asyncpg (PostgreSQL) 或 +aiomysql (MySQL) 開頭
# 例如：postgresql+asyncpg://user:password@localhost/dbname
# 如果你的 config 裡沒改，可以在這裡暫時用 replace 處理，但建議去 .env 改掉
async_db_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# 2. 建立異步引擎 (AsyncEngine)
engine = create_async_engine(
    async_db_url,
    echo=True,           # 開發環境開啟 echo 可以看到執行的 SQL 指令，很有幫助
    future=True          # 確保使用 SQLAlchemy 2.0 模式
)

# 3. 建立異步 Session 工廠
# expire_on_commit=False 是異步模式的標準做法，防止 commit 後物件失效
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# 4. 使用 2.0 風格的 Base 定義
class Base(DeclarativeBase):
    pass

# 5. 核心：將 get_db 改為異步生成器
async def get_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            # 異步環境下 async with 會自動處理關閉，
            # 但你也可以明確寫出來
            await db.close()
            
# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from .core.config import settings # 改從 config 讀取 URL

# engine = create_engine(settings.DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()