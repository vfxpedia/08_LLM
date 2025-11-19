# 06_Technical_Implementation.md

(기술 아키텍처 · EEVE · 음성/이미지 · VectorDB 연동 명세)

본 문서는 ‘예리는 못 말려’ 프로젝트의 **기술 아키텍처 및 구현 명세**를 정의한다.
특히 다음 네 가지 축을 중심으로 설계된다.

1. **LLM (Ollama EEVE)** 기반 감정·공감·센스 분석 및 예리 대사 생성
2. **TTS/STT** 기반 실시간 음성 인터랙션
3. **이미지 파이프라인 (Runpod + ComfyUI + Flux/WAN)**
4. **VectorDB** 기반 감정 히스토리 및 점수 연동

`01_Game_Structure.md`, `02_Score_System_Detail.md`, `03_Character_Design.md`, `04_LLM_Prompt_Design.md`와 직접 연결된다.

---

## 1. 개요 (Overview)

| 항목    | 내용                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------- |
| 목표    | 게임 클라이언트(React)와 백엔드(FastAPI), EEVE, TTS/STT, VectorDB, 이미지 모듈을 하나의 통합 파이프라인으로 구현하기 위한 기술 명세        |
| 실행 환경 | Runpod (LLM/이미지/백엔드), 외부 TTS/STT API, 프론트엔드는 별도 호스팅(예: Vercel/Netlify) 가능                           |
| 연동 문서 | 00_Masterbook, 01_Game_Structure, 02_Score_System_Detail, 03_Character_Design, 04_LLM_Prompt_Design |
| 타겟 단계 | MVP → Prototype 단계까지를 우선 지원, 이후 Beta에서 최적화/확장                                                       |

---

## 2. 전체 아키텍처 (High-level Architecture)

### 2.1 구성 요소

| 레이어            | 컴포넌트                          | 역할                                                        |
| -------------- | ----------------------------- | --------------------------------------------------------- |
| Frontend       | React / Next.js 클라이언트         | 게임 화면, 타이머, 예리 표정/대사 UI, 음성 녹음, 결과 화면 표현                  |
| Backend API    | FastAPI 서버                    | 세션 관리, 점수 계산, EEVE 호출, STT/TTS 호출, VectorDB 연동, 이미지 메타 관리 |
| LLM Engine     | Ollama EEVE                   | 예리 대사 생성, 감정·공감·센스 평가 (04 문서의 프롬프트 구조 사용)                 |
| TTS Engine     | VibeVoice / Nari Labs Dia-1.6 | 예리 음성 합성 (laugh/sigh 등 감정 표시 포함)                          |
| STT Engine     | Whisper / Google Speech       | 플레이어 음성 → 텍스트 변환                                          |
| VectorDB       | Chroma / Pinecone             | 감정 히스토리, 플레이어별 감정 패턴, 대화 feature 저장                       |
| Image Pipeline | Runpod + ComfyUI + Flux/WAN   | 예리 Before/After 웹툰 이미지 생성 및 캐릭터 일관성 유지                    |

### 2.2 통신 흐름 개요

1. 프론트엔드가 **게임 세션 생성 요청** → FastAPI `/session/start`
2. FastAPI가 **해당 세션의 이미지 페어(예리 before/after)** 및 초기 상태(S0)를 반환
3. 각 턴(3s/10s/30s)마다

   * 플레이어 입력(텍스트 or 음성) → FastAPI `/session/answer`
   * 음성일 경우 STT → 텍스트
   * 텍스트를 EEVE에 전달 → 감정·공감·센스 분석 + 예리 응답 생성
   * 결과를 점수 시스템(02 문서)과 캐릭터 상태(03 문서)로 반영
   * 예리 응답을 TTS로 변환 → 프론트에 음성 URL/바이너리 전달
4. 3턴 종료 후 FinalScore 계산 → 엔딩 타입 반환 → 결과 화면 및 Retry 옵션

---

## 3. 실행 환경 및 배포 구조

### 3.1 Runpod 환경

* FastAPI + Ollama EEVE + ComfyUI를 **동일 Runpod 인스턴스** 또는 **분리된 서비스**로 구성 가능
* 권장 구조:

  * Pod A: FastAPI + EEVE (CPU/GPU 공유)
  * Pod B: ComfyUI + 이미지 모델 (Flux/WAN 등, GPU 집중)
* 내부 네트워크 통신: Pod 간 HTTP(gRPC 가능성은 후순위)

### 3.2 개발/운영 환경 분리

| 환경      | 목적             | 특징               |
| ------- | -------------- | ---------------- |
| Dev     | 기능 개발, 프롬프트 튜닝 | 작은 사이즈 모델, 낮은 스펙 |
| Staging | 프리뷰/테스트        | 실제와 유사한 모델/스펙    |
| Prod    | 실제 서비스         | 안정성, 모니터링, 로깅 강화 |

환경별로 `.env` 혹은 Runpod ENV 변수로 설정 관리:

```bash
EEVE_ENDPOINT=http://eeve:11434
TTS_ENDPOINT=https://api.vibevoice...
STT_ENDPOINT=https://api.whisper...
VECTORDB_URL=...
```

---

## 4. 백엔드 모듈 구조 (FastAPI)

### 4.1 디렉터리 구조 예시

```text
app/
  main.py
  api/
    session.py        # 세션/턴/답변/Retry API
    debug.py          # 디버그용 (옵션)
  services/
    eeve_client.py    # LLM 호출 (대사/감정 평가)
    tts_client.py     # TTS 호출
    stt_client.py     # STT 호출
    vector_client.py  # VectorDB 연동
    image_client.py   # 이미지 메타/ComfyUI 연동
    scoring.py        # 점수 계산 (02 문서 반영)
    emotion_engine.py # EmotionStage(S0~S4) 및 Tikitaka Flow 로직
    cache.py          # 음성/대사 캐시
  models/
    session.py        # Pydantic 모델 (Session, Turn, Answer 등)
    emotion.py        # EmotionScore, EmotionStage
    score.py          # ScoreSnapshot, FinalScore
  core/
    config.py         # 설정/환경변수 로딩
    logger.py         # 로깅
```

---

## 5. 데이터 모델 설계 (핵심 구조)

### 5.1 세션 및 턴 상태

```python
class EmotionScore(BaseModel):
    emotion_depth: float  # 0.0 ~ 1.0
    empathy_score: float  # 0.0 ~ 1.0
    sense_score: float    # 0.0 ~ 1.0
    overall_stage: str    # "S0" ~ "S4"


class TurnState(BaseModel):
    turn_index: int              # 1, 2, 3
    time_limit_sec: int          # 3, 10, 30
    remaining_sec: int
    answers: list[str]           # 플레이어 답변 텍스트 리스트
    emotion_scores: list[EmotionScore]
    combo_count: int             # 이 턴에서의 최대 콤보
    is_finished: bool


class SessionState(BaseModel):
    session_id: str
    player_id: str | None
    current_turn: int
    turns: list[TurnState]
    emotion_stage: str           # "S0" ~ "S4"
    final_score: float | None
    status: str                  # "playing" / "finished" / "retrying"
    image_pair_id: str           # 사용 중인 예리 Before/After 세트 ID
```

### 5.2 점수 구조 (02 문서 반영)

```python
class ScoreSnapshot(BaseModel):
    turn_index: int
    emotional_sense: float  # 감정센스 (0~100)
    observation: float      # 관찰력 (0~100)
    reflex: float           # 순발력 (0~100)
    emotion_multiplier: float  # 0.8 ~ 1.2
    combo_bonus: float
    turn_score: float       # 최종 TurnScore
```

---

## 6. API 설계 (REST 엔드포인트)

### 6.1 세션 관리

1. **POST `/session/start`**

* 입력: `{ "player_id": "optional" }`
* 동작:

  * 새 세션 생성
  * 예리 이미지 페어 할당 (`image_pair_id`)
  * EmotionStage = S0 초기화
* 출력:

  ```json
  {
    "session_id": "abc123",
    "image_pair": {
      "before_url": "...",
      "after_url": "..."
    },
    "current_turn": 1,
    "emotion_stage": "S0"
  }
  ```

2. **POST `/session/answer`**

* 입력:

  ```json
  {
    "session_id": "abc123",
    "turn_index": 2,
    "input_type": "text" | "audio",
    "content": "string or audio_base64"
  }
  ```

* 동작:

  1. `input_type == "audio"` → `stt_client` 호출 → 텍스트 변환
  2. 텍스트를 `eeve_client`에 두 번 활용:

     * (a) **감정·공감·센스 평가 프롬프트** (04 문서 2.1) 호출 → EmotionScore
     * (b) **예리 대사 생성 프롬프트** (System Prompt + Character Context + Tikitaka 맥락) → Yeri reply
  3. `scoring.py`에서 감정센스/관찰력/순발력 반영(02 문서 공식)
  4. EmotionStage(S0~S4) 업데이트 (03 문서 감정 단계 기준)
  5. `tts_client`를 통해 예리 응답 음성 생성 (캐시 우선, 없으면 실시간 생성)

* 출력:

  ```json
  {
    "yeri_text": "히히~ 진짜 귀엽다고 생각했어?",
    "yeri_voice_url": ".../tts/s1_playful_02.mp3",
    "emotion_stage": "S2",
    "updated_scores": {
      "turn_score": 24.5,
      "combo_count": 2
    },
    "remaining_sec": 18
  }
  ```

3. **POST `/session/finish`**

* 3턴 종료, 혹은 타이머 종료 시 호출
* 동작:

  * 모든 TurnScore 합산
  * EmotionMultiplier 적용 및 ComboBonus 반영 (02 문서)
  * 엔딩 타입 결정 (01 문서 엔딩 분기)
* 출력:

  ```json
  {
    "final_score": 78,
    "ending_type": "cute_upset",
    "yeri_ending_text": "흠... 그래도 오늘은 봐줄게~",
    "can_retry": true
  }
  ```

4. **POST `/session/retry`**

* 동일 이미지 페어로 Retry (새 세션 or 동일 세션 내 연장)
* 기획안:

  * `Retry`는 **새 세션 ID**로 생성하되, `image_pair_id`를 동일하게 유지
  * 예리 대사: “오빠.. 마지막 기회를 더 줄까? 진짜 마지막이다~”

---

## 7. EEVE 연동 (LLM 클라이언트)

### 7.1 eeve_client 기본 구조

```python
def generate_yeri_reply(system_prompt: str, character_context: str,
                        tikitaka_context: dict, player_input: str,
                        emotion_stage: str) -> str:
    # 04_LLM_Prompt_Design System Prompt + Character Context 사용
    # Tikitaka Flow 상태(이전 대사, 턴, 서브턴)도 함께 전달
    ...

def evaluate_player_emotion(player_input: str) -> EmotionScore:
    # 04 문서의 2.1 감정·공감·센스 평가 프롬프트 템플릿 사용
    # EEVE 출력 JSON 파싱 → EmotionScore로 맵핑
    ...
```

* Timeouts, 재시도 전략:

  * 기본 타임아웃: 5~10초
  * 실패 시: 캐시된 기본 대사(Voice Line Pool)로 fallback

---

## 8. TTS / STT / 캐시 구조

### 8.1 TTS (VibeVoice / Nari)

```python
def synthesize_yeri_voice(text: str, emotion_stage: str,
                          cache_key: str | None = None) -> str:
    # 1. 캐시 조회: cache_key가 있고, 이미 mp3가 있다면 → 그대로 반환
    # 2. 없으면 TTS API 호출 → mp3 생성 → 저장 후 URL 반환
    ...
```

* 캐시 전략:

  * **정적 캐시:** 03 문서 Voice Line Pool에 있는 대표 대사들은 미리 생성하여 `assets/tts/`에 저장
  * **동적 캐시:** 플레이 도중 LLM이 만든 문장을 TTS로 변환 → `tmp/tts/`에 저장, TTL(예: 24시간) 후 삭제

### 8.2 STT (Whisper / Google Speech)

```python
def transcribe_audio(audio_bytes: bytes) -> str:
    # Whisper 로컬 or Google Speech API 호출
    # 욕설/잡음 필터링은 추후 옵션
    ...
```

---

## 9. Emotion Engine & Tikitaka 구현

### 9.1 EmotionStage 업데이트 로직

```python
def update_emotion_stage(prev_stage: str, emotion_score: EmotionScore) -> str:
    # 03_Character_Design.md의 스코어 구간 기준
    v = emotion_score.empathy_score  # 예: 공감도를 기준으로 사용
    if v < 0.2:
        return "S0"
    elif v < 0.4:
        return "S1"
    elif v < 0.6:
        return "S2"
    elif v < 0.8:
        return "S3"
    else:
        return "S4"
```

### 9.2 Tikitaka 서브턴 구조

* 3턴(30초) 동안 최대 2~3회 `answer` 요청 허용
* 각 서브턴마다:

  * EmotionScore 누적
  * 콤보/감정센스에 따라 EmotionStage 업데이트
  * 예리 대사/음성 재생
* 타임아웃 시:

  * 마지막 EmotionStage 기준으로 엔딩 직전 대사 출력

---

## 10. VectorDB 연동 (Chroma / Pinecone)

### 10.1 저장 구조

```python
# pseudo-document
{
  "player_id": "user123",
  "session_id": "abc123",
  "turn_index": 3,
  "player_text": "오늘은 천사가 내려온 줄 알았어",
  "emotion_depth": 0.92,
  "empathy_score": 0.88,
  "sense_score": 0.9,
  "overall_stage": "S4",
  "timestamp": "..."
}
```

* 임베딩 생성: `player_text` + 일부 메타를 임베딩하여 VectorDB에 저장
* 활용:

  * 향후 세션에서 유사한 발화를 했을 때, 과거 감정 패턴 참고
  * “AI Love Coach Mode”에서 피드백 메시지 생성용

---

## 11. 이미지 파이프라인 구현 (MVP 관점)

### 11.1 MVP 전략

* **런타임 이미지 생성 X**, 게임에서 사용하는 예리 Before/After 세트는 **사전 생성 + CDN/스토리지에 저장**
* FastAPI에서는 단순히 `image_pair_id → URL` 매핑만 관리

```python
IMAGE_PAIRS = {
  "set01": {
    "before_url": "/static/yeri/set01_before.png",
    "after_url":  "/static/yeri/set01_after.png"
  },
  ...
}
```

* 추후 확장:

  * ComfyUI API를 통해 “새 세트 생성” 버튼 or 관리 툴에서 온디맨드 생성
  * 이 기능은 운영/어드민 백오피스에서 사용하고, 게임 런타임에서는 계속 캐시된 이미지만 사용

---

## 12. 로깅 · 모니터링 · 에러 처리

* 모든 주요 이벤트 로그:

  * 세션 시작/종료
  * EEVE 호출 성공/실패
  * TTS/STT 호출 성공/실패
  * VectorDB 저장/조회 오류
* 기본 구조:

  ```python
  logger.info("session_start", extra={...})
  logger.error("eeve_timeout", extra={...})
  ```
* 모니터링 도구:

  * 초기: 단순 로그 + Runpod 대시보드
  * 확장: Sentry / Prometheus + Grafana 고려

---

## 13. 향후 확장 계획 (기술 관점)

1. **AI Love Coach Mode**

   * EEVE 평가 결과를 기반으로 “연애 코칭 피드백” 전용 endpoint 추가
   * `/coach/feedback` 등

2. **Voice Dating Mode**

   * 세션을 “시간 기반”이 아닌 “대화 턴 기반”으로 확장
   * WebSocket 기반 실시간 대화 고려

3. **멀티 캐릭터 지원**

   * Yeri 외 캐릭터 추가 시, 캐릭터별 System Prompt/Voice Profile 분리

---

## ✅ 검증 체크리스트 (06 문서용)

* [ ] FastAPI 모듈 구조가 실제 개발 환경에서 구현 가능한 수준으로 세분화되었는가?
* [ ] EEVE 감정·공감·센스 평가 프롬프트(04 문서 2.1)가 정확히 호출/파싱되도록 설계되어 있는가?
* [ ] 점수 계산 로직이 `02_Score_System_Detail.md`의 공식과 1:1로 일치하는가?
* [ ] EmotionStage(S0~S4) 업데이트 로직이 `03_Character_Design.md`의 정의와 충돌하지 않는가?
* [ ] Tikitaka 서브턴 구조가 3턴(3·10·30초) 타임라인과 자연스럽게 연동되는가?
* [ ] TTS/STT가 실패했을 때 캐시된 기본 대사/텍스트로 안전하게 fallback 가능한가?
* [ ] 이미지 파이프라인이 현재는 “사전 생성 + 정적 서빙” 기준으로 구현 가능하게 설계되어 있는가?

---

이 버전은 바로 개발자가 잡고 코드를 짜기 시작할 수 있는 수준으로 작성했습니다.
다음 단계로는:

* 이 06 문서 중에서 **먼저 구현하고 싶은 파트(예: 세션 API, EEVE 연동, TTS/STT 중 하나)** 를 정해서
* 거기서 사용할 구체적인 **예시 JSON, 테스트 케이스, 혹은 간단한 Pseudo-code**를 더 파고들 수 있습니다.

어느 부분부터 실제 코드 레벨로 더 파고들고 싶은지 말해주면, 거기에 맞춰 “개발자용 상세 설계”도 이어서 잡아볼게요.
