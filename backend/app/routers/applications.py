# backend/app/routers/applications.py
from fastapi import APIRouter, HTTPException, status
from app.core.database import mongo_db
from app.models.schemas_pydantic import ApplicationCreateRequest
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/v1/applications", tags=["Applications Management"])

@router.post("/apply", status_code=status.HTTP_201_CREATED)
async def apply_for_gig(payload: ApplicationCreateRequest):
    try:
        # 1. Validate Gig ID layout
        if not ObjectId.is_valid(payload.gig_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provided target task identifier layout is invalid."
            )

        # 2. Verify target Gig actually exists
        gig_doc = await mongo_db["gigs"].find_one({"_id": ObjectId(payload.gig_id)})
        if not gig_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The requested gig record was not found."
            )
            
        # 3. Fetch Student Metadata to denormalize into the application
        student_meta = await mongo_db["user_metadata"].find_one({"clerk_id": payload.student_clerk_id})
        if not student_meta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile metadata is missing. Cannot complete application."
            )

        # 4. Check if the student has already applied to this gig (prevent duplicates)
        existing_application = await mongo_db["applications"].find_one({
            "student_clerk_id": payload.student_clerk_id,
            "gig_id": payload.gig_id
        })
        if existing_application:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already submitted an application for this task."
            )

        # 5. Construct the application document with rich denormalized data
        application_document = {
            # Core Application Data
            "student_clerk_id": payload.student_clerk_id,
            "gig_id": payload.gig_id,
            "gig_title": gig_doc.get("title", "Untitled Task"),
            "poster_clerk_id": gig_doc.get("poster_clerk_id"),
            "applied": True, 
            "student_message": payload.student_message,
            "applied_at": datetime.utcnow().isoformat(),
            "task_deadline": gig_doc.get("deadline", ""),
            
            # --- NEW: Student Profile Snapshot ---
            "student_display_name": student_meta.get("display_name", "Unknown Student"),
            "student_university_campus": student_meta.get("university_campus", "Not Specified"),
            "student_reputation_rating": student_meta.get("reputation_rating", 5.0),
            "student_completed_tasks": student_meta.get("completed_tasks_count", 0)
        }

        # 6. Insert into applications collection
        result = await mongo_db["applications"].insert_one(application_document)

        return {
            "status": "success",
            "message": "Application submitted successfully",
            "application_id": str(result.inserted_id)
        }

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit application: {str(e)}"
        )


@router.get("/poster/{poster_clerk_id}")
async def get_applications_for_poster(poster_clerk_id: str):
    """
    Retrieves all applications filed for gigs owned by a specific corporate/poster.
    Includes the newly added student metadata for UI display.
    """
    try:
        cursor = mongo_db["applications"].find({"poster_clerk_id": poster_clerk_id})
        applications = []

        async for doc in cursor:
            applications.append({
                "id": str(doc["_id"]),
                "student_clerk_id": doc["student_clerk_id"],
                "gig_id": doc["gig_id"],
                "gig_title": doc.get("gig_title", "Untitled Task"),
                "poster_clerk_id": doc["poster_clerk_id"],
                "applied": doc.get("applied", True),
                "student_message": doc.get("student_message", ""),
                "applied_at": doc.get("applied_at", ""),
                "task_deadline": doc.get("task_deadline", ""),
                
                # Exposing student metadata to the frontend
                "student_display_name": doc.get("student_display_name", ""),
                "student_university_campus": doc.get("student_university_campus", ""),
                "student_reputation_rating": doc.get("student_reputation_rating", 5.0),
                "student_completed_tasks": doc.get("student_completed_tasks", 0)
            })

        return applications
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve applications for poster: {str(e)}"
        )


@router.get("/student/{student_clerk_id}")
async def get_applications_by_student(student_clerk_id: str):
    """
    Retrieves all applications submitted by a specific student.
    """
    try:
        cursor = mongo_db["applications"].find({"student_clerk_id": student_clerk_id})
        applications = []

        async for doc in cursor:
            applications.append({
                "id": str(doc["_id"]),
                "student_clerk_id": doc["student_clerk_id"],
                "gig_id": doc["gig_id"],
                "gig_title": doc.get("gig_title", ""),
                "poster_clerk_id": doc.get("poster_clerk_id", ""),
                "applied": doc.get("applied", True),
                "student_message": doc.get("student_message", ""),
                "applied_at": doc.get("applied_at", ""),
                "task_deadline": doc.get("task_deadline", ""),
                "student_display_name": doc.get("student_display_name", "")
            })

        return applications
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve student applications: {str(e)}"
        )