# backend/app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio

# -----------------------
# 核心設定與資料庫
from app.core.config import settings                 # 專案設定
from app.infrastructure.database.database import engine  # DB 連線與 metadata
from app.tasks.cleanup import run_cleanup_scheduler  # 背景排程

# -----------------------
# 拆出去的功能
from app.core.handlers import register_exception_handlers  # 全域異常處理器
from app.core.cors import register_cors                    # CORS 設定
from app.api.v1.router import api_router                  # API 路由整合
from app.infrastructure.rate_limit.limiter import limiter, rate_limit_exceeded_handler  # Rate-limit

# =======================
# FastAPI 生命週期管理
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    - 啟動背景排程
    - 關閉時釋放 DB 連線
    """
    print("應用程式啟動中...")

    asyncio.create_task(run_cleanup_scheduler())
    yield
    print("應用程式關閉中...")
    await engine.dispose()


# =======================
# 建立 FastAPI app 實例
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
### Kai Studio 核心 API 文檔
這是一個結合 FastAPI 與 React 的全端專案。
- **開發者**: Kai
- **版本**: 1.0.0
- **環境**: 開發模式 (Development)
""",
    version="1.0.0",
    lifespan=lifespan
)


# =======================
# Rate-limit 設定
# 功能檔案: app/infrastructure/rate_limit/limiter.py
app.state.limiter = limiter
app.add_exception_handler(Exception, rate_limit_exceeded_handler)


# =======================
# 註冊全域異常處理器
# 功能檔案: app/core/handlers.py
register_exception_handlers(app)


# =======================
# 註冊 CORS
# 功能檔案: app/core/cors.py
register_cors(app)


# =======================
# 註冊路由
# 功能檔案: app/api/v1/router.py
app.include_router(api_router, prefix="/api/v1")


# =======================
# 系統測試路由 (可保留在 main.py)
@app.get("/", tags=["系統測試"])
async def root():
    return {"message": f"{settings.PROJECT_NAME} API 運行中"}


@app.get("/health-check", tags=["系統測試"])
async def health_check():
    return {"status": "ok", "structure": "full-async"}
