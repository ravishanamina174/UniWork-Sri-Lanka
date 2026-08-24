# backend/app/models/schemas_pydantic.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Tuple

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

# --- NEW: Location Sub-Model ---
class GeoJSONLocation(BaseModel):
    type: str = "Point"
    coordinates: Tuple[float, float] = Field(..., description="[longitude, latitude]")
    address: Optional[str] = ""

# --- UPDATED: Gig Schemas ---
class GigCreateRequest(BaseModel):
    title: str
    description: str
    budget: float
    deadline: str
    skills_required: List[str] = []
    poster_clerk_id: str
    task_type: str = "remote"  # Expected: 'remote' or 'on-site'
    location: Optional[GeoJSONLocation] = None

class GigResponse(BaseModel):
    id: str
    title: str
    description: str
    budget: float
    deadline: str
    skills_required: List[str]
    poster_clerk_id: str
    created_at: str
    task_type: str
    location: Optional[GeoJSONLocation] = None

class ProfileUpdateRequest(BaseModel):
    display_name: str
    email: EmailStr
    phone_number: str
    address: Optional[str] = ""
    bio: Optional[str] = ""
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
    metadata: dict
    metrics: dict

# --- NEW: Application Schemas ---

class ApplicationCreateRequest(BaseModel):
    student_clerk_id: str
    gig_id: str
    student_message: Optional[str] = ""

class ApplicationStatusUpdateRequest(BaseModel):
    status: str  # "pending" or "approve"

class ApplicationResponse(BaseModel):
    id: str
    student_clerk_id: str
    gig_id: str
    gig_title: str
    poster_clerk_id: str
    applied: bool
    student_message: str
    applied_at: str
    task_deadline: str
    student_display_name: str
    student_university_campus: str
    student_reputation_rating: float
    student_completed_tasks: int
    application_confirm: str = "pending"
    
class MessageCreate(BaseModel):
    application_id: str
    sender_id: str
    text: str

class MessageResponse(BaseModel):
    id: str
    application_id: str
    sender_id: str
    text: str
    timestamp: datetime



# --- NEW: Task Starter Schemas ---

class InitiateStartRequest(BaseModel):
    application_id: str

class VerifyStartCodeRequest(BaseModel):
    application_id: str
    code: str

class VerifyLocationRequest(BaseModel):
    application_id: str
    latitude: float
    longitude: float

class InitiateEndRequest(BaseModel):
    application_id: str

class VerifyEndCodeRequest(BaseModel):
    application_id: str
    code: str

class StudentEndTaskRequest(BaseModel):
    application_id: str

class StartedTaskResponse(BaseModel):
    id: str
    application_id: str
    task_start: bool
    inside_location_approve: bool
    task_close: bool
    task_start_time: Optional[str] = None
    task_close_time: Optional[str] = None
    start_code: Optional[str] = None
    end_code: Optional[str] = None


# --- NEW:User Feedback ---

class FeedbackCreate(BaseModel):
    user_clerk_id: str
    user_role: Optional[str] = "student"
    issue_cards: List[str] = Field(default_factory=list)
    feedback_description: Optional[str] = ""

class FeedbackResponse(BaseModel):
    id: str
    user_clerk_id: str
    user_role: str
    issue_cards: List[str]
    feedback_description: str
    created_at: datetime