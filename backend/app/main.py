from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.websocket import ws_router

# 1. Import Postgres engine and Base
from app.core.database import engine, Base

# 2. Import database models
from app.models.domain_postgres import UserModel, StudentProfileModel, PosterProfileModel, CorporateProfileModel

# 3. Lifespan event to run table creation
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔄 Checking and syncing PostgreSQL database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables verified and synced successfully!")
    except Exception as e:
        print(f"❌ Failed to auto-sync database tables: {e}")
    yield

# 4. Pass lifespan context into FastAPI app
app = FastAPI(title="UniWorkSL API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect active operational routers
from app.routers import auth, gigs, profiles, applications, messages, started_tasks, feedback, student_workers

app.include_router(auth.router)
app.include_router(gigs.router)
app.include_router(profiles.router)
app.include_router(applications.router)
app.include_router(messages.router)
app.include_router(started_tasks.router)
app.include_router(feedback.router) 
app.include_router(student_workers.router)

# Add the WebSocket router
app.include_router(ws_router)

@app.get("/")
def health_check():
    return {"status": "Engine is running"}