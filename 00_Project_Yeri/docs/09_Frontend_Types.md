# 09_Frontend_Types.md

## TypeScript 타입 정의 문서 (Phase 2 완료)

**작성일**: 2025-11-07
**상태**: ✅ 완료

---

## 📋 개요

프론트엔드 전체에서 사용할 TypeScript 타입을 정의했습니다. 모든 타입은 백엔드 모델과 일치하도록 설계되었으며, 타입 안정성을 보장합니다.

---

## 🗂️ 타입 파일 구조

```
frontend/types/
├── index.ts         # 모든 타입 통합 export
├── emotion.ts       # 감정 시스템 타입
├── player.ts        # 플레이어 정보 타입
├── game.ts          # 게임 상태 및 턴 타입
└── api.ts           # API 요청/응답 타입
```

---

## 1. 감정 시스템 타입 (`emotion.ts`)

### EmotionStage
```typescript
export type EmotionStage = "S0" | "S1" | "S2" | "S3" | "S4";
```

| Stage | 감정 이름 | 설명 |
|-------|----------|------|
| S0 | Neutral | 기본 미소 |
| S1 | Playful | 장난스러움 |
| S2 | Curious | 호기심/짜증 |
| S3 | Upset | 실망 |
| S4 | Affectionate | 감동/행복 |

### EmotionStageInfo
```typescript
export interface EmotionStageInfo {
  stage: EmotionStage;
  emotionName: string;
  description: string;
  expressionFile: string;
  emotionMultiplier: number; // 0.8 ~ 1.2
}
```

### EmotionScore (EEVE LLM 평가 결과)
```typescript
export interface EmotionScore {
  emotionDepth: number;     // 0.0 ~ 1.0
  empathyScore: number;     // 0.0 ~ 1.0
  senseScore: number;       // 0.0 ~ 1.0
  overallStage: EmotionStage;
}
```

### YeriDialogue
```typescript
export interface YeriDialogue {
  emotionStage: EmotionStage;
  text: string;
  tone: string;
  cacheFile?: string;
  isCached: boolean;
  weight: number;           // 0.0 ~ 1.0
}
```

---

## 2. 플레이어 정보 타입 (`player.ts`)

### AgeGroup
```typescript
export type AgeGroup = "10대" | "20대" | "30대" | "40대+";
```

### PlayerInfo
```typescript
export interface PlayerInfo {
  playerId?: string;
  name: string;
  ageGroup: AgeGroup;
  createdAt?: Date;
}
```

### StartFormData
```typescript
export interface StartFormData {
  name: string;
  ageGroup: AgeGroup;
}
```

---

## 3. 게임 상태 타입 (`game.ts`)

### 기본 타입
```typescript
export type Difficulty = "easy" | "medium" | "hard";
export type SessionStatus = "playing" | "finished" | "timeout" | "error";
export type TurnIndex = 1 | 2 | 3;
export type InputType = "text" | "audio";
export type EndingType = "love" | "cute_upset" | "breakup";
```

### ImagePair
```typescript
export interface ImagePair {
  pairId: string;
  beforeUrl: string;
  afterUrl: string;
  differences: string[];    // ["헤어스타일", "립스틱", "귀걸이"]
  difficulty: Difficulty;
}
```

### ComboState
```typescript
export interface ComboState {
  currentCombo: number;     // 0~3
  maxCombo: number;
  lastAnswerCorrect: boolean;
}
```

### ScoreSnapshot
```typescript
export interface ScoreSnapshot {
  turnIndex: TurnIndex;
  emotionalSense: number;   // 0~100
  observation: number;      // 0~100
  reflex: number;           // 0~100
  emotionMultiplier: number; // 0.8~1.2
  comboBonus: number;       // 0~6
  turnScore: number;
}
```

### TurnState
```typescript
export interface TurnState {
  turnIndex: TurnIndex;
  timeLimitSec: number;     // 3, 10, 30
  remainingSec: number;
  startTime: Date;
  answers: string[];
  emotionScores: EmotionScore[];
  comboState: ComboState;
  isFinished: boolean;
}
```

### GameSession
```typescript
export interface GameSession {
  sessionId: string;
  player: PlayerInfo;
  currentTurn: TurnIndex;
  turns: TurnState[];
  emotionStage: EmotionStage;
  finalScore?: FinalScore;
  status: SessionStatus;
  imagePair: ImagePair;
  createdAt: Date;
  updatedAt: Date;
}
```

### GameState (UI용 상태)
```typescript
export interface GameState {
  session: GameSession | null;
  isLoading: boolean;
  error: string | null;
  currentDialogue: string;
  currentVoiceUrl?: string;
}
```

---

## 4. API 타입 (`api.ts`)

### 공통 응답 구조
```typescript
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
```

### 세션 시작
```typescript
// 요청
export interface SessionStartRequest {
  player_id?: string;
  difficulty?: Difficulty;
}

// 응답
export interface SessionStartResponse {
  session_id: string;
  image_pair: ImagePair;
  current_turn: number;
  emotion_stage: EmotionStage;
  time_limit_sec: number;
  yeri_opening_text: string;
  yeri_opening_voice_url?: string;
}
```

### 답변 제출
```typescript
// 요청
export interface PlayerAnswerRequest {
  session_id: string;
  turn_index: TurnIndex;
  input_type: InputType;
  content: string;
}

// 응답
export interface PlayerAnswerResponse {
  yeri_text: string;
  yeri_voice_url?: string;
  emotion_stage: EmotionStage;
  updated_scores: {
    turn_score?: number;
    combo?: number;
  };
  remaining_sec: number;
  combo_count: number;
  is_turn_finished: boolean;
}
```

### 세션 종료
```typescript
// 요청
export interface SessionFinishRequest {
  session_id: string;
}

// 응답
export interface SessionFinishResponse {
  session_id: string;
  final_score: number;
  ending_type: EndingType;
  yeri_ending_text: string;
  yeri_ending_voice_url?: string;
  can_retry: boolean;
  score_breakdown: {
    emotional_sense: number;
    observation: number;
    reflex: number;
  };
}
```

---

## 📦 사용 예시

### Import 방법
```typescript
// 개별 import
import type { EmotionStage, PlayerInfo } from "@/types";

// 또는
import type { EmotionStage } from "@/types/emotion";
import type { PlayerInfo } from "@/types/player";
```

### 컴포넌트에서 사용
```typescript
import type { GameState, TurnState } from "@/types";

const GameComponent = () => {
  const [gameState, setGameState] = useState<GameState>({
    session: null,
    isLoading: false,
    error: null,
    currentDialogue: "",
  });

  // ...
};
```

### API 호출에서 사용
```typescript
import type { SessionStartRequest, SessionStartResponse } from "@/types";

async function startSession(
  request: SessionStartRequest
): Promise<SessionStartResponse> {
  const response = await fetch("/api/session/start", {
    method: "POST",
    body: JSON.stringify(request),
  });
  return response.json();
}
```

---

## ✅ 체크리스트

- [x] `types/emotion.ts` - 감정 시스템 타입 ✅
- [x] `types/player.ts` - 플레이어 정보 타입 ✅
- [x] `types/game.ts` - 게임 상태 타입 ✅
- [x] `types/api.ts` - API 요청/응답 타입 ✅
- [x] `types/index.ts` - 통합 export ✅

---

## 🔗 관련 문서

- `docs/01_Game_Structure.md` - 게임 구조 (타입 설계 기반)
- `docs/02_Score_System_Detail.md` - 점수 시스템
- `docs/03_Character_Design.md` - 캐릭터 및 감정 디자인
- `backend/app/models/` - 백엔드 Pydantic 모델

---

## 📌 다음 단계

**Phase 3**: 상수 및 설정 파일 생성 (`lib/constants.ts`)
- 감정 단계별 정보
- 게임 설정 값
- UI 텍스트 및 대사
- 컬러 팔레트

---

**Phase 2 완료!** 🎉
**진행률**: 20% (2/10 Phase)
