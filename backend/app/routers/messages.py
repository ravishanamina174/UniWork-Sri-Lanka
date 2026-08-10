from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.core.database import mongo_db
from app.models.schemas_pydantic import MessageCreate, MessageResponse

router = APIRouter(prefix="/api/v1/messages", tags=["Messages"])

@router.post("/", response_model=MessageResponse)
async def send_message(payload: MessageCreate):
    # 1. Validate application_id format
    if not ObjectId.is_valid(payload.application_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid target application ID layout."
        )

    # 2. Verify application exists and is actually approved
    app_record = await mongo_db["applications"].find_one({
        "_id": ObjectId(payload.application_id), 
        "application_confirm": "approve"
    })
    
    if not app_record:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Task is not approved or application does not exist."
        )

    # 3. Construct and save message
    message_doc = {
        "application_id": payload.application_id,
        "sender_id": payload.sender_id,
        "text": payload.text,
        "timestamp": datetime.now(timezone.utc)
    }
    
    result = await mongo_db["messages"].insert_one(message_doc)
    
    return {
        "id": str(result.inserted_id),
        "application_id": message_doc["application_id"],
        "sender_id": message_doc["sender_id"],
        "text": message_doc["text"],
        "timestamp": message_doc["timestamp"]
    }

@router.get("/{application_id}", response_model=List[MessageResponse])
async def get_messages(application_id: str):
    if not ObjectId.is_valid(application_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID layout."
        )

    # Fetch all messages for this specific application, sorted oldest to newest
    cursor = mongo_db["messages"].find({"application_id": application_id}).sort("timestamp", 1)
    messages = await cursor.to_list(length=1000)
    
    return [
        {
            "id": str(msg["_id"]),
            "application_id": msg["application_id"],
            "sender_id": msg["sender_id"],
            "text": msg["text"],
            "timestamp": msg["timestamp"]
        }
        for msg in messages
    ]