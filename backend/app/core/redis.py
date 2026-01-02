# backend/app/core/redis.py
import redis.asyncio as redis  # 重點：匯入 asyncio 版本
from .config import settings

# 建立 異步 Redis 連線池
# 注意：在異步版本中，建議直接使用 from_url 或維持原樣但確保類別正確
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True  # 這會讓回傳值直接是字串而非 bytes
)