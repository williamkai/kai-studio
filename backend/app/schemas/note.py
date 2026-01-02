# backend/app/schemas/note.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 前端「新增」或「修改」筆記時發送的資料
class NoteBase(BaseModel):
    title: str
    content_json: Optional[str] = None
    status: int = 0  # 0-私有, 1-個人公開, 3-全站公開

class NoteCreate(NoteBase):
    pass

# 回傳給前端看的資料格式
class NoteOut(NoteBase):
    id: int
    author_id: int
    sync_status: int
    # 如果你想讓前端知道這篇筆記是何時建的，可以加上這個（需在 Model 補上 created_at）
    # created_at: datetime 

    class Config:
        from_attributes = True