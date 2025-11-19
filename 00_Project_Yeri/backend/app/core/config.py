# Configuration
# 환경변수 로딩 및 설정 관리

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Application Settings
    .env 파일에서 환경변수를 로드합니다.
    """

    # Application
    APP_NAME: str = "Yeri Game Backend"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    # Ollama EEVE LLM
    EEVE_ENDPOINT: str = "http://localhost:11434"
    EEVE_MODEL_NAME: str = "eeve"
    EEVE_TIMEOUT: int = 30

    # TTS Settings
    VIBEVOICE_API_KEY: str = ""
    VIBEVOICE_ENDPOINT: str = "https://api.vibevoice.ai/v1"
    NARI_API_KEY: str = ""
    NARI_ENDPOINT: str = "https://api.narilabs.ai/v1"
    DEFAULT_TTS_PROVIDER: str = "vibevoice"

    # STT Settings
    OPENAI_API_KEY: str = ""
    WHISPER_MODEL: str = "whisper-1"
    GOOGLE_CLOUD_API_KEY: str = ""
    DEFAULT_STT_PROVIDER: str = "whisper"

    # VectorDB Settings
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8001
    CHROMA_COLLECTION_NAME: str = "yeri_emotions"
    DEFAULT_VECTOR_PROVIDER: str = "chroma"

    # Image Settings
    COMFYUI_ENDPOINT: str = "http://localhost:8188"
    COMFYUI_API_KEY: str = ""
    IMAGE_STORAGE_PATH: str = "./assets/yeri"
    IMAGE_CDN_URL: str = "http://localhost:8000/static"

    # Cache Settings
    TTS_CACHE_DIR: str = "./tmp/tts"
    TTS_CACHE_TTL: int = 86400  # 24 hours

    # Session Settings
    SESSION_TIMEOUT: int = 600  # 10 minutes
    MAX_SESSIONS_PER_USER: int = 5

    # Scoring Settings (from 02_Score_System_Detail.md)
    EMOTION_SENSE_WEIGHT: float = 0.6
    OBSERVATION_WEIGHT: float = 0.25
    REFLEX_WEIGHT: float = 0.15

    EMOTION_MULTIPLIER_MIN: float = 0.8
    EMOTION_MULTIPLIER_MAX: float = 1.2

    COMBO_1_BONUS: int = 2
    COMBO_2_BONUS: int = 4
    COMBO_3_BONUS: int = 6

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE_PATH: str = "./logs/app.log"
    LOG_ROTATION: str = "500 MB"
    LOG_RETENTION: str = "10 days"

    # Security
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Singleton instance
settings = Settings()

