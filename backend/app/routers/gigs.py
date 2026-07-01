# backend/app/routers/gigs.py
from fastapi import APIRouter, HTTPException, status
from app.core.database import mongo_db
from app.models.schemas_pydantic import GigCreateRequest
from datetime import datetime
import pymongo

router = APIRouter(prefix="/api/v1/gigs", tags=["Gigs Management"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_gig(payload: GigCreateRequest):
    try:
        # Construct plain-text document structure for MongoDB
        gig_document = {
            "title": payload.title,
            "description": payload.description,
            "budget": payload.budget,
            "deadline": payload.deadline,
            "skills_required": payload.skills_required,
            "poster_clerk_id": payload.poster_clerk_id,
            "task_type": payload.task_type,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Append location data only if it is an on-site task
        if payload.task_type == "on-site" and payload.location:
            gig_document["location"] = payload.location.dict()
        
        # Insert inside your mongo collection
        result = await mongo_db["gigs"].insert_one(gig_document)
        
        # Ensure a 2dsphere index exists for spatial querying
        await mongo_db["gigs"].create_index([("location", pymongo.GEOSPHERE)])
        
        return {
            "status": "success", 
            "message": "Task created successfully", 
            "gig_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to post gig to database node: {str(e)}"
        )

@router.get("/all")
async def get_all_gigs():
    try:
        gigs_cursor = mongo_db["gigs"].find()
        all_gigs = []
        
        async for doc in gigs_cursor:
            all_gigs.append({
                "id": str(doc["_id"]),
                "title": doc["title"],
                "description": doc["description"],
                "budget": float(doc["budget"]),
                "deadline": doc["deadline"],
                "skills_required": doc.get("skills_required", []),
                "poster_clerk_id": doc["poster_clerk_id"],
                "created_at": doc.get("created_at", ""),
                "task_type": doc.get("task_type", "remote"),
                "location": doc.get("location", None)
            })
            
        return all_gigs
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to retrieve gigs from data store: {str(e)}"
        )