# backend/app/api/v1/endpoints/note.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ....database import get_db
from ....schemas.note import NoteCreate, NoteOut
from ....crud import note as note_crud
from ..deps import get_current_user

router = APIRouter()

# --- 1. 全站公開 API (免登入即可存取) ---

@router.get("/public", response_model=List[NoteOut])
async def list_public_notes(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    全站公開區：讀取所有 status=3 且已審核發佈的內容。
    """
    return await note_crud.get_public_notes(db, skip=skip, limit=limit)

# --- 2. 個人筆記 API (需登入) ---

@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
async def create_new_note(
    note_in: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """建立筆記：自動綁定當前登入使用者為作者。"""
    return await note_crud.create_note(db, obj_in=note_in, author_id=current_user.id)

@router.get("/me", response_model=List[NoteOut])
async def list_my_notes(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """取得當前使用者自己的所有筆記（包含私有與編輯中草稿）。"""
    return await note_crud.get_user_notes(db, author_id=current_user.id)

@router.patch("/{note_id}", response_model=NoteOut)
async def update_my_note(
    note_id: int,
    note_in: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    更新筆記：僅限作者本人。
    若更新公開筆記內容，系統會自動將 sync_status 標記為 1 (待審核)。
    """
    note = await note_crud.get_note_by_id(db, note_id=note_id)
    if not note:
        raise HTTPException(status_code=404, detail="找不到此筆記")
    
    if note.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="你沒有權限修改此筆記")
    
    # exclude_unset=True 確保沒傳入的欄位不會被 Pydantic 的預設值蓋掉
    update_data = note_in.model_dump(exclude_unset=True)
    return await note_crud.update_note(db, db_obj=note, obj_in=update_data)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """刪除筆記：僅限作者本人。"""
    note = await note_crud.get_note_by_id(db, note_id=note_id)
    if not note:
        raise HTTPException(status_code=404, detail="找不到此筆記")
        
    if note.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="你沒有權限刪除此筆記")
    
    await note_crud.delete_note(db, db_obj=note)
    return None