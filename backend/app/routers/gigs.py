from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func  # 👈 FIX 1: Explicitly importing func for PostGIS processing
from app.core.database import get_postgres_db, mongo_db
from app.models.domain_postgres import GigModel

router = APIRouter(prefix="/gigs", tags=["Gigs Portal"])

@router.get("/dashboard-feed")
async def get_web_dashboard_feed(pg_db: Session = Depends(get_postgres_db)):
    try:
        # 1. Query all relational rows from Neon PostgreSQL
        raw_gigs = pg_db.query(
            GigModel.id,
            GigModel.poster_id,
            GigModel.title,
            GigModel.budget,
            GigModel.task_type,
            GigModel.status,
            func.ST_AsText(GigModel.location_coordinates).label("location")
        ).all()
        
        aggregated_feed = []
        
        # 2. Extract matching document segments seamlessly from MongoDB Atlas
        for gig in raw_gigs:
            # 👈 FIX 2: Correctly reading from the collection handle using clean await patterns
            mongo_meta = await mongo_db["gig_metadata"].find_one({"_id": gig.id})
            
            aggregated_feed.append({
                "id": gig.id,
                "poster_id": gig.poster_id,
                "title": gig.title,
                "budget": gig.budget,
                "task_type": gig.task_type,
                "status": gig.status,
                "location_coordinates": gig.location,
                "description": mongo_meta.get("description_raw", "No metadata description found") if mongo_meta else "No metadata description found",
                "skills": mongo_meta.get("skill_matrix_tags", []) if mongo_meta else []
            })
            
        return {"status": "success", "data": aggregated_feed}
        
    except Exception as e:
        # This will safely pipe the absolute string traceback if anything else misbehaves
        raise HTTPException(status_code=500, detail=f"Data Gateway Error: {str(e)}")