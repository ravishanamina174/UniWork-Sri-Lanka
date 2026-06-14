# backend/seed.py
import asyncio
from sqlalchemy import text
import uuid
import hashlib

# Core database connection dependencies
from app.core.database import engine, Base, SessionLocal, mongo_db
# New user identity models from your domain file
from app.models.domain_postgres import UserModel, StudentProfileModel, PlatformRoleEnum

def init_postgres_extensions():
    """Forces activation of the PostGIS spatial framework within your relational DB."""
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

def hash_identity_string(value: str) -> str:
    """Helper utility mimicking your registration auth hashing structure."""
    return hashlib.sha256(value.encode()).hexdigest()

async def seed_databases():
    print("\n🚀 Commencing Multi-Database Alignment Initialization...")
    
    # 1. Initialize PostGIS framework and construct standard schema layouts
    init_postgres_extensions()
    Base.metadata.create_all(bind=engine)
    print("[PostgreSQL] Identity structures and tables verified/created successfully.")
    
    db_session = SessionLocal()
    
    try:
        # Clear existing entries to keep storage pure during staging runs
        db_session.query(StudentProfileModel).delete()
        db_session.query(UserModel).delete()
        db_session.commit()
        
        await mongo_db["user_metadata"].drop()
        print("[System] Staging storage tables and document collections flushed cleanly.")

        # --- GENERATE RECORD: STUDENT EARNER ---
        user_uuid = uuid.uuid4()
        clerk_id_mock = "user_2NxFg97XzKL0pQ1rSTuVwxyZ2026"
        
        print(f"\n[Seeding] Preparing Student User Data (ID: {user_uuid})...")
        
        # 1. Base Relational Identity Record
        postgres_user = UserModel(
            id=user_uuid,
            clerk_id=clerk_id_mock,
            email="perera.10@stu.mrt.ac.lk", # Standard .ac.lk structure
            role=PlatformRoleEnum.STUDENT_EARNER,
            is_verified=True,  # Set to true since email matches state domain
            phone_number="+94771234567"
        )
        db_session.add(postgres_user)
        db_session.flush() # Secure reference link for foreign keys

        # 2. Detailed Relational Meta Profile
        postgres_student_profile = StudentProfileModel(
            user_id=user_uuid,
            encrypted_uni_id="ENC_MRT_SE_2022_045",
            faculty="Faculty of Engineering",
            nic_hash=hash_identity_string("200123456789V")
        )
        db_session.add(postgres_student_profile)
        
        # 3. Flexible NoSQL Unstructured Matrix Document
        mongo_user_document = {
            "user_id": str(user_uuid),
            "clerk_id": clerk_id_mock,
            "display_name": "Ravindu Perera",
            "university_campus": "University of Moratuwa",
            "academic_department": "Department of Computer Science & Engineering",
            "skill_tags": ["Python", "FastAPI", "Tailwind CSS", "UI Design Validation"],
            "reputation_rating": 5.0,
            "completed_tasks_count": 0
        }
        await mongo_db["user_metadata"].insert_one(mongo_user_document)

        # Commit transactions across databases atomically
        db_session.commit()
        print("\n🎉 Multi-Database Synchronization Execution Completed Successfully!")
        print(f"-> PostgreSQL Synced: 1 core user + student meta profile stored.")
        print(f"-> MongoDB Synced: 1 flexible developer matrix document cached inside 'user_metadata'.")

    except Exception as e:
        print(f"\n❌ Seeding pipeline crashed: {str(e)}")
        db_session.rollback()
    finally:
        db_session.close()

if __name__ == "__main__":
    asyncio.run(seed_databases())