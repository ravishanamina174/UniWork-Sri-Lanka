# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# 1. Import your Postgres engine and Base from database.py
from app.core.database import engine, Base

# 2. CRITICAL: Import all your database models so SQLAlchemy knows they exist
from app.models.domain_postgres import UserModel, StudentProfileModel, PosterProfileModel, CorporateProfileModel

# 3. Create a lifespan event to run table creation automatically at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔄 Checking and syncing PostgreSQL database tables...")
    try:
        # This scans the imported models and creates any tables missing in the database
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables verified and synced successfully!")
    except Exception as e:
        print(f"❌ Failed to auto-sync database tables: {e}")
    yield

# 4. Pass the lifespan context into your FastAPI app instance
app = FastAPI(title="UniWorkSL API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect active operational routers
from app.routers import auth , gigs , profiles , applications
app.include_router(auth.router)
app.include_router(gigs.router)
app.include_router(profiles.router)
app.include_router(applications.router)

@app.get("/")
def health_check():
    return {"status": "Engine is running"}