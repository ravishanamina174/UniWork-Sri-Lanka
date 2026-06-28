# backend/app/models/schemas_pydantic.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class BaseRegisterRequest(BaseModel):
    clerk_id: str
    email: str
    phone_number: str
    display_name: str  # For MongoDB

class StudentRegisterRequest(BaseRegisterRequest):
    encrypted_uni_id: str
    faculty: str
    nic: str
    university_campus: str
    academic_department: str
    skill_tags: Optional[List[str]] = []

class PosterRegisterRequest(BaseRegisterRequest):
    nic: str

class CorporateRegisterRequest(BaseRegisterRequest):
    business_name: str
    registration_number: str

class UserResponse(BaseModel):
    id: str
    clerk_id: str
    email: str
    role: str
    is_verified: bool

    class Config:
        orm_mode = True

class GigCreateRequest(BaseModel):
    title: str
    description: str
    budget: float
    deadline: str
    skills_required: List[str] = []
    poster_clerk_id: str

class GigResponse(BaseModel):
    id: str
    title: str
    description: str
    budget: float
    deadline: str
    skills_required: List[str]
    poster_clerk_id: str
    created_at: str

# For updating user profile Data
class ProfileUpdateRequest(BaseModel):
    display_name: str
    email: EmailStr
    phone_number: str
    address: Optional[str] = ""
    bio: Optional[str] = ""
    # Role specific fields (Optional depending on who updates)
    skill_tags: Optional[List[str]] = []
    business_name: Optional[str] = ""

class ProfileResponse(BaseModel):
    clerk_id: str
    role: str
    display_name: str
    email: str
    phone_number: str
    address: str
    bio: str
    # Role-based structures
    metadata: dict
    metrics: dict