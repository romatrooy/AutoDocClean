from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean(), default=True)
    google_id = Column(String, unique=True, nullable=True)
    google_token = Column(String, nullable=True)
    google_refresh_token = Column(String, nullable=True)

    templates = relationship("Template", back_populates="user")
