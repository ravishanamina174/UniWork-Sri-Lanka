from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime, timezone
from app.core.database import mongo_db
from app.models.schemas_pydantic import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/api/v1/feedback", tags=["Feedback"])

@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(payload: FeedbackCreate):
    has_cards = len(payload.issue_cards) > 0
    has_text = bool(payload.feedback_description and payload.feedback_description.strip())

    if not has_cards and not has_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please select at least one suggestion card or write a feedback message."
        )

    # Calculate word count limit check (max 200 words)
    words = payload.feedback_description.strip().split() if has_text else []
    if len(words) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback description exceeds the maximum limit of 200 words."
        )

    feedback_doc = {
        "user_clerk_id": payload.user_clerk_id,
        "user_role": payload.user_role or "guest",
        "issue_cards": payload.issue_cards,
        "feedback_description": payload.feedback_description.strip() if has_text else "",
        "created_at": datetime.now(timezone.utc)
    }

    result = await mongo_db["feedback"].insert_one(feedback_doc)

    return {
        "id": str(result.inserted_id),
        "user_clerk_id": feedback_doc["user_clerk_id"],
        "user_role": feedback_doc["user_role"],
        "issue_cards": feedback_doc["issue_cards"],
        "feedback_description": feedback_doc["feedback_description"],
        "created_at": feedback_doc["created_at"]
    }