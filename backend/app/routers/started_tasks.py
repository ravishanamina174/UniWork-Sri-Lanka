# backend/app/routers/started_tasks.py

from fastapi import APIRouter, HTTPException, status
from app.core.database import mongo_db
from app.models.schemas_pydantic import (
    InitiateStartRequest,
    VerifyStartCodeRequest,
    VerifyLocationRequest,
    InitiateEndRequest,
    VerifyEndCodeRequest,
    StudentEndTaskRequest
)
from datetime import datetime, timezone
import random
import math
from bson import ObjectId

router = APIRouter(prefix="/api/v1/started-tasks", tags=["Started Tasks Management"])


def generate_4digit_code() -> str:
    """Generates a random 4-digit verification code."""
    return f"{random.randint(1000, 9999)}"


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates the great-circle distance between two points in meters 
    using the Haversine formula.
    """
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


# --- 1. Get or Initialize Task State ---
@router.get("/application/{application_id}")
async def get_started_task(application_id: str):
    """Retrieves or initializes the started_task tracking document for an application."""
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status_code=400, detail="Invalid application ID.")

    doc = await mongo_db["started_tasks"].find_one({"application_id": application_id})

    # Auto-initialize if first time accessing
    if not doc:
        initial_doc = {
            "application_id": application_id,
            "task_start": False,
            "inside_location_approve": False,
            "task_close": False,
            "task_start_time": None,
            "task_close_time": None,
            "start_code": None,
            "end_code": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        res = await mongo_db["started_tasks"].insert_one(initial_doc)
        doc = await mongo_db["started_tasks"].find_one({"_id": res.inserted_id})

    return {
        "id": str(doc["_id"]),
        "application_id": doc["application_id"],
        "task_start": doc.get("task_start", False),
        "inside_location_approve": doc.get("inside_location_approve", False),
        "task_close": doc.get("task_close", False),
        "task_start_time": doc.get("task_start_time"),
        "task_close_time": doc.get("task_close_time"),
        "start_code": doc.get("start_code"),
        "end_code": doc.get("end_code")
    }


# --- 2. Step 1: Student Clicks "Task Starter" -> Generates Poster Code ---
@router.post("/initiate-start")
async def initiate_start(payload: InitiateStartRequest):
    """Generates a 4-digit code shown on the Poster's screen."""
    code = generate_4digit_code()
    
    result = await mongo_db["started_tasks"].update_one(
        {"application_id": payload.application_id},
        {"$set": {"start_code": code}},
        upsert=True
    )
    
    return {"message": "Start code generated successfully", "start_code": code}


# --- 3. Step 2: Student Inputs 4-Digit Code ---
@router.post("/verify-start-code")
async def verify_start_code(payload: VerifyStartCodeRequest):
    """Validates the code entered by the student against the generated poster code."""
    doc = await mongo_db["started_tasks"].find_one({"application_id": payload.application_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Task session record not found.")

    if doc.get("start_code") != payload.code:
        raise HTTPException(status_code=400, detail="Invalid 4-digit code. Please verify with poster.")

    return {"message": "Code verified successfully. Please proceed to location verification.", "valid": True}


# --- 4. Step 3: Student Verifies Location (10m Radius Check) ---
@router.post("/verify-location")
async def verify_location(payload: VerifyLocationRequest):
    """
    Checks if student's current coordinates are within  100 meters 
    of the target gig coordinates stored in MongoDB.
    """
    # Find application & associated gig
    if not ObjectId.is_valid(payload.application_id):
        raise HTTPException(status_code=400, detail="Invalid application ID.")

    app_doc = await mongo_db["applications"].find_one({"_id": ObjectId(payload.application_id)})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application record not found.")

    gig_id = app_doc.get("gig_id")
    if not ObjectId.is_valid(gig_id):
        raise HTTPException(status_code=400, detail="Associated gig ID is invalid.")

    gig_doc = await mongo_db["gigs"].find_one({"_id": ObjectId(gig_id)})
    if not gig_doc or "location" not in gig_doc or "coordinates" not in gig_doc["location"]:
        raise HTTPException(status_code=400, detail="Target gig location coordinates missing from database.")

    # GeoJSON layout: coordinates = [longitude, latitude]
    gig_coords = gig_doc["location"]["coordinates"]
    gig_lon, gig_lat = gig_coords[0], gig_coords[1]

    # Calculate distance in meters
    distance = calculate_haversine_distance(
        lat1=payload.latitude,
        lon1=payload.longitude,
        lat2=gig_lat,
        lon2=gig_lon
    )

    # 100 Meters Threshold Check
    RADIUS_THRESHOLD = 100.0

    if distance > RADIUS_THRESHOLD:
        raise HTTPException(
            status_code=400,
            detail=f"Location verification failed. You are currently {round(distance, 1)}m away. You must be within 100 meters of the pinned task location."
        )

    # Update task start status
    start_time = datetime.now(timezone.utc).isoformat()
    await mongo_db["started_tasks"].update_one(
        {"application_id": payload.application_id},
        {
            "$set": {
                "inside_location_approve": True,
                "task_start": True,
                "task_start_time": start_time
            }
        }
    )

    return {
        "message": "Location verified and task officially started!",
        "distance_meters": round(distance, 2),
        "task_start": True,
        "task_start_time": start_time
    }


# --- 5. Step 4A: Poster Initiates Task Closure -> Generates Code for Student UI ---
@router.post("/initiate-end")
async def initiate_end(payload: InitiateEndRequest):
    """Generates a 4-digit code shown on the Student's screen when poster wants to end task."""
    code = generate_4digit_code()

    await mongo_db["started_tasks"].update_one(
        {"application_id": payload.application_id},
        {"$set": {"end_code": code}}
    )

    return {"message": "End code generated successfully", "end_code": code}


# --- 6. Step 4B: Poster Verifies End Code ---
@router.post("/verify-end-code")
async def verify_end_code(payload: VerifyEndCodeRequest):
    """Validates poster's entered code to complete task closure."""
    doc = await mongo_db["started_tasks"].find_one({"application_id": payload.application_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Task session record not found.")

    if doc.get("end_code") != payload.code:
        raise HTTPException(status_code=400, detail="Invalid 4-digit code. Please check student screen.")

    close_time = datetime.now(timezone.utc).isoformat()
    await mongo_db["started_tasks"].update_one(
        {"application_id": payload.application_id},
        {
            "$set": {
                "task_close": True,
                "task_close_time": close_time
            }
        }
    )

    return {"message": "Task ended successfully by poster.", "task_close": True, "task_close_time": close_time}


# --- 7. Step 4C: Student Ends Task Directly ---
@router.post("/student-end")
async def student_end_task(payload: StudentEndTaskRequest):
    """Allows student to directly end the task without entering a code."""
    close_time = datetime.now(timezone.utc).isoformat()

    await mongo_db["started_tasks"].update_one(
        {"application_id": payload.application_id},
        {
            "$set": {
                "task_close": True,
                "task_close_time": close_time
            }
        }
    )

    return {"message": "Task ended successfully by student.", "task_close": True, "task_close_time": close_time}