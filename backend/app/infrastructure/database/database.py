from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from ...core.config import settings

# -----------------------------
# 建立異步 engine，給 FastAPI 的異步 CRUD 使用
# 注意：這個 engine 只用來做資料操作，不用來創建表
engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)

# 建立異步 Session 工廠
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# 取得異步資料庫 Session 的生成器
# FastAPI route 裡面可直接依賴注入 db: AsyncSession
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

# -----------------------------
# 同步 Base，專門給 Alembic 使用
# 原本的 Base 是繼承 DeclarativeBase（異步），主要用在 models 的繼承
# 但是 Alembic 無法抓取異步 Base 的 metadata 來生成 migration
# 且創建表格其實不需要異步，所有表都可以用同步 Base
# 所以這邊改用同步 Base，FastAPI CRUD 還是可以用異步操作
Base = declarative_base()
