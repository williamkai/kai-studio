from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from fastapi import Request
from starlette.responses import Response

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

def rate_limit_exceeded_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, RateLimitExceeded):
        raise exc
    return _rate_limit_exceeded_handler(request, exc)

# # backend/app/infrastructure/rate_limit/limiter.py
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.errors import RateLimitExceeded
# from slowapi.util import get_remote_address  # ✅ 這行是缺的
# from fastapi import Request
# from starlette.responses import Response

# # === Limiter instance ===
# limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

# # === Rate limit exception handler ===
# def rate_limit_exceeded_handler(request: Request, exc: Exception) -> Response:
#     # 型別守衛（讓 IDE + 人類安心）
#     if not isinstance(exc, RateLimitExceeded):
#         raise exc

#     return _rate_limit_exceeded_handler(request, exc)
