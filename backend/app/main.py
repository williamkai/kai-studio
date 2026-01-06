from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.v1.endpoints import note, user, auth
from .core.config import settings
from . import models
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    await engine.dispose()

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

# --- 1. 全域異常處理器 (Global Exception Handlers) ---

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    """捕捉所有手動 raise 的 HTTPException"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": f"ERR_{exc.status_code}", # 產生統一代碼
            "message": "請求處理失敗"
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """捕捉 FastAPI 自動生成的 Pydantic 資料驗證錯誤 (如 Email 格式不符)"""
    # 提取錯誤欄位與原因
    errors = exc.errors()
    error_msg = f"資料格式錯誤: {errors[0]['msg']} (欄位: {errors[0]['loc'][-1]})"
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": error_msg,
            "error_code": "VALIDATION_ERROR",
            "message": "輸入資料驗證失敗"
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """捕捉所有未知的程式錯誤 (避免噴出 raw traceback)"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "伺服器發生未預期的錯誤，請聯繫管理員",
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": str(exc) if settings.DEBUG else "Internal Server Error"
        },
    )

# --- 2. 配置 CORS ---

origins = [
    settings.FRONTEND_URL,      # http://localhost:5173
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. 匯入路由 ---
app.include_router(user.router, prefix="/api/v1/users", tags=["使用者管理 (Users)"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["認證管理 (Auth)"])
app.include_router(note.router, prefix="/api/v1/notes", tags=["筆記管理 (Notes)"])

@app.get("/", tags=["系統測試"])
async def root():
    return {"message": "Kai Studio API 運行中"}

@app.get("/health-check", tags=["系統測試"])
async def health_check():
    return {"status": "ok", "structure": "full-async"}