# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import hashlib

# Import your database session dependency (adjust path if needed)
from app.core.database import get_db 
from app.models.domain_postgres import UserModel, StudentProfileModel, PosterProfileModel, PlatformRoleEnum
from app.models.schemas_pydantic import StudentRegisterRequest, PosterRegisterRequest, UserResponse

# Create the router instead of 'app'
router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def hash_identity_string(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

@router.post("/register/student", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentRegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Account already registered.")

    new_user = UserModel(
        clerk_id=payload.clerk_id,
        email=payload.email,
        role=PlatformRoleEnum.STUDENT_EARNER,
        phone_number=payload.phone_number,
        is_verified=payload.email.endswith(".ac.lk")
    )
    db.add(new_user)
    db.flush()

    student_meta = StudentProfileModel(
        user_id=new_user.id,
        encrypted_uni_id=payload.encrypted_uni_id,
        faculty=payload.faculty,
        nic_hash=hash_identity_string(payload.nic)
    )
    db.add(student_meta)

    # Note: Add your MongoDB insert logic here when ready
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/register/poster", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_poster(payload: PosterRegisterRequest, db: Session = Depends(get_db)):
    # ... (Poster registration logic from previous step)
    pass

@router.get("/user/clerk/{clerk_id}", response_model=UserResponse)
def get_user_by_clerk_id(clerk_id: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"User with Clerk ID '{clerk_id}' not found."
        )
    return user

@router.get("/user/internal/{user_id}", response_model=UserResponse)
def get_user_by_internal_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"User with internal ID '{user_id}' not found."
        )
    return user