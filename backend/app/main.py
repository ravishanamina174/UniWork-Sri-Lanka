from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import gigs

app = FastAPI(title="UniWork Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows client development servers to interact fluidly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routers
app.include_router(gigs.router)

@app.get("/health")
def health():
    return {"status": "healthy"}