from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniWork Sri Lanka Engine"
    DEBUG_MODE: bool = True
    
    # Database Connection Strings
    POSTGRES_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/uniwork_db",
        validation_alias="POSTGRES_URL"
    )
    MONGO_URL: str = Field(
        default="mongodb://localhost:27017",
        validation_alias="MONGO_URL"
    )

    # Gemini API Key Field
    GEMINI_API_KEY: Optional[str] = None

    CLERK_JWKS_URL: str = "https://clerk.uniwork.lk/.well-known/jwks.json"

    # Pydantic V2 Configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignores extra .env keys and suppresses validation errors
    )

settings = Settings()