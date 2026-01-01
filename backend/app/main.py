from fastapi import FastAPI
from .database import engine, Base
from .api.v1.endpoints import users, auth
from . import models
from contextlib import asynccontextmanager

# 1. 使用 Lifespan 替代直接呼叫 create_all
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時執行：使用異步方式建立表格
    async with engine.begin() as conn:
        # 注意：這裡必須使用 run_sync，因為 metadata.create_all 本身不支援 await
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    # 關閉時執行 (如果需要釋放資源可以寫在這裡)
    await engine.dispose()

# 2. 初始化 FastAPI 並掛載 lifespan
app = FastAPI(
    title="Kai Studio",
    lifespan=lifespan
)

# 3. 匯入路由
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

@app.get("/")
async def root(): # 順手改成 async
    return {"message": "Kai Studio API 全異步版本運行中"}

@app.get("/health-check")
async def health_check(): # 順手改成 async
    return {"status": "ok", "structure": "full-async"}