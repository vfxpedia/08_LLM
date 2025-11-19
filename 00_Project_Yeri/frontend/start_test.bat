@echo off
echo ========================================
echo   프론트엔드 컴포넌트 테스트 서버 시작
echo ========================================
echo.
echo 1. 의존성 설치 중...
call npm install
echo.
echo 2. 개발 서버 시작 중...
echo.
echo 테스트 페이지: http://localhost:3000/test
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo.
call npm run dev
pause
