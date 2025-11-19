# 완전한 프로젝트 재시작 가이드

**프로젝트**: 예리는 못 말려
**최종 업데이트**: 2025-11-07
**버전**: v2.0 (완전판)

> 🎯 **목적**: 이 문서만으로 프로젝트 전체 맥락을 파악하고, 어느 시점에서든 개발을 재개할 수 있도록 모든 정보를 포함합니다.

---

## 📋 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [완료된 모든 작업](#2-완료된-모든-작업)
3. [현재 프로젝트 구조](#3-현재-프로젝트-구조)
4. [설계 변경 사항](#4-설계-변경-사항)
5. [다음 작업](#5-다음-작업)
6. [재시작 방법](#6-재시작-방법)

---

## 1. 프로젝트 개요

### 1.1 핵심 컨셉
**"오빠, 나 뭐 달라진 거 없어?"**

AI 기반 인터랙티브 연애 시뮬레이션 게임으로, Before/After 이미지 비교를 통해 변화를 찾고, 플레이어의 답변을 EEVE LLM이 감정 분석하여 점수를 부여하는 하이브리드 감정형 게임.

### 1.2 기술 스택

**백엔드**:
- FastAPI + Pydantic + Loguru
- Ollama EEVE (감정 분석 LLM)
- Chroma VectorDB (감정 데이터)
- TTS/STT (음성 입출력)

**프론트엔드**:
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS

### 1.3 게임 플로우 (최종 확정)

```
0. 시작 화면
   - 플레이어 이름 입력
   - 연령대 선택 (10대/20대/30대/40대+)
   ↓
1. Before 인지 단계 (신규 추가!)
   - 예리 등장 (Before 이미지)
   - "{이름} 오빠~ 얼른 준비하고 올게~~~"
   - 5~10초간 Before 이미지 노출
   ↓
2. 게임 시작
   - After 이미지로 전환
   - "근데 {이름} 오빠, 나 뭐 바뀐 거 없어?"
   - 1턴 시작 (3초)
   ↓
3. 3턴 게임 진행
   - 1턴: 3초
   - 2턴: 10초
   - 3턴: 30초
   ↓
4. 결과 화면
   - 점수 표시
   - 엔딩 분기 (love/cute_upset/breakup)
   - SNS 공유 카드
```

---

## 2. 완료된 모든 작업

### ✅ 백엔드 구현 (Phase 1 - 완료)

#### 2.1 환경 설정
```
backend/
├── requirements.txt       ✅ FastAPI, Pydantic, Loguru 등
├── .env.example          ✅ 환경변수 템플릿
└── start_server.bat      ✅ 서버 실행 스크립트
```

#### 2.2 핵심 모듈
```python
# app/core/config.py
- Settings 클래스 (환경변수 로딩)
- EEVE, TTS/STT, VectorDB 설정

# app/core/logger.py
- Loguru 기반 로깅 시스템
- 콘솔 + 파일 로그 (500MB 로테이션)
```

#### 2.3 데이터 모델 (Pydantic)
```python
# app/models/emotion.py
- EmotionScore (EEVE 감정 평가 결과)
- EmotionStage (S0~S4 감정 단계)
- YeriDialogue (예리 대사 데이터)

# app/models/score.py
- ScoreSnapshot (턴별 점수)
- ComboState (콤보 시스템)
- FinalScore (최종 점수 + 엔딩)

# app/models/session.py
- TurnState (턴 상태)
- ImagePair (Before/After 이미지)
- SessionState (게임 세션)
- API 요청/응답 모델
```

#### 2.4 API 구현
```python
# app/main.py
- FastAPI 앱 초기화
- CORS 설정
- 정적 파일 서빙

# app/api/healthcheck.py
- GET /api/health
- GET /api/config

# app/api/session.py (MVP - Mock 데이터)
- POST /api/session/start
- POST /api/session/answer
- POST /api/session/finish
- GET /api/session/{session_id}
```

#### 2.5 백엔드 테스트 결과
```bash
✅ 서버 정상 실행: http://localhost:8000
✅ Swagger UI: http://localhost:8000/docs
✅ 세션 시작/답변/종료 플로우 테스트 성공
✅ 로그 파일 정상 기록: backend/logs/app.log
```

---

### ✅ 프론트엔드 설계 (Phase 1-3 - 완료)

#### 2.6 게임 설계 변경 사항

**Before 인지 단계 추가** (중요!)
- **이전**: 바로 After 이미지로 시작
- **변경 후**: Before 이미지를 먼저 보여주고 → After 전환
- **이유**: 플레이어가 변화를 제대로 인지하기 위해

**UI 디자인 확정**
- **베이스**: `sample/ui_reference_02.png` (핑크/파스텔 테마)
- **레퍼런스**: `sample/ui_reference_layout.png`

**최종 UI 구조** (하이브리드 방식):

**1턴 (3초)**: After 이미지만 표시 ⚡
```
┌─────────────────────────────────────────┐
│     오빠😍 나 뭐 달라진 거 없어?         │
├─────────────────────────────────────────┤
│  🧍‍♀️ [After 이미지만] (전체 화면)      │  ← After만!
│  💬 "3초 안에 맞춰봐~"                  │
│  [🎤 녹음]   [💡 Hint]   [📝 입력]      │
└─────────────────────────────────────────┘
```

**2~3턴 (10초/30초/60초)**: Before/After 분할 🔄
```
┌─────────────────────────────────────────┐
│     오빠😍 나 뭐 달라진 거 없어?         │
├─────────────────────────────────────────┤
│  30 [████████████░░░░░░] 😊 30          │  ← Progress Bar
├──────────────────┬──────────────────────┤
│     BEFORE       │       AFTER          │  ← ui_reference_layout.png
│      🧍‍♀️         │        🧍‍♀️           │
├──────────────────┴──────────────────────┤
│  💬 "오빠~ 머리 색깔 바꿨어?"           │
│  [🎤 녹음]   [💡 Hint]   [📝 입력]      │
└─────────────────────────────────────────┘
```

#### 2.7 TypeScript 타입 시스템 (Phase 2)
```typescript
frontend/types/
├── emotion.ts    ✅ EmotionStage, EmotionScore, YeriDialogue
├── player.ts     ✅ PlayerInfo, AgeGroup, StartFormData
├── game.ts       ✅ GameSession, TurnState, ScoreSnapshot
├── api.ts        ✅ 모든 API 요청/응답 타입
└── index.ts      ✅ 통합 export
```

**주요 타입**:
```typescript
type EmotionStage = "S0" | "S1" | "S2" | "S3" | "S4";
type TurnIndex = 1 | 2 | 3;
type EndingType = "love" | "cute_upset" | "breakup";

interface GameSession {
  sessionId: string;
  player: PlayerInfo;
  currentTurn: TurnIndex;
  turns: TurnState[];
  emotionStage: EmotionStage;
  finalScore?: FinalScore;
  status: SessionStatus;
  imagePair: ImagePair;
}
```

#### 2.8 상수 및 설정 (Phase 3)
```typescript
// frontend/lib/constants.ts
✅ 게임 설정
- TURN_TIME_LIMITS = { 1: 3, 2: 10, 3: 30 }
- SCORE_WEIGHTS = { EMOTION_SENSE: 0.6, OBSERVATION: 0.25, REFLEX: 0.15 }
- COMBO_BONUS = { 1: 2, 2: 4, 3: 6 }

✅ 감정 시스템
- EMOTION_STAGES = { S0: {...}, S1: {...}, ... }

✅ UI 텍스트
- OPENING_DIALOGUES
- BEFORE_DIALOGUES
- TURN_DIALOGUES
- COMBO_DIALOGUES
- WRONG_ANSWER_DIALOGUES
- ENDING_MESSAGES

✅ 컬러 팔레트
- COLORS = { background, titleBar, progressActive, ... }

✅ API 설정
- API_BASE_URL = "http://localhost:8000"
- API_ENDPOINTS
```

---

### ✅ 문서화 (Phase 1-3)

```
docs/
├── 00_Yeri_Project_Masterbook.md       (원본 - 마스터 가이드)
├── 01_Game_Structure.md                (업데이트 - UI 디자인 추가)
├── 02_Score_System_Detail.md           (원본)
├── 03_Character_Design.md              (원본)
├── 04_LLM_Prompt_Design.md             (원본)
├── 06_Technical_Implementation.md      (원본)
├── 07_Production_Pipeline.md           (원본)
├── 08_Frontend_Development_Plan.md     (신규 - 개발 계획)
├── 09_Frontend_Types.md                (신규 - 타입 문서)
└── 00_Session_Complete_Guide.md        (신규 - 이 문서)
```

**누락된 문서**:
- `05_UI_UX_Design.md` → `01_Game_Structure.md` Section 7에 통합됨
- `08_Marketing_SNS.md` → 추후 생성 예정

---

## 3. 현재 프로젝트 구조

### 3.1 백엔드 (완성)
```
backend/
├── app/
│   ├── main.py              ✅ FastAPI 앱
│   ├── core/
│   │   ├── config.py        ✅ 설정
│   │   └── logger.py        ✅ 로깅
│   ├── models/
│   │   ├── emotion.py       ✅ 감정 모델
│   │   ├── score.py         ✅ 점수 모델
│   │   └── session.py       ✅ 세션 모델
│   ├── api/
│   │   ├── healthcheck.py   ✅ Health API
│   │   └── session.py       ✅ 세션 API (MVP - Mock)
│   └── services/            ⏳ 대기 (EEVE, TTS/STT)
├── requirements.txt         ✅
├── .env.example            ✅
└── logs/                   ✅ 로그 디렉터리
```

### 3.2 프론트엔드 (진행 중)
```
frontend/
├── types/                   ✅ 완료
├── lib/
│   └── constants.ts         ✅ 완료
├── components/              ⏳ 대기
├── hooks/                   ⏳ 대기
└── app/                     ⏳ 대기
```

---

## 4. 설계 변경 사항

### 4.1 게임 플로우 변경

| 항목 | 이전 | 변경 후 | 이유 |
|------|------|---------|------|
| 시작 | 바로 After | Before 인지 단계 추가 | 플레이어 인지 시간 필요 |
| 플레이어 정보 | 없음 | 이름/연령대 입력 | SNS 공유 개인화 |
| UI 스타일 | 미정 | 02번 스타일 확정 | 핑크/파스텔 테마 |
| 레이아웃 | 단일 이미지 | Before/After 분할 | 비교 용이성 |

### 4.2 SNS 공유 변경

**제거**: 연령대 정보 (프라이버시 고려)

**최종 공유 카드**:
```
"{이름}님의 연애 센스 점수: 75점"
감정센스: 45점 / 관찰력: 19점 / 순발력: 11점
```

---

## 5. 다음 작업

### Phase 4: API 클라이언트 (다음 단계)
```typescript
// frontend/lib/api.ts
□ startSession()
□ submitAnswer()
□ finishSession()
□ getSession()
□ healthCheck()
```

### Phase 5-10: 컴포넌트 및 페이지
```
□ Phase 5: 기본 UI 컴포넌트 (Button, ProgressBar, Timer, Popup)
□ Phase 6: 게임 컴포넌트 (GameHeader, ImageComparison, DialogueBox, AnswerInput)
□ Phase 7: 시작/결과 컴포넌트
□ Phase 8: 페이지 구현
□ Phase 9: 상태 관리 훅
□ Phase 10: 통합 테스트
```

---

## 6. 재시작 방법

### 6.1 빠른 상황 파악
```
1. 이 문서 읽기 (00_Session_Complete_Guide.md)
2. 관련 문서 확인:
   - docs/01_Game_Structure.md (게임 구조 + UI)
   - docs/08_Frontend_Development_Plan.md (개발 계획)
   - docs/09_Frontend_Types.md (타입 시스템)
3. 백엔드 상태 확인:
   - cd backend && uvicorn app.main:app --reload
   - http://localhost:8000/docs
```

### 6.2 다음 작업 시작 명령
```
"Phase 4 API 클라이언트 구현을 시작하겠습니다.
docs/00_Session_Complete_Guide.md를 확인했으니,
frontend/lib/api.ts 파일을 생성하고
백엔드 API 호출 함수를 구현해주세요."
```

### 6.3 주요 설계 결정 요약

1. ✅ **Before 인지 단계 추가**: 플레이어가 Before 이미지를 충분히 인지
2. ✅ **UI 스타일 확정**: 02번 핑크/파스텔 테마
3. ✅ **3버튼 레이아웃**: 🎤 녹음 / 💡 Hint / 📝 입력
4. ✅ **Progress Bar + 감정 아이콘 이동**: 시간 감소에 따라 좌측 이동
5. ✅ **SNS 공유**: 이름만 포함, 연령대 제외

---

## 7. 확장 기능 (논의 중)

### 7.1 티키타카 대화 모드 (Post-MVP)
**컨셉**: 게임 외 자유 대화
- "데이트 코스 추천해줘"
- "선물 추천 좀~"

**구현 방안**:
- 별도 "예리랑 수다 떨기" 메뉴
- 대화 길이 제한 (비용 고려)

### 7.2 게임 설정 커스터마이징 (Phase 8 추가 예정)
**컨셉**: 데이트 시간 선택
- 짧은 데이트 ⏱️: 3초 → 10초 → 30초 (기본)
- 긴 데이트 💕: 3초 → 10초 → 60초 (여유롭게)

---

## 8. 진행 상황

**진행률**: 30% (Phase 3/10)

| Phase | 상태 | 내용 |
|-------|------|------|
| Phase 1 | ✅ 완료 | 프로젝트 기획 + 백엔드 구현 |
| Phase 2 | ✅ 완료 | TypeScript 타입 시스템 |
| Phase 3 | ✅ 완료 | 상수 및 설정 |
| Phase 4 | ⏳ 대기 | API 클라이언트 |
| Phase 5-10 | ⏳ 대기 | 컴포넌트 + 페이지 |

---

**마지막 업데이트**: 2025-11-07
**작성자**: Claude Code

> 이 문서는 프로젝트의 모든 맥락과 진행 상황을 포함합니다.
> 세션이 끊긴 후 이 문서만으로 개발을 재개할 수 있습니다.
