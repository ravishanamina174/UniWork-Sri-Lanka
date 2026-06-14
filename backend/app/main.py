# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth  # Cleaned up deleted gigs reference

app = FastAPI(title="UniWorkSL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect active operational routers
app.include_router(auth.router)

@app.get("/")
def health_check():
    return {"status": "Engine is running"}