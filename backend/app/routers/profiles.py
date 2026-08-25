# app/routers/profiles.py
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from app.core.database import mongo_db
from app.models.schemas_pydantic import (
    ProfileUpdateRequest, 
    ProfileResponse, 
    EmergencyLogRequest,
    TaskCompletionRequest 
)
import logging

router = APIRouter(prefix="/api/v1/profiles", tags=["Profiles Management"])

@router.get("/{clerk_id}", response_model=ProfileResponse)
async def get_user_profile(clerk_id: str):
    # Locate user registration context first
    profile = await mongo_db["user_profiles"].find_one({"clerk_id": clerk_id})
    
    if not profile:
        # Fallback query to baseline auth users registration data if profile collection is empty
        auth_user = await mongo_db["users"].find_one({"clerk_id": clerk_id})
        if not auth_user:
            raise HTTPException(status_code=404, detail="User mapping context not discovered.")
        
        # Hydrate a default profile layout
        role = auth_user.get("role", "STUDENT_EARNER")
        profile = {
            "clerk_id": clerk_id,
            "role": role,
            "display_name": auth_user.get("display_name", "New User"),
            "email": auth_user.get("email", ""),
            "phone_number": auth_user.get("phone_number", ""),
            "address": "",
            "bio": "",
            "skill_tags": auth_user.get("skill_tags", []) if role == "STUDENT_EARNER" else [],
            "business_name": auth_user.get("business_name", "") if role == "CORPORATE_CLIENT" else "",
            "is_safety_enabled": False,
            "emergency_whatsapp_number": "",
            "completed_tasks": 0, # NEW FIELD
            "total_earnings": 0.0 # NEW FIELD
        }
        await mongo_db["user_profiles"].insert_one(profile)

    # Calculate contextual UI metrics dynamically on query
    role = profile.get("role", "STUDENT_EARNER")
    metrics = {"primary_stat": 0, "secondary_stat": 0}
    metadata = {}

    if role == "STUDENT_EARNER":
        metrics["primary_label"] = "Completed Tasks"
        metrics["secondary_label"] = "Total Earnings (LKR)"
        # Map the actual DB fields here (default to 0 if they don't exist yet)
        metrics["primary_stat"] = profile.get("completed_tasks", 0) 
        metrics["secondary_stat"] = profile.get("total_earnings", 0.0)
        
        metadata["extra_label"] = "Skills Portfolio"
        metadata["extra_value"] = ", ".join(profile.get("skill_tags", [])) or "None specified"
    elif role == "TASK_POSTER":
        metrics["primary_label"] = "Posted Tasks"
        metrics["secondary_label"] = "Active Gigs"
        metadata["extra_label"] = "Poster Class"
        metadata["extra_value"] = "Verified Individual"
    elif role == "CORPORATE_CLIENT":
        metrics["primary_label"] = "Managed Projects"
        metrics["secondary_label"] = "Corporate Tier"
        metadata["extra_label"] = "Company Entity"
        metadata["extra_value"] = profile.get("business_name", "Enterprise Member")

    return {
        "clerk_id": profile["clerk_id"],
        "role": role,
        "display_name": profile["display_name"],
        "email": profile["email"],
        "phone_number": profile["phone_number"],
        "address": profile.get("address", ""),
        "bio": profile.get("bio", ""),
        "metadata": metadata,
        "metrics": metrics,
        "is_safety_enabled": profile.get("is_safety_enabled", False),
        "emergency_whatsapp_number": profile.get("emergency_whatsapp_number", "")
    }

@router.put("/{clerk_id}", status_code=status.HTTP_200_OK)
async def update_user_profile(clerk_id: str, payload: ProfileUpdateRequest):
    try:
        update_data = {
            "display_name": payload.display_name,
            "email": payload.email,
            "phone_number": payload.phone_number,
            "address": payload.address,
            "bio": payload.bio,
            "is_safety_enabled": payload.is_safety_enabled,
            "emergency_whatsapp_number": payload.emergency_whatsapp_number
        }
        
        # Include fields safely dynamically
        if payload.skill_tags:
            update_data["skill_tags"] = payload.skill_tags
        if payload.business_name:
            update_data["business_name"] = payload.business_name

        result = await mongo_db["user_profiles"].update_one(
            {"clerk_id": clerk_id},
            {"$set": update_data},
            upsert=True
        )
        
        return {"status": "success", "message": "Profile synced correctly"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database modification fault: {str(e)}")



@router.post("/{clerk_id}/complete-task", status_code=status.HTTP_200_OK)
async def record_task_completion(clerk_id: str, payload: TaskCompletionRequest):
    """
    Safely increments completed_tasks and total_earnings even if 
    the fields were previously stored as strings in MongoDB.
    """
    try:
        profile = await mongo_db["user_profiles"].find_one({"clerk_id": clerk_id})
        if not profile:
            raise HTTPException(
                status_code=404, 
                detail="User profile not found."
            )

        # Safely extract and convert existing values
        try:
            current_tasks = int(profile.get("completed_tasks", 0))
        except (ValueError, TypeError):
            current_tasks = 0

        try:
            current_earnings = float(profile.get("total_earnings", 0.0))
        except (ValueError, TypeError):
            current_earnings = 0.0

        # Calculate updated metrics
        updated_tasks = current_tasks + 1
        updated_earnings = current_earnings + payload.earned_amount

        # Write numeric values back to Mongo
        await mongo_db["user_profiles"].update_one(
            {"clerk_id": clerk_id},
            {
                "$set": {
                    "completed_tasks": updated_tasks,
                    "total_earnings": updated_earnings
                }
            }
        )

        return {
            "status": "success",
            "message": f"Successfully recorded completion. Earnings increased by LKR {payload.earned_amount}."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to update task metrics: {str(e)}"
        )



# NEW ENDPOINT: Records location & student check-in when starting a task
@router.post("/emergency-log", status_code=status.HTTP_201_CREATED)
async def record_emergency_location(payload: EmergencyLogRequest):
    try:
        log_document = {
            "clerk_id": payload.clerk_id,
            "user_type": "STUDENT_EARNER",
            "timestamp": datetime.utcnow().isoformat(),
            "location": {
                "latitude": payload.latitude,
                "longitude": payload.longitude
            },
            "application_id": payload.application_id
        }
        
        await mongo_db["students_emergency"].insert_one(log_document)
        return {"status": "success", "message": "Emergency location check-in logged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emergency log storage error: {str(e)}")