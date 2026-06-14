# backend/app/models/schemas_pydantic.py
from pydantic import BaseModel
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











# # backend/app/models/schemas_pydantic.py
# from pydantic import BaseModel
# from uuid import UUID

# # EmailStr requires the `email-validator` package. Provide a fallback
# # to `str` so the app can import without the optional package installed.
# try:
#     from pydantic import EmailStr  # type: ignore
# except Exception:
#     EmailStr = str  # type: ignore
# from typing import List, Optional
# import enum

# class PlatformRole(str, enum.Enum):
#     STUDENT_EARNER = "STUDENT_EARNER"
#     TASK_POSTER = "TASK_POSTER"
#     CORPORATE_CLIENT = "CORPORATE_CLIENT"

# class UserBase(BaseModel):
#     clerk_id: str
#     # Use plain `str` to avoid requiring the optional `email-validator` package
#     email: str
#     role: PlatformRole
#     phone_number: str

# class StudentRegisterRequest(UserBase):
#     encrypted_uni_id: str
#     faculty: str
#     nic: str
#     display_name: str
#     university_campus: str
#     academic_department: str
#     skill_tags: List[str]

# class PosterRegisterRequest(UserBase):
#     full_name: str
#     nic: str

# class UserResponse(BaseModel):
#     id: UUID
#     clerk_id: str
#     email: str
#     role: PlatformRole
#     is_verified: bool
#     phone_number: str

#     class Config:
#         from_attributes = True



