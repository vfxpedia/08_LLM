# FastAPI Main Application
# 예리는 못 말려 백엔드 서버

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.core.logger import logger
from app.api import healthcheck, session


def create_app() -> FastAPI:
    """
    FastAPI 앱 생성 및 설정
    """
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=settings.DEBUG,
        description="AI 기반 인터랙티브 연애 시뮬레이션 게임 '예리는 못 말려' Backend API"
    )

    # CORS 설정
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 정적 파일 서빙 (이미지, 음성 파일)
    static_path = Path(settings.IMAGE_STORAGE_PATH)
    if static_path.exists():
        app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

    # TTS 캐시 디렉터리 생성
    tts_cache_path = Path(settings.TTS_CACHE_DIR)
    tts_cache_path.mkdir(parents=True, exist_ok=True)

    # 로그 디렉터리 생성
    log_path = Path(settings.LOG_FILE_PATH).parent
    log_path.mkdir(parents=True, exist_ok=True)

    # 라우터 등록
    app.include_router(healthcheck.router, prefix="/api", tags=["Health"])
    app.include_router(session.router, prefix="/api/session", tags=["Session"])

    @app.on_event("startup")
    async def startup_event():
        logger.info("=" * 50)
        logger.info(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} Starting...")
        logger.info(f"Environment: {settings.ENVIRONMENT}")
        logger.info(f"Debug Mode: {settings.DEBUG}")
        logger.info(f"EEVE Endpoint: {settings.EEVE_ENDPOINT}")
        logger.info(f"Allowed Origins: {settings.allowed_origins_list}")
        logger.info("=" * 50)

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("=" * 50)
        logger.info(f"🛑 {settings.APP_NAME} Shutting down...")
        logger.info("=" * 50)

    return app


# FastAPI 앱 인스턴스
app = create_app()


@app.get("/")
async def root():
    """
    루트 엔드포인트
    """
    return {
        "message": "예리는 못 말려 Backend API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }