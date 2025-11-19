@echo off
REM 예리는 못 말려 - Backend 서버 실행 스크립트

echo ========================================
echo  예리는 못 말려 Backend Server
echo ========================================
echo.

REM Conda 환경 활성화
echo [1/4] Activating conda environment: yeri_backend
call conda activate yeri_backend
if errorlevel 1 (
    echo ERROR: Failed to activate conda environment
    echo Please make sure 'yeri_backend' conda environment exists
    pause
    exit /b 1
)
echo OK: Conda environment activated
echo.

REM 의존성 설치 확인
echo [2/4] Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies from requirements.txt...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo OK: Dependencies already installed
)
echo.

REM 환경변수 파일 확인
echo [3/4] Checking .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)
echo OK: .env file exists
echo.

REM 서버 실행
echo [4/4] Starting FastAPI server...
echo.
echo Server will be available at:
echo   - API Docs: http://localhost:8000/docs
echo   - Health Check: http://localhost:8000/api/health
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
