# backend/app/models/domain_postgres.py
from sqlalchemy import Column, String, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from app.core.database import Base

# (Keep your existing GigState and GigModel code here) ...

class PlatformRoleEnum(enum.Enum):
    STUDENT_EARNER = "STUDENT_EARNER"
    TASK_POSTER = "TASK_POSTER"
    CORPORATE_CLIENT = "CORPORATE_CLIENT"

class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(SQLEnum(PlatformRoleEnum), nullable=False)
    is_verified = Column(Boolean, default=False)
    phone_number = Column(String(20), nullable=False)

class StudentProfileModel(Base):
    __tablename__ = "student_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    encrypted_uni_id = Column(String, nullable=False)
    faculty = Column(String(150), nullable=False)
    nic_hash = Column(String(64), nullable=False)

class PosterProfileModel(Base):
    __tablename__ = "poster_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    full_name = Column(String(255), nullable=False)
    nic_hash = Column(String(64), nullable=False)