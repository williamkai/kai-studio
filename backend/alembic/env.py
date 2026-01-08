# backend/alembic/env.py
"""Alembic env.py 用於資料庫遷移設定"""
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Alembic Config object
config = context.config

# 設定 logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# -------------------------------------------------
# 載入你專案的設定與 models
# -------------------------------------------------
from app.core.config import settings
from app import models


target_metadata = models.Base.metadata



def get_sync_database_url() -> str:
    """
    Alembic 不支援 async engine
    將 asyncpg URL 轉為 sync URL
    """
    return settings.DATABASE_URL.replace("+asyncpg", "")


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = get_sync_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        {
            "sqlalchemy.url": get_sync_database_url()
        },
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
