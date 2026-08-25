from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from app.core.database import mongo_db
from app.models.schemas_pydantic import (
    ProfessionalWorkerProfileCreateUpdate,
    ProfessionalWorkerProfileResponse,
    StudentLookupRequest,
    StudentLookupResponse
)
from app.agents.student_lookup_agent import run_student_lookup_agent

router = APIRouter(prefix="/api/v1/student-workers", tags=["Professional Student Workers"])

# 1. Create or Update Professional Profile
@router.post("/profile", response_model=ProfessionalWorkerProfileResponse)
async def upsert_professional_profile(payload: ProfessionalWorkerProfileCreateUpdate):
    try:
        collection = mongo_db["professional_student_workers"]
        
        doc = {
            "student_clerk_id": payload.student_clerk_id,
            "display_name": payload.display_name,
            "phone_number": payload.phone_number,
            "bio": payload.bio,
            "skills": payload.skills,
            "primary_location": payload.primary_location,
            "secondary_location": payload.secondary_location,
            "working_hours": payload.working_hours,
            "languages": payload.languages,
            "transportation": payload.transportation,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        await collection.update_one(
            {"student_clerk_id": payload.student_clerk_id},
            {"$set": doc},
            upsert=True
        )
        
        return doc
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save professional student profile: {str(e)}"
        )

# 2. Get Professional Profile by Clerk ID
@router.get("/profile/{student_clerk_id}", response_model=ProfessionalWorkerProfileResponse)
async def get_professional_profile(student_clerk_id: str):
    try:
        doc = await mongo_db["professional_student_workers"].find_one({"student_clerk_id": student_clerk_id})
        if not doc:
            raise HTTPException(
                status_code=404,
                detail="Professional student profile not found."
            )
        return doc
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading professional profile: {str(e)}"
        )

# 3. LangChain / LangGraph Multi-Agent Student Lookup Endpoint
@router.post("/lookup-agent", response_model=StudentLookupResponse)
async def lookup_students_with_agent(payload: StudentLookupRequest):
    try:
        agent_res = await run_student_lookup_agent(
            poster_query=payload.poster_query,
            limit=payload.limit or 5
        )
        
        matched_students = agent_res.get("results", [])
        clerk_ids = [s["student_clerk_id"] for s in matched_students if "student_clerk_id" in s]
        
        return {
            "status": "success",
            "query": payload.poster_query,
            "total_candidates_analyzed": agent_res.get("total_analyzed", 0),
            "filtered_student_clerk_ids": clerk_ids,
            "matched_students": matched_students
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent matching process failed: {str(e)}"
        )