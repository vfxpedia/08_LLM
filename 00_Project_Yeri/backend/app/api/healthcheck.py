# Health Check Endpoint

from fastapi import APIRouter
from datetime import datetime
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    서버 상태 확인
    """
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/config")
async def get_config():
    """
    현재 설정 확인 (디버그용)
    민감한 정보는 제외
    """
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "eeve_endpoint": settings.EEVE_ENDPOINT,
        "default_tts_provider": settings.DEFAULT_TTS_PROVIDER,
        "default_stt_provider": settings.DEFAULT_STT_PROVIDER,
        "scoring_weights": {
            "emotion_sense": settings.EMOTION_SENSE_WEIGHT,
            "observation": settings.OBSERVATION_WEIGHT,
            "reflex": settings.REFLEX_WEIGHT
        }
    }

