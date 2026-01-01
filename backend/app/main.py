from fastapi import FastAPI
from .database import engine, Base
from .api.v1.endpoints import users # 匯入你剛寫好的路由
from . import models

# 1. 啟動時自動檢查並建立資料庫表格
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kai Studio")

# 2. 匯入 v1 的路由 (這會自動包含你寫在 users.py 裡的註冊功能)
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "Kai Studio API 結構化版本運行中"}

# 之前的測試路由可以保留或刪除，建議保留用來確認連線
@app.get("/health-check")
def health_check():
    return {"status": "ok", "structure": "professional-multilevel"}