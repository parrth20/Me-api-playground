# models.py
from sqlalchemy import Column, Text, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True)
    headline = Column(Text)
    education = Column(JSONB)
    skills = Column(JSONB, nullable=False, default=list)
    projects = Column(JSONB, nullable=False, default=list)
    links = Column(JSONB)
    bio = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
