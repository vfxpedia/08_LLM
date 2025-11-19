# Logger Configuration
# 로깅 설정

from loguru import logger
import sys
from pathlib import Path
from app.core.config import settings


def setup_logger():
    """
    Loguru 로거 설정
    - 콘솔 출력 및 파일 출력
    - 로그 레벨, 로테이션, 보존 기간 설정
    """

    # 기본 logger 제거
    logger.remove()

    # 콘솔 출력 설정
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=settings.LOG_LEVEL,
        colorize=True
    )

    # 로그 디렉터리 생성
    log_path = Path(settings.LOG_FILE_PATH)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    # 파일 출력 설정
    logger.add(
        settings.LOG_FILE_PATH,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level=settings.LOG_LEVEL,
        rotation=settings.LOG_ROTATION,
        retention=settings.LOG_RETENTION,
        compression="zip",
        encoding="utf-8"
    )

    logger.info(f"Logger initialized - Level: {settings.LOG_LEVEL}")
    return logger


# 로거 초기화
setup_logger()

