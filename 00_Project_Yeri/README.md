# 🎮 예리(Yeri) 티키타카 게임

AI 캐릭터 예리와의 실시간 대화 게임 프로젝트입니다.

## 📋 프로젝트 개요

사용자와 AI 캐릭터 "예리"가 3분간 대화를 나누며, 예리의 감정 상태를 긍정적으로 변화시키는 것을 목표로 하는 대화형 게임입니다.

### 주요 특징
- 🎭 **감정 엔진**: 5단계 감정 시스템 (S0: 냉담 ~ S4: 환희)
- 💯 **점수 시스템**: 감정 점수, 콤보, 타이밍 보너스
- 🎨 **캐릭터 이미지**: Before/After 이미지 페어링
- 🗣️ **음성 지원**: TTS/STT 기능 (선택적)
- 🤖 **LLM 기반**: EEVE 모델을 활용한 자연스러운 대화

## 📁 프로젝트 구조

```
00_Project_Yeri/
├─ backend/           # FastAPI 백엔드 서버
│   ├─ app/
│   │   ├─ api/       # REST API 엔드포인트
│   │   ├─ services/  # 외부 서비스 클라이언트
│   │   ├─ models/    # 데이터 모델
│   │   ├─ core/      # 설정 및 유틸리티
│   │   └─ tests/     # 테스트 코드
│   └─ requirements.txt
│
├─ frontend/          # React/Next.js 프론트엔드
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ assets/
│   │   └─ styles/
│   └─ package.json
│
└─ docs/              # 프로젝트 문서
    ├─ 00_Yeri_Project_Masterbook.md
    ├─ 01_Game_Structure.md
    ├─ 02_Score_System_Detail.md
    ├─ 03_Character_Design.md
    ├─ 04_LLM_Prompt_Design.md
    ├─ 06_Technical_Implementation.md
    └─ 07_Production_Pipeline.md
```

## 🚀 빠른 시작

### Backend 설정

```bash
# 1. Anaconda 환경 생성
conda create -n yeri_backend python=3.10
conda activate yeri_backend

# 2. 의존성 설치
cd backend
pip install -r requirements.txt

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 API 키 입력

# 4. 서버 실행
uvicorn app.main:app --reload
```

### Frontend 설정

```bash
# 1. 의존성 설치
cd frontend
npm install

# 2. 개발 서버 실행
npm run dev
```

## 📚 문서

자세한 내용은 `docs/` 폴더의 문서를 참고하세요:

- **00_Yeri_Project_Masterbook.md** - 전체 프로젝트 개요
- **01_Game_Structure.md** - 게임 구조 및 플로우
- **02_Score_System_Detail.md** - 점수 시스템 상세
- **03_Character_Design.md** - 캐릭터 설정
- **04_LLM_Prompt_Design.md** - LLM 프롬프트 설계
- **06_Technical_Implementation.md** - 기술 구현 상세
- **07_Production_Pipeline.md** - 개발 로드맵

## 🛠️ 기술 스택

### Backend
- FastAPI
- Python 3.10
- Pydantic
- Uvicorn

### Frontend
- React 18
- Next.js 14
- Axios
- TypeScript

### AI/ML
- EEVE LLM (로컬)
- OpenAI Whisper (STT)
- VibeVoice/NariLabs (TTS)

## 🔐 환경 변수

Backend `.env` 파일에 다음 값들을 설정해야 합니다:

```
EEVE_ENDPOINT=http://localhost:11434
TTS_ENDPOINT=https://api.vibevoice.ai
STT_ENDPOINT=https://api.openai.com/v1/audio
VECTORDB_URL=http://localhost:8001
OPENAI_API_KEY=sk-xxxx
NARI_API_KEY=xxxx
```

## 🧪 테스트

```bash
# Backend 테스트
cd backend
pytest app/tests -v

# Frontend 테스트
cd frontend
npm test
```

## 📝 개발 단계

1. ✅ 프로젝트 구조 생성
2. ⏳ Backend 뼈대 구축
3. ⏳ EEVE LLM 연동
4. ⏳ 점수 계산 로직 구현
5. ⏳ TTS/STT 연동
6. ⏳ 감정 엔진 구현
7. ⏳ Frontend UI 개발
8. ⏳ 통합 테스트
9. ⏳ Beta 출시

## 🤝 기여

자세한 개발 가이드는 `docs/07_Production_Pipeline.md`를 참고하세요.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

