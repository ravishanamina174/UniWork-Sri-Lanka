import asyncio
from sqlalchemy import text
import uuid

# Structural imports from your clean app layout
from app.core.database import engine, Base, SessionLocal, mongo_db
from app.models.domain_postgres import GigModel, TaskType, GigState
from app.models.document_mongo import create_gig_metadata_document

def init_postgres_extensions():
    """Forces activation of the PostGIS spatial extension framework within your relational DB instance."""
    print("[PostgreSQL] Verifying PostGIS Extensions...")
    db = SessionLocal()
    try:
        db.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        db.commit()
        print("[PostgreSQL] PostGIS Extension enabled successfully.")
    except Exception as e:
        print(f"[PostgreSQL] Failed mapping extension: {str(e)}")
        db.rollback()
    finally:
        db.close()

async def seed_databases():
    print("\n🚀 Commencing Multi-Database Alignment Initialization...")
    
    # 1. Initialize PostGIS & Build tables
    init_postgres_extensions()
    Base.metadata.create_all(bind=engine)
    print("[PostgreSQL] Tables verified/created successfully.")
    
    db_session = SessionLocal()
    
    try:
        # Clear existing entries to keep structural data pure during staging
        db_session.query(GigModel).delete()
        db_session.commit()
        await mongo_db["gig_metadata"].drop()
        print("[System] Staging storage environments flushed.")

        # --- GENERATE DUMMY RECORD 1: DIGITAL TASK ---
        digital_id = str(uuid.uuid4())
        print(f"\n[Seeding] Preparing Digital Task Data (ID: {digital_id})...")
        
        postgres_digital_gig = GigModel(
            id=digital_id,
            poster_id="clerk_user_poster_101",
            title="Social Media Reels Editing - Local Fashion Brand",
            budget=5000.0,  # 5000 LKR
            task_type=TaskType.DIGITAL,
            status=GigState.ESCROW_LOCKED,
            location_coordinates=None  # Remote task requires no location mapping
        )
        db_session.add(postgres_digital_gig)
        
        mongo_digital_metadata = create_gig_metadata_document(
            gig_id=digital_id,
            description_raw="Need an editor to crop 5 TikTok/Reels style short videos. Raw footage will be provided via Drive. Needs quick cuts and local trendy audio tracking.",
            skill_matrix_tags=["Video Editing", "CapCut", "TikTok Analytics", "Creative Content"]
        )
        await mongo_db["gig_metadata"].insert_one(mongo_digital_metadata)
        
        # --- GENERATE DUMMY RECORD 2: PHYSICAL TASK ---
        physical_id = str(uuid.uuid4())
        print(f"[Seeding] Preparing Physical Task Data (ID: {physical_id})...")
        
        # Location localized right near University of Moratuwa (UoM) gates
        uom_location_point = f"POINT(79.9012 6.7951)"
        
        postgres_physical_gig = GigModel(
            id=physical_id,
            poster_id="clerk_user_poster_202",
            title="Boarding House Shifting - Katubedda to Campus Gate",
            budget=3500.0,  # 3500 LKR
            task_type=TaskType.PHYSICAL,
            status=GigState.PENDING_DEPOSIT,
            location_coordinates=uom_location_point
        )
        db_session.add(postgres_physical_gig)
        
        mongo_physical_metadata = create_gig_metadata_document(
            gig_id=physical_id,
            description_raw="Moving small table, wardrobe, and 3 bags from my boarding room in Katubedda to the room near UoM main gate. Requires 2 students because of furniture weight.",
            skill_matrix_tags=["Manual Labor", "Furniture Logistics", "Hyper-Local Delivery"]
        )
        await mongo_db["gig_metadata"].insert_one(mongo_physical_metadata)

        # Finalize atomic transactions
        db_session.commit()
        print("\n🎉 Multi-Database Synchronization Execution Completed Successfully!")
        print(f"-> PostgreSQL Synced: 2 records initialized inside table 'gigs'.")
        print(f"-> MongoDB Synced: 2 records documents mapped into collection 'gig_metadata'.")

    except Exception as e:
        print(f"\n❌ Seeding pipeline crashed: {str(e)}")
        db_session.rollback()
    finally:
        db_session.close()

if __name__ == "__main__":
    asyncio.run(seed_databases())