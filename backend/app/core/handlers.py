from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.config import settings

def register_exception_handlers(app: FastAPI):

    @app.exception_handler(HTTPException)
    async def custom_http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.detail,
                "error_code": f"ERR_{exc.status_code}",
                "message": "請求處理失敗"
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
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
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "伺服器發生未預期的錯誤，請聯繫管理員",
                "error_code": "INTERNAL_SERVER_ERROR",
                "message": str(exc) if settings.DEBUG else "Internal Server Error"
            },
        )

# from fastapi import Request, status
# from fastapi.responses import JSONResponse
# from fastapi.exceptions import RequestValidationError
# from fastapi import HTTPException
# from app.core.config import settings

# def register_exception_handlers(app):
#     @app.exception_handler(HTTPException)
#     async def custom_http_exception_handler(request: Request, exc: HTTPException):
#         return JSONResponse(
#             status_code=exc.status_code,
#             content={"detail": exc.detail, "error_code": f"ERR_{exc.status_code}", "message": "請求處理失敗"}
#         )

#     @app.exception_handler(RequestValidationError)
#     async def validation_exception_handler(request: Request, exc: RequestValidationError):
#         errors = exc.errors()
#         error_msg = f"資料格式錯誤: {errors[0]['msg']} (欄位: {errors[0]['loc'][-1]})"
#         return JSONResponse(
#             status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#             content={"detail": error_msg, "error_code": "VALIDATION_ERROR", "message": "輸入資料驗證失敗"}
#         )

#     @app.exception_handler(Exception)
#     async def global_exception_handler(request: Request, exc: Exception):
#         return JSONResponse(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             content={"detail": "伺服器發生未預期的錯誤", "error_code": "INTERNAL_SERVER_ERROR", "message": str(exc) if settings.DEBUG else "Internal Server Error"}
#         )
