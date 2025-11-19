# 12_Game_Core_Design_Final.md

## "예리는 못 말려" 게임 코어 설계 (최종 확정)

**작성일**: 2025-11-09
**버전**: v3.0 (최종 확정)
**상태**: ✅ 사용자 승인 완료

---

## 🎯 게임 핵심 컨셉 (필독!)

### ⚠️ **중요: 이 게임은 "단순 틀린그림찾기"가 아닙니다!**

```
일반 틀린그림찾기:
- 차이점만 찾으면 끝
- 감정 없음
- 단순 관찰력 테스트

우리 게임 "예리는 못 말려":
- 차이점 파악 (관찰력) 40%
- 감정 표현 (감정 센스) 40%
- 대화 자연스러움 20%
  ↓
= 연애 시뮬레이션 + 관찰 게임
```

**핵심 가치**:
1. 예리와 "진짜 대화하는 느낌"
2. 감정 센스가 점수에 큰 영향
3. LLM 기반 자연스러운 대화

---

## 🎮 턴별 메커니즘 (최종 확정)

### 1턴 (3초): After만 - 실패 전제 ✅

```
Before 이미지 충분히 관찰 (10~20초, 플레이어 주도)
  ↓
"시작" 버튼 클릭
  ↓
After 이미지 전체 화면 (3초)
  ↓
타이머 즉시 시작 ⏱️
  ↓
[거의 불가능한 시간]
  ↓
결과: 실패 (의도된 디자인)
  ↓
예리 반응: "오빠~ 실망이야..."
```

**목적**: 재미 + 난이도 체감 + 2턴 동기 부여

---

### 2턴 (10초): 카드 플립 + 힌트 ⭐ 신규!

#### 메커니즘: 카드 회전 (회전문 스타일)

```
After 이미지만 표시
  ↓
하단: 💡 "힌트 보기" 버튼 (1회 제한, 무료)
  ↓
플레이어 클릭
  ↓
[카드 회전 애니메이션]
- 3D 회전 효과 (Y축 180도)
- 애니메이션 시간: 0.7초
- Before 이미지로 전환
  ↓
Before 표시 (5초)
- ⏸️ 타이머 정지!
- 카운트다운 표시: "4초 후 자동 복귀"
  ↓
[카드 역회전 애니메이션]
- 다시 180도 회전
- After 이미지로 복귀
  ↓
▶️ 타이머 재시작
  ↓
계속 플레이 (남은 시간)
```

#### 설계 근거:

**왜 카드 회전?**
- ✅ 기억력 챌린지 (회전 중 비교 어려움)
- ✅ 독창적 메커니즘 (차별화)
- ✅ 전략적 깊이 (힌트 사용 타이밍)
- ✅ 검증된 패턴 (Hearthstone 등)

**왜 타이머 정지?**
- ✅ 공정성 (관찰 시간 보장)
- ✅ 플레이어 페이스 존중
- ✅ 접근성 향상

**왜 1회 제한?**
- ✅ 전략적 선택 강제
- ✅ 난이도 유지
- ✅ 긴장감 유지

---

### 3턴 (40초/60초): Before/After 분할 - 진짜 게임 ✅

```
Before/After 좌우 분할 화면
  ↓
충분한 시간 (40초 or 60초)
  ↓
자세히 비교 가능
  ↓
정답 확률 높음 (60~80%)
```

**목적**: 공정한 게임, 최종 기회, 성취감

---

## 💾 답변 저장 및 판정 시스템

### 데이터 구조

#### 1. 게임 정답 데이터 (사전 세팅)

```typescript
interface GameData {
  id: string;
  beforeImage: string;
  afterImage: string;
  correctAnswers: AnswerSet;
  difficulty: "hard" | "medium" | "easy";
}

interface AnswerSet {
  // 정답 키워드 리스트 (VectorDB 임베딩용)
  keywords: string[];

  // 감정 센스 보너스 키워드
  emotionalKeywords: string[];

  // 유사도 임계값 (70% 이상 정답)
  threshold: number; // 0.7

  // 선택적: 정확한 정답 (참고용)
  exactAnswer?: string;
}
```

**예시 데이터**:
```typescript
const game_001: GameData = {
  id: "yeri_hard_001",
  beforeImage: "/images/yeri/hard_001_before.png",
  afterImage: "/images/yeri/hard_001_after.png",
  correctAnswers: {
    keywords: [
      "가르마",
      "가운데",
      "중앙",
      "왼쪽",
      "좌측",
      "이동",
      "바뀜",
      "변경",
      "헤어",
      "머리",
      "스타일"
    ],
    emotionalKeywords: [
      "예쁘다",
      "이쁘다",
      "잘 어울린다",
      "좋아",
      "좋다",
      "설레",
      "귀엽다",
      "사랑스럽다"
    ],
    threshold: 0.7,
    exactAnswer: "가르마가 중앙에서 왼쪽으로 약 2cm 이동"
  },
  difficulty: "hard"
};
```

---

#### 2. 플레이어 답변 리스트

```typescript
interface PlayerAnswer {
  // 턴 정보
  turnIndex: 1 | 2 | 3;
  answerIndex: number; // 해당 턴에서 몇 번째 답변

  // 답변 내용
  content: string;
  inputType: "text" | "voice";
  timestamp: number; // 제출 시각

  // 분석 결과 (EEVE + VectorDB)
  isCorrect: boolean | null; // 분석 전 null
  similarity: number | null; // 유사도 (0.0 ~ 1.0)
  emotionalScore: number; // 감정 센스 (0 ~ 100)

  // 피드백
  feedback?: string; // 예리의 반응
}
```

**턴별 그룹핑**:
```typescript
interface GameSession {
  sessionId: string;
  playerId: string;
  gameData: GameData;

  // 턴별 답변 리스트
  turn1Answers: PlayerAnswer[];
  turn2Answers: PlayerAnswer[];
  turn3Answers: PlayerAnswer[];

  // 최종 결과
  finalScore: FinalScore | null;
}
```

---

### 유사도 계산 로직

#### VectorDB + EEVE 통합

```typescript
async function analyzeAnswer(
  answer: string,
  correctAnswers: AnswerSet
): Promise<AnalysisResult> {

  // 1. VectorDB로 유사도 계산
  const keywordSimilarity = await calculateKeywordSimilarity(
    answer,
    correctAnswers.keywords
  );

  // 2. EEVE로 감정 분석
  const emotionalScore = await analyzeEmotionalSense(
    answer,
    correctAnswers.emotionalKeywords
  );

  // 3. 정답 판정
  const isCorrect = keywordSimilarity >= correctAnswers.threshold;

  // 4. 피드백 생성
  const feedback = generateRealTimeFeedback(
    keywordSimilarity,
    emotionalScore,
    isCorrect
  );

  return {
    isCorrect,
    similarity: keywordSimilarity,
    emotionalScore,
    feedback
  };
}

interface AnalysisResult {
  isCorrect: boolean;
  similarity: number; // 0.0 ~ 1.0
  emotionalScore: number; // 0 ~ 100
  feedback: string; // 예리의 즉각 반응
}
```

---

### 유사도 판정 예시

```typescript
// 예시 1: 정답 (높은 유사도)
입력: "가르마가 중앙에서 왼쪽으로 살짝 바뀌었네?"
키워드 매칭: ["가르마", "중앙", "왼쪽", "바뀜"]
유사도: 0.95 → 정답! ✅
감정 점수: 0 (감정 표현 없음)

// 예시 2: 정답 (자연스러운 표현)
입력: "가르마 왼쪽으로 살짝 이동"
키워드 매칭: ["가르마", "왼쪽", "이동"]
유사도: 0.80 → 정답! ✅
감정 점수: 0

// 예시 3: 정답 (약어)
입력: "가르마 좌 1cm 이동"
키워드 매칭: ["가르마", "좌" (왼쪽 유사어), "이동"]
유사도: 0.75 → 정답! ✅
감정 점수: 0

// 예시 4: 정답 + 감정 센스 보너스 ⭐
입력: "예리야, 너는 가르마가 오늘 조금 바뀌었네, 원래보다 왼쪽으로 살짝 가르마를 한 것 같아."
키워드 매칭: ["가르마", "왼쪽", "바뀜"]
유사도: 0.85 → 정답! ✅
감정 키워드: ["예리야" (호칭)]
감정 점수: +15

// 예시 5: 정답 + 감정 센스 최고 ⭐⭐⭐
입력: "그리고 오늘은 쉐딩을 조금 더 해서 얼굴이 갸름해져서 예쁘네?"
키워드 매칭: ["쉐딩", "갸름"] (정답 키워드 2)
유사도: 0.80 → 정답! ✅
감정 키워드: ["예쁘네", "얼굴", "갸름해져서"]
감정 점수: +30 ⭐

// 예시 6: 오답 (낮은 유사도)
입력: "옷이 바뀌었어"
키워드 매칭: []
유사도: 0.10 → 오답 ❌
감정 점수: 0

// 예시 7: 오답 (관련 없음)
입력: "아무것도 안 바뀐 것 같은데?"
키워드 매칭: []
유사도: 0.05 → 오답 ❌
감정 점수: 0
```

---

## 🎤 음성/텍스트 하이브리드 시스템 (최종 확정)

### 시스템 구조

```
[게임 시작 - 초기 화면]
  ↓
마이크 권한 요청 팝업
"🎤 예리와 대화하려면 마이크 권한이 필요해요!"
[허용] [거부]
  ↓
YES → 음성 + 텍스트 동시 활성화 ✅
NO → 텍스트만 활성화
```

---

### 2~3턴: 자동 음성 활성화

```
[2턴 시작]
  ↓
마이크 권한 있음?
  ↓
YES:
  ↓
안내 팝업 (2초 표시):
"🎤 음성으로도 답변할 수 있어요!
그냥 말하면 자동으로 인식돼요~"
  ↓
음성 녹음 자동 시작
- continuous: true (연속 인식)
- interimResults: true (중간 결과)
  ↓
하단 UI:
- 텍스트 입력창 (항상 가능)
- 🎤 아이콘 (빨간색 = 녹음 중)
- 클릭 시 On/Off 토글
```

---

### 실시간 분석 플로우

```typescript
// 플레이어 음성 입력
"가르마가 바뀌었어!"
  ↓
[STT 실시간 변환]
- Web Speech API
- 0.5초 이내
  ↓
텍스트: "가르마가 바뀌었어"
  ↓
[EEVE + VectorDB 분석]
- 비동기 호출
- 1초 이내 목표
  ↓
결과:
- 유사도: 0.75
- 정답: ✅
- 감정 점수: 0
  ↓
[예리 즉각 반응]
- TTS: "오~ 거의 다 왔어! 조금만 더!" (0.5초 지연)
- 팝업: 상단 토스트 (즉시)
- 표정: 이모지 변화 (즉시)
  ↓
답변 리스트에 저장
  ↓
플레이어 계속 입력 가능 (연속 대화)
```

**총 지연 시간**: 약 2~3초 (말하기 → 피드백)

---

### 대화형 답변 처리

```typescript
// 자연스러운 대화 스타일
입력 1: "예리야, 너 오늘 뭔가 달라 보이는데?"
  ↓
분석: 대화 시작 (정답 없음)
피드백: "응? 뭐가 달라 보여? 😊"
감정 점수: +5 (호칭 사용)

입력 2: "가르마가 왼쪽으로 바뀐 것 같아"
  ↓
분석: 정답! 유사도 0.85
피드백: "역시 우리 오빠 최고~! 💕"
감정 점수: +10

입력 3: "그리고 오늘 메이크업도 예쁘다!"
  ↓
분석: 추가 관찰 (정답 or 보너스)
피드백: "헤헤 고마워~ 오빠만 봐줘! 💕"
감정 점수: +20 ⭐
```

**핵심**: 단순 키워드 매칭이 아닌 **대화 흐름 이해**

---

## 🎯 음성 시스템 최종 결정

### 1. 우선순위: **필수 기능 (MVP 포함)** 🔥

**이유**:
- ✅ 게임 핵심 컨셉: "예리와 대화"
- ✅ 차별화 요소
- ✅ LLM 활용 극대화
- ✅ 감정 센스 평가 핵심

---

### 2. 활성화 방식: **자동 활성화 (2~3턴 시작 시)** ✅

**이유**:
- ✅ UX 간편 (버튼 찾기 불필요)
- ✅ 음성 사용률 증가
- ✅ 몰입감 유지

**안전장치**:
- 🎤 아이콘으로 상태 표시
- 클릭 시 On/Off 토글 가능
- 마이크 권한 없으면 텍스트만

---

### 3. 분석 방식: **실시간 (말할 때마다 즉시 분석)** ✅

**이유**:
- ✅ "진짜 대화하는 느낌" 구현
- ✅ 즉각 피드백 (몰입감 극대화)
- ✅ 예리 반응 즉시 (TTS + 표정)
- ✅ 상업 게임 표준 (AI Dungeon, Replika)

**최적화**:
- EEVE API 응답: 1초 이내
- 캐싱: 자주 나오는 답변
- 병렬 처리: STT + 분석 동시

---

## 📊 점수 계산 (재확인)

### 최종 점수 공식

```typescript
TurnScore =
  (EmotionalSense × 0.6) +  // 감정 센스 60%
  (Observation × 0.25) +    // 관찰력 25%
  (Reflex × 0.15)           // 순발력 15%

FinalScore =
  (Σ TurnScore × EmotionMultiplier) + ComboBonus

// 엔딩 분기
if (FinalScore >= 80) → "love" 💕
else if (FinalScore >= 50) → "cute_upset" 😤
else → "breakup" 💔
```

---

## ✅ 개발 체크리스트

### Phase 1: 코어 메커니즘 (우선순위 🔥)

- [ ] 2턴 카드 플립 애니메이션
  - [ ] CSS 3D Transform
  - [ ] 회전 애니메이션 (0.7초)
  - [ ] 힌트 버튼 UI
  - [ ] 타이머 정지/재시작 로직
  - [ ] 5초 카운트다운 표시

- [ ] 연속 입력 + 답변 저장
  - [ ] PlayerAnswer 타입 정의
  - [ ] 턴별 답변 리스트 상태
  - [ ] 답변 제출 시 저장 로직

- [ ] 정답 데이터 구조
  - [ ] GameData 타입 정의
  - [ ] AnswerSet 인터페이스
  - [ ] 샘플 데이터 3개 생성

### Phase 2: 음성 시스템

- [ ] 마이크 권한 요청 (게임 시작 시)
- [ ] 2~3턴 자동 녹음 시작
- [ ] continuous: true 설정
- [ ] 실시간 STT 처리
- [ ] 🎤 아이콘 On/Off 토글

### Phase 3: EEVE 통합

- [ ] VectorDB 유사도 API
- [ ] EEVE 감정 분석 API
- [ ] 실시간 피드백 생성
- [ ] 정답 판정 로직

### Phase 4: 인트로 화면

- [ ] 예리 등장 애니메이션
- [ ] Before 이미지 관찰
- [ ] "시작" 버튼

---

## 📝 변경 이력

### v3.0 (2025-11-09) - 최종 확정
- ✅ 2턴 메커니즘: 카드 플립 + 힌트
- ✅ 연속 입력 + 답변 리스트 저장
- ✅ 유사도 기반 정답 판정
- ✅ 음성/텍스트 하이브리드 확정
- ✅ 실시간 분석 방식 확정

### v2.0 (2025-11-08)
- 게임 시간 조정 (3→10→40초 / 3→10→60초)
- 게임 플로우 재설계

### v1.0 (2025-11-07)
- 초기 설계

---

**문서 종료**
