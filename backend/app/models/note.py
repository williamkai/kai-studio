# backend/app/models/note.py
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING
from ..database import Base

if TYPE_CHECKING:
    from .user import User

class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True, nullable=False)
    content_json: Mapped[Optional[str]] = mapped_column(Text)
    published_content: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[int] = mapped_column(default=0)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    sync_status: Mapped[int] = mapped_column(default=0)

    # 與 User 的多對一關聯
    author: Mapped["User"] = relationship(back_populates="notes")