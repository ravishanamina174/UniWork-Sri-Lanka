from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# 1. PostgreSQL Engine Setup (With Connection Pooling)
engine = create_engine(
    settings.POSTGRES_URL,
    pool_size=10,
    max_overflow=5,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. MongoDB Async Engine Setup
mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
mongo_db = mongo_client["uniwork_core_db"]

# 3. Dependency Injector for Routing Contexts
def get_postgres_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()