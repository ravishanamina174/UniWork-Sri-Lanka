# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import hashlib

from app.core.database import get_db, mongo_db 
from app.models.domain_postgres import UserModel, StudentProfileModel, PosterProfileModel, CorporateProfileModel, PlatformRoleEnum
from app.models.schemas_pydantic import StudentRegisterRequest, PosterRegisterRequest, CorporateRegisterRequest

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def hash_identity_string(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

@router.post("/register/student", status_code=status.HTTP_201_CREATED)
async def register_student(payload: StudentRegisterRequest, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Account already registered.")

    try:
        # 1. Prepare Base relational row
        new_user = UserModel(
            clerk_id=payload.clerk_id,
            email=payload.email,
            role=PlatformRoleEnum.STUDENT_EARNER,
            phone_number=payload.phone_number,
            is_verified=payload.email.endswith(".ac.lk")
        )
        db.add(new_user)
        db.flush()  # Generates the UUID instantly for relational linking

        # 2. Link Sub-table profile structure
        student_meta = StudentProfileModel(
            user_id=new_user.id,
            encrypted_uni_id=payload.encrypted_uni_id,
            faculty=payload.faculty,
            nic_hash=hash_identity_string(payload.nic)
        )
        db.add(student_meta)

        # 3. Handle NoSQL metadata caching asynchronously
        mongo_user_document = {
            "user_id": str(new_user.id),
            "clerk_id": payload.clerk_id,
            "display_name": payload.display_name,
            "university_campus": payload.university_campus,
            "academic_department": payload.academic_department,
            "skill_tags": payload.skill_tags or [],
            "reputation_rating": 5.0,
            "completed_tasks_count": 0
        }
        await mongo_db["user_metadata"].insert_one(mongo_user_document)
        
        # 4. Commit PostgreSQL only if MongoDB insert doesn't throw an error
        db.commit()
        return {"status": "success", "user_id": str(new_user.id)}

    except Exception as e:
        db.rollback()  # Crucial! Prevents partial dirty writes if Mongo drops
        raise HTTPException(status_code=500, detail=f"Database synchronization pipeline failed: {str(e)}")

@router.post("/register/poster", status_code=status.HTTP_201_CREATED)
async def register_poster(payload: PosterRegisterRequest, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Account already registered.")

    try:
        new_user = UserModel(
            clerk_id=payload.clerk_id,
            email=payload.email,
            role=PlatformRoleEnum.TASK_POSTER,
            phone_number=payload.phone_number,
            is_verified=True 
        )
        db.add(new_user)
        db.flush()

        poster_meta = PosterProfileModel(
            user_id=new_user.id,
            full_name=payload.display_name,
            nic_hash=hash_identity_string(payload.nic)
        )
        db.add(poster_meta)

        mongo_user_document = {
            "user_id": str(new_user.id),
            "clerk_id": payload.clerk_id,
            "display_name": payload.display_name,
            "reputation_rating": 5.0,
            "total_gigs_posted": 0
        }
        await mongo_db["user_metadata"].insert_one(mongo_user_document)
        
        db.commit()
        return {"status": "success", "user_id": str(new_user.id)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register/corporate", status_code=status.HTTP_201_CREATED)
async def register_corporate(payload: CorporateRegisterRequest, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Account already registered.")

    try:
        new_user = UserModel(
            clerk_id=payload.clerk_id,
            email=payload.email,
            role=PlatformRoleEnum.CORPORATE_CLIENT,
            phone_number=payload.phone_number,
            is_verified=False 
        )
        db.add(new_user)
        db.flush()

        corporate_meta = CorporateProfileModel(
            user_id=new_user.id,
            business_name=payload.business_name,
            registration_number=payload.registration_number
        )
        db.add(corporate_meta)

        mongo_user_document = {
            "user_id": str(new_user.id),
            "clerk_id": payload.clerk_id,
            "business_name": payload.business_name,
            "reputation_rating": 5.0,
            "total_gigs_posted": 0
        }
        await mongo_db["user_metadata"].insert_one(mongo_user_document)
        
        db.commit()
        return {"status": "success", "user_id": str(new_user.id)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/clerk/{clerk_id}")
def get_user_by_clerk_id(clerk_id: str, db: Session = Depends(get_db)):
    """
    Checks if a Clerk user exists in the local database instance.
    Returns status structures instead of throwing 404 errors.
    """
    user = db.query(UserModel).filter(UserModel.clerk_id == clerk_id).first()
    
    if not user:
        return {
            "exists": False,
            "user": None
        }
        
    return {
        "exists": True,
        "user": {
            "id": str(user.id),
            "clerk_id": user.clerk_id,
            "email": user.email,
            "role": user.role.value,
            "is_verified": user.is_verified
        }
    }

@router.get("/user/internal/{user_id}")
def get_user_by_internal_id(user_id: str, db: Session = Depends(get_db)):
    """Fetches full user data via local internal UUID mapping."""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"User with internal ID '{user_id}' not found."
        )
    return {
        "id": str(user.id),
        "clerk_id": user.clerk_id,
        "email": user.email,
        "role": user.role.value,
        "is_verified": user.is_verified
    }