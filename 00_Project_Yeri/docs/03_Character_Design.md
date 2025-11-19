# 03_Character_Design.md

웹툰 형식의 Before/After 이미지를 프롬프트로 생성할 경우, 변화를 주는 파라미터(예: 헤어스타일, 의상, 표정, 조명 등)를 변수로 정의해 관리하는 것이 좋습니다. 이러한 변수 정의는 Character Design 문서의 '표정 자산 정의' 아래 또는 별도 섹션으로 정리해서 일관된 데이터 구조를 유지.

## 1. 캐릭터 개요 (Persona Overview)

| 항목        | 내용                                          |
| --------- | ------------------------------------------- |
| 이름        | **김예리 (Yeri Kim)**                          |
| 나이        | 23세                                         |
| 성격 키워드    | 밝음, 애교, 예민함, 감정 표현이 풍부함                     |
| 톤앤매너      | 장난스럽지만 진심이 담긴 연인 같은 말투                      |
| 주요 대사 스타일 | 짧은 호흡 + 감정 중심 표현  예) “오빠, 나 진짜 서운할지도 몰라~?” |

> 💡 EEVE의 감정 분석 결과가 예리의 ‘감정 톤 베이스 모델’로 학습됨.

---

## 2. 감정 단계 정의 (Emotion Stage Design)

| 단계 | 감정 상태        | 표정/톤          | 전환 조건 (EEVE 감정 스코어 기반)       |
| -- | ------------ | ------------- | ---------------------------- |
| S0 | Neutral      | 기본 표정, 밝은 톤   | 게임 시작 시 / EEVE 감정 < 0.2      |
| S1 | Playful      | 장난스러움, 미소     | EEVE 감정 0.2~0.39 / 첫 오답 후   |
| S2 | Curious      | 약간 짜증, 눈살 찌푸림 | EEVE 감정 0.4~0.59 / 오답 2회 이상 |
| S3 | Upset        | 울상, 낮은 톤      | EEVE 감정 0.6~0.79 / 감정센스↓    |
| S4 | Affectionate | 눈웃음, 부드러운 미소  | EEVE 감정 ≥ 0.8 / 콤보 발생        |

> S0 → S4로 갈수록 호감/감정 몰입도가 상승하며, 감정 점수(EmotionMultiplier)는 0.8~1.2 범위로 동기화됨.

```python
if EmotionStage == "S4":
    EmotionMultiplier = 1.2
elif EmotionStage == "S3":
    EmotionMultiplier = 0.85
else:
    EmotionMultiplier = 1.0
```

---

## 3. 표정 자산 정의 (Emotion Asset Table)

### 🧩 웹툰 이미지 프롬프트 변수 테이블 (Webtoon Prompt Parameters)

| 변수명 | 설명 | 예시 값 |
|---------|------|-----------|
| hair_color | 헤어 컬러 변화 | brown → blonde |
| outfit_style | 의상 스타일 변화 | school_uniform → casual_dress |
| expression_intensity | 표정 강도 (0~1 스케일) | 0.2 (온화) → 0.8 (활발) |
| accessory | 악세서리 변화 | none → earring |
| lighting_mood | 조명 분위기 | soft_light → dramatic_shadow |
| scene_emotion | 장면 전체 감정 분위기 | playful → affectionate |

> 이 변수들은 LLM 프롬프트에서 Before/After 이미지 생성 시 조정 가능한 핵심 파라미터로 사용됩니다.

| 감정단계 | 파일명                     | 설명           | 사용 시점             |
| ---- | ----------------------- | ------------ | ----------------- |
| S0   | `YERI_S0_default.png`   | 기본 표정        | 오프닝 / 게임 시작       |
| S1   | `YERI_S1_smile.png`     | 장난스러운 미소     | 첫 턴 종료 후 / 1콤보 발생 |
| S2   | `YERI_S2_curiosity.png` | 살짝 짜증, 눈 찡그림 | 2턴 중간 / 오답 2회     |
| S3   | `YERI_S3_sad.png`       | 울상, 실망       | 연속 실패 / 시간 초과     |
| S4   | `YERI_S4_love.png`      | 감동적 웃음 / 눈웃음 | 최종 성공 / 콤보 2회 이상  |

> 각 PNG 파일은 React에서 Sprite 기반으로 로드될 수 있으며, 전환은 Fade-In-Out 방식 또는 Cut 방식 모두 가능.

---

## 4. 표정 전환 방식 (Transition & Easing)

예리의 표정 전환은 다음 두 가지 방법 중 선택 가능하다.

### 🅰 Cut 전환 방식 (단순 전환)

- 예: `YERI_S1_smile.png → YERI_S3_sad.png`
- 장점: 단순하고 가벼움 (MVP 구현에 적합)
- 단점: 감정 전환이 순간적으로 보여 몰입감 다소 약함

### 🅱 Fade 전환 방식 (권장)

- 두 이미지를 0.3~0.5초 동안 교차 페이드 처리.
- CSS / React 기준 예시:
  ```css
  transition: opacity 0.4s ease-in-out;
  ```
- 장점: 감정 변화의 여운을 표현 가능 (울상→웃음 자연 전환)
- 단점: 렌더링 비용이 소폭 증가하지만 감정 연출 효과는 큼.

> 🧠 추천: MVP 단계에서는 **Cut 방식**, Beta 이후에는 **Fade + Easing 방식**으로 확장.

---

## 5. 표정 변화 트리거 매핑 (Expression Trigger Map)

| 트리거     | 조건             | 전환 대상   | 관련 점수 로직               |
| ------- | -------------- | ------- | ---------------------- |
| 관찰 실패   | 정답률 < 40%      | S1 → S2 | 관찰력 점수 -10%            |
| 시간 초과   | 30초 초과         | S3      | 순발력 점수 -5%             |
| 콤보 발생   | 2콤보 이상         | S4      | 감정센스 +10%              |
| 감정센스 상승 | EEVE 공감도 ≥ 0.8 | S4      | EmotionMultiplier +0.1 |
| 감정센스 하락 | EEVE 공감도 < 0.4 | S3      | EmotionMultiplier -0.1 |

> 트리거는 React에서 `useEffect()`를 통해 실시간 감시. 예: 감정 점수 변화 → setEmotionStage(S4) → 표정 전환.

---

## 6. 음성 톤 및 대사 캐싱 구조 (TTS Tone + Cache System)

| 감정단계 | 톤        | 기본 예시 대사               | 캐시 파일                 |
| ---- | -------- | ---------------------- | --------------------- |
| S0   | 밝고 자연스러움 | “오빠, 나 오늘 예뻐?”         | `S0_neutral.mp3`      |
| S1   | 장난스러움    | “에이~ 나 뭐 바뀐 거 없겠어?”   | `S1_playful.mp3`      |
| S2   | 살짝 짜증    | “진짜 몰라? 나 진짜 바꿨단 말이야!” | `S2_curious.mp3`      |
| S3   | 서운함      | “오빠... 나 실망할지도 몰라...”  | `S3_upset.mp3`        |
| S4   | 감동적      | “오빠, 역시 내 사람이야♡”       | `S4_affectionate.mp3` |

### 🔧 캐싱 전략

- **Base Cache:** S0~S4의 대표 맨트 5종을 mp3로 미리 어셋화 (로딩 속도 개선)
- **Dynamic TTS:** 게임 중 특정 순간에 LLM이 생성한 즉흥 대사를 TTS로 변환 후 임시 캐싱
  ```python
  cache['S4_dynamic'] = tts("오늘은 왠지 오빠가 더 멋져보여♡")
  ```
- LLM 생성 비율: 70% 캐시 음성 + 30% 실시간 음성 (감정 다양성 확보)

---

### 🎙️ 감정별 대사 풀 (Voice Line Pool)

| 감정 단계 | 톤 | 예시 대사 | 캐시 여부 | 가중치 | 비고 |
|------------|----|------------|------------|--------|------|
| S0 | 기본/밝음 | “오빠, 나 오늘 예뻐?” | ✅ | 0.4 | 오프닝 대사 |
| S0 | 기본/밝음 | “응~ 나 기분 좋아 보여?” | ✅ | 0.3 | 변형 인트로 |
| S1 | 장난스러움 | “에이~ 나 뭐 바뀐 거 없겠어?” | ✅ | 0.4 | 캐시 기본 대사 |
| S1 | 장난스러움 | “히히, 눈썰미 테스트 시작이야~” | ✅ | 0.3 | 변형형 |
| S1 | 장난스러움 | “아직도 몰라? 나 삐질지도 몰라~” | ❌ | 0.3 | LLM 변형형 |
| S2 | 호기심+짜증 | “진짜 몰라? 나 바꿨다니까!” | ✅ | 0.5 | 감정 중간 |
| S3 | 서운함 | “하아... 이번에도 몰라?” | ✅ | 0.5 | 감정 하락형 |
| S4 | 애정형 | “오빠, 역시 내 사람이야♡” | ✅ | 0.5 | 감정 상승형 |

> ✅ 캐시 대사: mp3 사전 로드  
> ❌ 실시간 LLM 변형 대사: TTS on-demand 변환  
> 🎲 `random.choice()`로 가중치 기반 랜덤 선택 가능

---

## 7. 표정–TTS 동기화 규칙 (Timing Synchronization)

| 단계      | 표정 전환 시점     | TTS 재생 시점    | 비고                 |
| ------- | ------------ | ------------ | ------------------ |
| S0 → S1 | 대사 시작 0.2초 전 | 전환 직후 TTS 시작 | 장난스러운 첫 대사 타이밍 맞춤  |
| S2 → S3 | 감정센스↓ 판정 직후  | 0.3초 지연 후    | 울상 + 낮은 톤 자연스러움 확보 |
| S3 → S4 | 콤보 성공 직후     | 전환 후 즉시 TTS  | 감동 연출, 타이밍 겹치게 설정  |

> ⏱ 규칙 요약: **표정 전환 → 0.2~0.3초 후 TTS 시작**이 가장 자연스럽게 느껴짐.

---

## 8. 실시간 반응 구조 (Implementation Sketch)

```jsx
// React 예시
useEffect(() => {
  if (emotionScore >= 0.8) setEmotionStage('S4');
  else if (emotionScore < 0.4) setEmotionStage('S3');
}, [emotionScore]);

useEffect(() => {
  setCurrentImage(`/assets/${emotionStage}.png`);
  playTTS(emotionStage);
}, [emotionStage]);
```

> 비동기 TTS 호출 시 약간의 지연(0.5초)을 두어 자연스러운 전환 구현.

---

## 9. 향후 확장 계획 (Future Extension)

1. **AI Love Coach Mode:**\
   S4 상태에서 LLM이 플레이어 감정 표현을 평가 후 피드백.
2. **Voice Dating Mode:**\
   STT 감정 분석 확장 → 실시간 반응형 대사 생성.
3. **감정 히스토리 메모리:**\
   VectorDB에 플레이어 감정 패턴 저장 → 세션 지속 감정 일관성.

---

## 11. 웹툰 이미지 프롬프트 변수 확장 (Prompt Variable Mapping)

본 섹션은 현재 웹툰 스타일 이미지를 생성하기 위한 프롬프트 변수들을 정의하며, 향후 **실사형 캐릭터 또는 디지털 인플루언서 확장**까지 고려한 범용 구조로 설계한다.

| 카테고리 | 변수명 | 설명 | 예시값 | 난이도 | 확장성 |
|-----------|---------|------|---------|----------|---------|
| 헤어 | hair_color, hair_style | 색상 및 스타일 | brown → blonde, long → ponytail | Easy | ✅ 실사형 확장 시 헤어 텍스처까지 제어 |
| 의상 | outfit_color, outfit_type | 색상 및 형태 | pink blouse → white dress | Easy | ✅ 브랜드 협업 요소로 확장 가능 |
| 악세서리 | accessory_type, accessory_color | 귀걸이·가방 등 | small gold earrings → silver necklace | Easy | ✅ 제품 광고 연동 가능 |
| 메이크업 | lip_color, blush_tone, highlight_level | 립, 블러셔, 하이라이트 | red06 → red07, medium → high | Hard | ✅ 화장품 브랜드 연동 가능 |
| 조명 | lighting_tone, light_intensity | 조명 색상과 세기 | warm → cool, low → high | Medium | ✅ 촬영 톤 / 분위기 연출 제어 |
| 표정 | expression_intensity, gaze_direction | 감정 강도 및 시선 | 0.3 → 0.7, left → front | Hard | ✅ 감정형 AI 연동 시 연속 감정 표현 가능 |

> 🔧 위 변수들은 04_LLM_Prompt_Design.md에서 프롬프트 템플릿 생성 시 직접 호출될 수 있으며, 난이도(Easy/Hard)는 게임 모드 선택과 동기화된다.

---

## 10. 연계 문서

- **02_Score_System_Detail.md:** 감정 단계별 점수 반영 로직.
- **04_LLM_Prompt_Design.md:** 감정·대사 생성 프롬프트 구조.
- **05_UI_UX_Design.md:** 표정 애니메이션 및 상단 타임라인 연출.
- **06_Technical_Implementation.md:** React + TTS/STT + EEVE 실시간 구조.

