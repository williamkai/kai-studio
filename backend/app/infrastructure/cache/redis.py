import redis.asyncio as redis
from ...core.config import settings

# -----------------------------
# 使用 REDIS_URL 初始化異步 Redis client
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
