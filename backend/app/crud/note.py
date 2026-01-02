# backend/app/crud/note.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.note import Note
from ..schemas.note import NoteCreate

async def create_note(db: AsyncSession, obj_in: NoteCreate, author_id: int):
    """建立筆記"""
    db_obj = Note(
        **obj_in.model_dump(),
        author_id=author_id
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_user_notes(db: AsyncSession, author_id: int):
    """取得該使用者的所有筆記"""
    result = await db.execute(
        select(Note).where(Note.author_id == author_id)
    )
    return result.scalars().all()

async def get_public_notes(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    取得全站公開 (status=3) 且已發佈內容不為空的筆記
    """
    result = await db.execute(
        select(Note)
        .where(Note.status == 3)
        .where(Note.published_content.is_not(None)) # 只有審核過有內容的才顯示
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def get_note_by_id(db: AsyncSession, note_id: int):
    """透過 ID 取得單篇筆記 (用於權限檢查)"""
    result = await db.execute(select(Note).where(Note.id == note_id))
    return result.scalar_one_or_none()

async def update_note(db: AsyncSession, db_obj: Note, obj_in: dict):
    """更新筆記邏輯 (含雙版本審核機制)"""
    for field, value in obj_in.items():
        if hasattr(db_obj, field):
            setattr(db_obj, field, value)
    
    # 雙版本審核判定
    if db_obj.status == 3 and db_obj.content_json != db_obj.published_content:
        db_obj.sync_status = 1  # 1-待審核
    else:
        db_obj.sync_status = 0  
        
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def delete_note(db: AsyncSession, db_obj: Note):
    """刪除筆記"""
    await db.delete(db_obj)
    await db.commit()
    return True