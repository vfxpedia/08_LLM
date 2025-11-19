# 13. Core Implementation Guide

**작성일**: 2025-11-10
**참조**: `12_Game_Core_Design_Final.md`, `11_Game_Flow_Redesign.md`

---

## 목차

1. [구현 완료 기능 개요](#1-구현-완료-기능-개요)
2. [2턴 카드 플립 메커니즘](#2-2턴-카드-플립-메커니즘)
3. [연속 답변 입력 시스템](#3-연속-답변-입력-시스템)
4. [음성/텍스트 하이브리드 입력](#4-음성텍스트-하이브리드-입력)
5. [게임 데이터 구조](#5-게임-데이터-구조)
6. [인트로 화면](#6-인트로-화면)
7. [사용 예시](#7-사용-예시)
8. [다음 단계 (EEVE 통합)](#8-다음-단계-eeve-통합)

---

## 1. 구현 완료 기능 개요

### ✅ Phase 1: 코어 메커니즘 (완료)

- **2턴 카드 플립**: CSS 3D Transform 기반 회전 애니메이션
- **힌트 시스템**: 1회 사용, 5초 자동 복귀, 타이머 일시정지
- **타이머 제어**: pause/resume 지원

### ✅ Phase 2: 답변 시스템 (완료)

- **연속 입력 저장**: `PlayerAnswer[]` 배열 구조
- **턴별 관리**: 턴 인덱스 기반 필터링
- **답변 판정**: VectorDB 유사도 + 감정 점수 통합 구조

### ✅ Phase 3: 음성 시스템 (완료)

- **Web Speech API**: 연속 인식 모드
- **자동 활성화**: 턴 2-3에서 자동 시작
- **실시간 STT**: 텍스트 변환 + 자동 제출
- **하이브리드 입력**: 텍스트 + 음성 동시 지원

### ✅ Phase 4: 게임 데이터 (완료)

- **GameData 구조**: 이미지 쌍 + 정답 세트
- **AnswerSet**: 키워드 + 감정 키워드 + 임계값
- **샘플 데이터**: 5개 게임 세트 (easy/medium/hard)

### ✅ Phase 5: 인트로 화면 (완료)

- **캐릭터 등장**: 예리 인사 + TTS 재생 준비
- **Before 관찰**: 플레이어 주도 타이밍
- **게임 시작**: 버튼 클릭 → 즉시 1턴 시작

---

## 2. 2턴 카드 플립 메커니즘

### 파일 위치
```
frontend/components/game/ImageComparison.tsx
```

### 핵심 기능

#### 2.1 CSS 3D 카드 플립

```tsx
<div style={{ perspective: "1000px" }}>
  <div
    className="transition-transform duration-700"
    style={{
      transformStyle: "preserve-3d",
      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    }}
  >
    {/* 앞면 - After 이미지 */}
    <div style={{ backfaceVisibility: "hidden" }}>
      <Image src={afterUrl} ... />
    </div>

    {/* 뒷면 - Before 이미지 */}
    <div style={{
      backfaceVisibility: "hidden",
      transform: "rotateY(180deg)"
    }}>
      <Image src={beforeUrl} ... />
    </div>
  </div>
</div>
```

#### 2.2 힌트 시스템

**특징**:
- 1회 사용 제한 (`hintUsed` state)
- 5초 카운트다운 (`autoFlipCountdown`)
- 자동 복귀 (useEffect 타이머)

**타이머 제어**:
```tsx
const handleHintClick = () => {
  setIsFlipped(true);
  setHintUsed(true);

  // 타이머 일시정지 요청
  if (onHintStart) {
    onHintStart(); // 부모 컴포넌트에 알림
  }

  // 5초 카운트다운 시작
  setAutoFlipCountdown(5);
};

// 5초 후 자동 복귀
useEffect(() => {
  if (autoFlipCountdown === 0) {
    setIsFlipped(false);
    if (onHintEnd) {
      onHintEnd(); // 타이머 재개 요청
    }
  }
}, [autoFlipCountdown]);
```

#### 2.3 Props 인터페이스

```tsx
export interface ImageComparisonProps {
  beforeUrl: string;
  afterUrl: string;
  turnIndex: TurnIndex;
  displayMode?: ImageDisplayMode;
  canUseHint?: boolean;           // 힌트 사용 가능 여부
  onHintStart?: () => void;       // 타이머 일시정지 콜백
  onHintEnd?: () => void;         // 타이머 재개 콜백
}
```

---

## 3. 연속 답변 입력 시스템

### 파일 위치
```
frontend/hooks/usePlayerAnswers.ts
frontend/types/game.ts (PlayerAnswer, AnswerSet)
```

### 핵심 구조

#### 3.1 PlayerAnswer 인터페이스

```typescript
export interface PlayerAnswer {
  turnIndex: TurnIndex;           // 1, 2, 3
  answerIndex: number;            // 해당 턴 내 순서 (1, 2, 3...)
  content: string;                // 답변 내용
  inputType: InputType;           // "text" | "voice"
  timestamp: number;              // 답변 시각
  isCorrect: boolean | null;      // 정답 여부 (null: 판정 전)
  similarity: number | null;      // VectorDB 유사도 (0.0~1.0)
  emotionalScore: number;         // EEVE 감정 점수 (0~100)
  feedback?: string;              // 피드백 메시지
}
```

#### 3.2 usePlayerAnswers 훅

**기능**:
- 답변 추가 (자동 인덱싱)
- 판정 결과 업데이트
- 턴별 필터링
- 정답 개수 카운트

**사용 예시**:
```tsx
const { answers, addAnswer, updateAnswerResult, getCorrectCount } = usePlayerAnswers();

// 텍스트 답변 추가
addAnswer("예리 머리 가르마 바뀐 것 같아!", "text", 2);

// 음성 답변 추가
addAnswer("립스틱 색깔 바뀌었어?", "voice", 2);

// 답변 판정 결과 업데이트
updateAnswerResult(0, true, 0.85, 75, "오빠 센스 대박!");

// 정답 개수 확인
const correctCount = getCorrectCount(2); // 턴 2의 정답 개수
```

#### 3.3 TurnState 업데이트

```typescript
export interface TurnState {
  turnIndex: TurnIndex;
  timeLimitSec: number;
  remainingSec: number;
  startTime: Date;
  answers: PlayerAnswer[];        // string[] → PlayerAnswer[]
  emotionScores: EmotionScore[];
  comboState: ComboState;
  isFinished: boolean;
  isPaused: boolean;              // 힌트 사용 시 타이머 일시정지
}
```

---

## 4. 음성/텍스트 하이브리드 입력

### 파일 위치
```
frontend/hooks/useVoiceInput.ts
frontend/components/game/HybridInput.tsx
```

### 핵심 기능

#### 4.1 useVoiceInput 훅

**Web Speech API 설정**:
```typescript
const recognition = new SpeechRecognition();
recognition.continuous = true;      // 연속 인식
recognition.interimResults = true;  // 임시 결과 표시
recognition.lang = "ko-KR";         // 한국어
```

**자동 활성화**:
```typescript
useEffect(() => {
  if (autoActivate && isSupported) {
    startListening();
    return () => stopListening();
  }
}, [autoActivate]);
```

**실시간 결과 처리**:
```typescript
recognition.onresult = (event) => {
  let final = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      final += event.results[i][0].transcript;
    }
  }

  if (final && onResult) {
    onResult(final); // 콜백 호출
  }
};
```

#### 4.2 HybridInput 컴포넌트

**특징**:
- 텍스트 입력 (form + input)
- 음성 입력 (자동/수동 토글)
- 실시간 STT 표시
- 턴별 안내 문구

**사용 예시**:
```tsx
<HybridInput
  currentTurn={2}
  onSubmit={(content, type) => {
    addAnswer(content, type, 2);
    // EEVE API 호출 (향후 구현)
  }}
  autoActivateVoice={true}
/>
```

**자동 제출**:
```typescript
useVoiceInput({
  onResult: (transcript) => {
    if (transcript.trim().length > 0) {
      onSubmit(transcript.trim(), "voice");
    }
  }
});
```

---

## 5. 게임 데이터 구조

### 파일 위치
```
frontend/data/gameData.ts
frontend/types/game.ts (GameData, AnswerSet)
```

### 핵심 구조

#### 5.1 GameData 인터페이스

```typescript
export interface GameData {
  id: string;                     // "game_01_hair_parting"
  beforeImage: string;            // "/images/test01_before.png"
  afterImage: string;             // "/images/test01_after.png"
  correctAnswers: AnswerSet;
  difficulty: Difficulty;         // "easy" | "medium" | "hard"
  changeDescription: string;      // 관리용 설명
}
```

#### 5.2 AnswerSet 인터페이스

```typescript
export interface AnswerSet {
  keywords: string[];             // 핵심 키워드
  emotionalKeywords: string[];    // 감정 표현 키워드
  threshold: number;              // 정답 판정 임계값 (0.7 = 70%)
}
```

#### 5.3 샘플 데이터 예시

```typescript
{
  id: "game_01_hair_parting",
  beforeImage: "/images/test01_before.png",
  afterImage: "/images/test01_after.png",
  difficulty: "hard",
  changeDescription: "가르마 방향 변경 (왼쪽 → 오른쪽, 2cm 이동)",
  correctAnswers: {
    keywords: [
      "머리", "가르마", "왼쪽", "오른쪽", "헤어", "스타일",
      "위치", "바뀌다", "달라지다", "이동"
    ],
    emotionalKeywords: [
      "예쁘다", "잘 어울리다", "귀엽다", "사랑스럽다",
      "멋지다", "달라 보이다", "신선하다", "좋다", "센스있다"
    ],
    threshold: 0.7
  }
}
```

#### 5.4 유틸리티 함수

```typescript
// 랜덤 선택
const gameData = getRandomGameData();

// 난이도별 필터링
const hardGames = getGameDataByDifficulty("hard");

// ID로 찾기
const game = getGameDataById("game_01_hair_parting");
```

---

## 6. 인트로 화면

### 파일 위치
```
frontend/components/game/IntroScreen.tsx
```

### 흐름

#### 6.1 단계 1: 인사 (Greeting)

**특징**:
- 예리 캐릭터 이미지 표시
- 랜덤 인사 대사 선택
- TTS 재생 준비 (TODO)
- 3초 후 자동 진행

```tsx
const greetingDialogues = [
  `${nickname} 오빠~ 왜 이렇게 빨리 왔어? 예리 아직 준비 다 못했는데...`,
  `${nickname} 오빠~ 기다렸지? 조금만 기다려줘~♡`,
  `${nickname} 오빠, 벌써 왔어? 예리 아직 화장 다 안 했는데...`,
];
```

#### 6.2 단계 2: 관찰 (Observation)

**특징**:
- Before 이미지 전체 화면 표시
- 플레이어 주도 타이밍 (시간 제한 없음)
- "시작하기" 버튼 클릭 → 게임 시작

```tsx
<button onClick={onStart} className="...">
  🚀 게임 시작하기!
</button>
```

#### 6.3 사용 예시

```tsx
<IntroScreen
  nickname={playerInfo.nickname}
  beforeImageUrl={gameData.beforeImage}
  onStart={() => {
    // 게임 시작 로직
    setGamePhase("playing");
    startTurn(1);
  }}
/>
```

---

## 7. 사용 예시

### 전체 게임 흐름 통합

```tsx
"use client";

import { useState } from "react";
import { IntroScreen, ImageComparison, HybridInput } from "@/components/game";
import { usePlayerAnswers } from "@/hooks/usePlayerAnswers";
import { getRandomGameData } from "@/data/gameData";

export default function GamePage() {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [currentTurn, setCurrentTurn] = useState<1 | 2 | 3>(1);
  const [gameData] = useState(getRandomGameData());

  const { answers, addAnswer, getCorrectCount } = usePlayerAnswers();

  // 게임 시작
  const handleGameStart = () => {
    setPhase("playing");
    setCurrentTurn(1);
    // 타이머 시작...
  };

  // 답변 제출
  const handleSubmit = async (content: string, inputType: "text" | "voice") => {
    // 답변 저장
    addAnswer(content, inputType, currentTurn);

    // TODO: EEVE API 호출
    // const result = await checkAnswer(content, gameData.correctAnswers);
    // updateAnswerResult(answers.length, result.isCorrect, result.similarity, result.emotionalScore);
  };

  // 힌트 사용 (타이머 제어)
  const handleHintStart = () => {
    // 타이머 일시정지
  };

  const handleHintEnd = () => {
    // 타이머 재개
  };

  if (phase === "intro") {
    return (
      <IntroScreen
        nickname="플레이어"
        beforeImageUrl={gameData.beforeImage}
        onStart={handleGameStart}
      />
    );
  }

  if (phase === "playing") {
    return (
      <div>
        <ImageComparison
          beforeUrl={gameData.beforeImage}
          afterUrl={gameData.afterImage}
          turnIndex={currentTurn}
          canUseHint={currentTurn === 2}
          onHintStart={handleHintStart}
          onHintEnd={handleHintEnd}
        />

        <HybridInput
          currentTurn={currentTurn}
          onSubmit={handleSubmit}
          autoActivateVoice={currentTurn >= 2}
        />
      </div>
    );
  }

  return <ResultScreen ... />;
}
```

---

## 8. 다음 단계 (EEVE 통합)

### 8.1 필요한 구현

#### VectorDB 유사도 API
```typescript
// frontend/services/vectordb.ts
export async function calculateSimilarity(
  playerAnswer: string,
  keywords: string[]
): Promise<number> {
  const response = await fetch("/api/vectordb/similarity", {
    method: "POST",
    body: JSON.stringify({ answer: playerAnswer, keywords }),
  });
  const { similarity } = await response.json();
  return similarity; // 0.0 ~ 1.0
}
```

#### EEVE 감정 분석 API
```typescript
// frontend/services/eeve.ts
export async function analyzeEmotion(
  playerAnswer: string,
  emotionalKeywords: string[]
): Promise<{
  emotionalScore: number;
  feedback: string;
}> {
  const response = await fetch("/api/eeve/analyze", {
    method: "POST",
    body: JSON.stringify({ answer: playerAnswer, emotionalKeywords }),
  });
  return await response.json();
}
```

#### 정답 판정 통합
```typescript
// frontend/services/answerJudge.ts
export async function judgeAnswer(
  playerAnswer: string,
  answerSet: AnswerSet
): Promise<{
  isCorrect: boolean;
  similarity: number;
  emotionalScore: number;
  feedback: string;
}> {
  // 1. VectorDB 유사도 계산
  const similarity = await calculateSimilarity(
    playerAnswer,
    answerSet.keywords
  );

  // 2. EEVE 감정 분석
  const { emotionalScore, feedback } = await analyzeEmotion(
    playerAnswer,
    answerSet.emotionalKeywords
  );

  // 3. 정답 판정 (임계값 비교)
  const isCorrect = similarity >= answerSet.threshold;

  return { isCorrect, similarity, emotionalScore, feedback };
}
```

### 8.2 사용 예시

```tsx
const handleSubmit = async (content: string, inputType: "text" | "voice") => {
  // 답변 추가 (판정 전)
  addAnswer(content, inputType, currentTurn);

  // EEVE 통합 판정
  const result = await judgeAnswer(content, gameData.correctAnswers);

  // 판정 결과 업데이트
  const answerIndex = answers.length;
  updateAnswerResult(
    answerIndex,
    result.isCorrect,
    result.similarity,
    result.emotionalScore,
    result.feedback
  );

  // 피드백 팝업 표시
  showPopup(result.feedback, result.isCorrect ? "correct" : "wrong");
};
```

---

## 부록: 파일 구조 요약

```
frontend/
├── components/game/
│   ├── ImageComparison.tsx      ✅ 2턴 카드 플립 구현
│   ├── IntroScreen.tsx          ✅ 인트로 화면
│   ├── HybridInput.tsx          ✅ 음성/텍스트 입력
│   └── index.ts                 ✅ export 추가
├── hooks/
│   ├── usePlayerAnswers.ts      ✅ 연속 답변 관리
│   └── useVoiceInput.ts         ✅ 음성 입력 관리
├── types/
│   ├── game.ts                  ✅ PlayerAnswer, AnswerSet, GameData
│   └── index.ts                 ✅ export 추가
├── data/
│   └── gameData.ts              ✅ 게임 데이터 5개
└── services/                    ⏳ EEVE 통합 예정
    ├── vectordb.ts
    ├── eeve.ts
    └── answerJudge.ts
```

---

**작성 완료**: 2025-11-10
**다음 작업**: EEVE API 통합, 백엔드 연동, TTS 구현
