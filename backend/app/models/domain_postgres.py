import enum
from sqlalchemy import Column, String, Float, Enum, DateTime
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.core.database import Base

class TaskType(str, enum.Enum):
    DIGITAL = "DIGITAL"
    PHYSICAL = "PHYSICAL"

class GigState(str, enum.Enum):
    PENDING_DEPOSIT = "PENDING_DEPOSIT"
    ESCROW_LOCKED = "ESCROW_LOCKED"
    ACTIVE = "ACTIVE"
    DISBURSED = "DISBURSED"
    FAILED_AUDIT = "FAILED_AUDIT"

class GigModel(Base):
    __tablename__ = "gigs"

    id = Column(String, primary_key=True, index=True, unique=True)
    poster_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    task_type = Column(Enum(TaskType), nullable=False)
    status = Column(Enum(GigState), default=GigState.PENDING_DEPOSIT, nullable=False)
    
    # PostGIS Spatially-Indexed Geometric Point Tracking Target (SRID 4326 for GPS coordinate systems)
    # This stores where the physical gig takes place
    location_coordinates = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())