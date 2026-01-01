from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content_json = Column(Text)
    published_content = Column(Text)
    status = Column(Integer, default=0)
    author_id = Column(Integer, ForeignKey("users.id"))

    author = relationship("User", back_populates="notes")