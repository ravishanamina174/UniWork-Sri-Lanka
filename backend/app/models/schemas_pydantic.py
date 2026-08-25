# backend/app/models/schemas_pydantic.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field , field_validator
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

    
# --- AI suggestion Gig Schemas ---
class AIEnhanceRequest(BaseModel):
    text: str
    field_type: str  # Expects "title" or "description"

class AIEnhanceResponse(BaseModel):
    enhanced_text: str


class ProfileUpdateRequest(BaseModel):
    display_name: str
    email: EmailStr
    phone_number: str
    address: Optional[str] = ""
    bio: Optional[str] = ""
    skill_tags: Optional[List[str]] = []
    business_name: Optional[str] = ""
    # Emergency safety fields
    is_safety_enabled: Optional[bool] = False
    emergency_whatsapp_number: Optional[str] = ""

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
    # Emergency safety fields
    is_safety_enabled: bool = False
    emergency_whatsapp_number: str = ""

class TaskCompletionRequest(BaseModel):
    earned_amount: float = Field(..., ge=0, description="Amount received by the student for the task (LKR)")

# Request schema for emergency location check-in logs
class EmergencyLogRequest(BaseModel):
    clerk_id: str
    latitude: float
    longitude: float
    application_id: Optional[str] = None

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

class ProfessionalWorkerProfileCreateUpdate(BaseModel):
    student_clerk_id: str
    display_name: str
    phone_number: str
    bio: str = Field(..., max_length=2000, description="Professional summary (max 300 words)")
    skills: List[str] = Field(..., max_items=10, description="Up to 10 skills")
    primary_location: str
    secondary_location: Optional[str] = None
    working_hours: str  # e.g., "Weekends only", "After 5 PM", "Full-time during holidays", "Everyday", "Every weekday"
    languages: List[str]  # e.g., ["Sinhala", "English"]
    transportation: str  # e.g., "Motorbike", "Public Transit Only"

    @field_validator("bio")
    @classmethod
    def validate_bio_word_count(cls, v: str) -> str: 
        words = v.strip().split()
        if len(words) > 300:
            raise ValueError("Bio must not exceed 300 words.")
        return v

class ProfessionalWorkerProfileResponse(ProfessionalWorkerProfileCreateUpdate):
    updated_at: str

class StudentLookupRequest(BaseModel):
    poster_query: str = Field(..., description="Natural language description of desired candidate")
    limit: Optional[int] = 5

class MatchedStudentDetail(BaseModel):
    student_clerk_id: str
    display_name: str
    fit_score: int  # 1-100 score
    match_reason: str
    primary_location: str
    secondary_location: Optional[str] = None
    skills: List[str]
    working_hours: str
    transportation: str
    completed_tasks: int
    total_earnings: float

class StudentLookupResponse(BaseModel):
    status: str = "success"
    query: str
    total_candidates_analyzed: int
    filtered_student_clerk_ids: List[str]
    matched_students: List[MatchedStudentDetail]