from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniWork Sri Lanka Engine"
    DEBUG_MODE: bool = True
    
    # Database Connection Strings
    # Defaulting to standard local credentials - update these to match your local staging setups
    POSTGRES_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/uniwork_db",
        validation_alias="POSTGRES_URL"
    )
    MONGO_URL: str = Field(
        default="mongodb://localhost:27017",
        validation_alias="MONGO_URL"
    )
    
    CLERK_JWKS_URL: str = "https://clerk.uniwork.lk/.well-known/jwks.json"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()