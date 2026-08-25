# backend/app/routers/gigs.py
from fastapi import APIRouter, HTTPException, status
from app.core.database import mongo_db
from app.models.schemas_pydantic import GigCreateRequest,AIEnhanceRequest, AIEnhanceResponse
from datetime import datetime
import pymongo
from bson import ObjectId  
import httpx
from app.core.config import settings # 1. Import your settings
from google import genai


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
    
@router.get("/{gig_id}")
async def get_single_gig(gig_id: str):
    try:
        # Validate that the string payload is a legitimate 24-character hex ObjectId
        if not ObjectId.is_valid(gig_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provided target task identifier form layout mapping is invalid."
            )
            
        # Search the document tree node directly
        doc = await mongo_db["gigs"].find_one({"_id": ObjectId(gig_id)})
        
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The requested gig entity record was not discovered inside active pools."
            )
            
        # Map fields back to match your structural layout frontend schema parameters cleanly
        return {
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
        }
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Internal database read exception triggered: {str(e)}"
        )


@router.post("/enhance-text", response_model=AIEnhanceResponse)
async def enhance_text_with_ai(payload: AIEnhanceRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        if payload.field_type == "title":
            prompt = "Refine the following task title for a Sri Lankan freelancing platform. Fix grammar and phrasing. Output ONLY the refined title without quotes:\n"
        else:
            prompt = "Refine the following task description for a Sri Lankan freelancing platform. Fix grammar, spelling, and phrasing. Keep the exact original intent and keep it strictly under 100 words. Output ONLY the refined text without greetings or formatting:\n"

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt + payload.text,
        )

        return {"enhanced_text": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")