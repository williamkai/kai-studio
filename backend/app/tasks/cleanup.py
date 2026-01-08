# backend/app/tasks/cleanup.py
import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.engine import Result
from ..infrastructure.database.database import engine
from app.core.config import settings
from app.models import User

# 任務專用 Session 工廠
AsyncSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

async def cleanup_unverified_users_task():
    """
    清理未驗證帳號
    """
    print(f"[{datetime.now(timezone.utc).isoformat()}] 開始執行背景清理任務...")

    async with AsyncSessionLocal() as session:
        try:
            # 計算未驗證帳號的截止時間
            threshold_time = datetime.now(timezone.utc) - timedelta(
                hours=settings.UNVERIFIED_ACCOUNT_CLEANUP_HOURS
            )
            # 刪除超過時間未驗證的帳號
            stmt = delete(User).where(
                User.is_active == False,
                User.created_at < threshold_time
            )

            result: Result = await session.execute(stmt)
            deleted_count = getattr(result, "rowcount", 0) or 0

            await session.commit()
            print(f"[{datetime.now(timezone.utc).isoformat()}] 清理完成，共刪除 {deleted_count} 個未驗證帳號。")

        except Exception as e:
            await session.rollback()
            print(f"背景清理任務錯誤: {e}")

async def run_cleanup_scheduler():
    """
    循環排程清理任務
    """
    print("清理排程器已啟動，第一個週期後開始執行...")
    while True:
        # 等待設定的時間間隔（小時 -> 秒）
        await asyncio.sleep(settings.UNVERIFIED_ACCOUNT_CLEANUP_HOURS * 3600)
        await cleanup_unverified_users_task()
