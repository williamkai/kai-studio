# backend/app/schemas/common.py
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    detail: str
    error_code: str
    message: str  # 建議加上 message，方便 Swagger 顯示完整訊息

class MessageResponse(BaseModel):
    message: str

# ----------- 共用錯誤範例 -----------
Error_EMAIL_EXISTS = {
    "detail": "EMAIL_ALREADY_EXISTS",
    "error_code": "USER_001",
    "message": "請求處理失敗"
}

Error_DATABASE = {
    "detail": "DATABASE_WRITE_ERROR",
    "error_code": "DB_001",
    "message": "資料庫寫入失敗"
}

Error_RATE_LIMIT_5 = {
    "detail": "Rate limit exceeded: 5 per 1 minute",
    "error_code": "ERR_429",
    "message": "請求處理失敗"
}

Error_RATE_LIMIT_3 = {
    "detail": "Rate limit exceeded: 3 per 1 minute",
    "error_code": "ERR_429",
    "message": "請求處理失敗"
}
