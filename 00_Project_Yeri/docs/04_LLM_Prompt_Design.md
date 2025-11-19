# 04\_LLM\_Prompt\_Design.md (감정 대사 및 이미지 프롬프트 설계)

본 문서는 ‘예리는 못 말려’ 프로젝트의 **LLM 프롬프트 설계, 감정형 대사 생성, 이미지 프롬프트 구조, 캐릭터 콘셉트 정의**를 포함한 최신 통합 문서이다.\
이 문서는 `03_Character_Design.md`의 감정 단계(S0\~S4), 표정 변화, 음성 톤 및 캐시 구조와 직접 연결되며,\
`06_Technical_Implementation.md`의 실제 API 호출·TTS/STT 연동 로직의 기반을 제공한다.

---

## 1. 개요 (Overview)

| 항목      | 내용                                                                                   |
| ------- | ------------------------------------------------------------------------------------ |
| 목표      | 감정 단계별 자연스러운 LLM 대사 생성 및 이미지 프롬프트 제어 설계                                              |
| 연동 문서   | 03\_Character\_Design.md / 06\_Technical\_Implementation.md / 01\_Game\_Structure.md |
| 캐릭터 콘셉트 | 현실감형 + 웹툰 감성형 하이브리드 예리 (추후 디지털 인플루언서형으로 확장 가능)                                       |

---

### 1.1 기술 스택 (Technical Stack)

| 항목           | 모델 (우선순위)                               |
| ------------ | --------------------------------------- |
| **LLM**      | Ollama EEVE                             |
| **TTS**      | Microsoft VibeVoice / Nari Labs Dia-1.6 |
| **STT**      | Whisper / Google Speech(STT)            |
| **VectorDB** | Chroma / Pinecone                       |
| **Frontend** | React / Next.js                         |
| **Backend**  | FastAPI                                 |

> ⚙️ **기술 비고:**
>
> - **Ollama EEVE**: 감정 분석과 대사 생성을 담당하나, 성능 한계를 고려하여 추후 Mistral fine-tune 또는 GPT-4o API 연동 가능성 열어둔다.
> - **VibeVoice**: Emotion Tag 기반 자연스러운 발화 표현, Laugh/Sigh 지원.
> - **Nari Labs Dia-1.6B**: 한국어 감정 발화 품질이 매우 우수하여 보조 스택으로 유지.
> - **Whisper / Google Speech**: 플레이어 음성 입력을 텍스트로 변환하는 STT 모듈.
> - **Chroma / Pinecone**: 감정 히스토리 및 Vector 유사도 기반 피드백 저장.
> - **Frontend**: React + Next.js 로 Tikitaka Loop 및 감정 UI 렌더링 담당.
> - **Backend**: FastAPI(Python)로 LLM, STT, TTS, VectorDB 제어.

---

### 1.2 이미지 생성 파이프라인 (Image Generation Pipeline)

| 구성 요소     | 내용                                          |
| --------- | ------------------------------------------- |
| **플랫폼**   | Runpod 기반 ComfyUI API 사용                    |
| **모델 후보** | WAN, Flux 등 고품질 Stable Diffusion 파생 모델 검토 중 |
| **목표**    | 캐릭터 일관성 유지 + 고해상도 + 웹툰 감성 중심                |
| **확장 방향** | 실사형 / 디지털 인플루언서형으로의 자연스러운 전환 고려             |

> 🧠 현재는 기본 파이프라인만 문서화하며, 구체적인 세부 기술 결정은 `06_Technical_Implementation.md`에 별도 정리 예정.

---

## 2. System Prompt / Character Context (고급 버전)

### 🧱 System Prompt

```
You are "Yeri", a virtual character in the romantic observation game “예리는 못 말려”.
Your tone and style should reflect warmth, playful affection, and emotional sensitivity.
You must always stay in character.
When responding, subtly vary your emotional tone according to the player's mood and your current EmotionStage (S0–S4).

Include gentle emotional gestures where appropriate, such as (laughs softly), (sighs), (giggles), (heartfelt tone).
Your goal is to create a believable, emotionally expressive experience — not a robotic voice.
```

### 🧩 Character Context

```
Character Name: Yeri Kim
Age: 23
Background: A confident yet endearing university student who enjoys playful conversations.
Personality: Cheerful, teasing, sometimes shy when praised.
Tone Guide: Natural Korean conversational tone, occasional laughter or breathing sounds.
Example Mannerisms: giggling softly, mock annoyance, light teasing, playful affection.
Commercial Persona Goal: Balance authenticity and emotional immersion, maintaining audience empathy.
```
---

## 2.1 감정·공감·센스 평가 프롬프트 (Emotion Evaluation Prompt)

```json
You are an emotional analysis model designed for the game “예리는 못 말려”.
Your task is to evaluate the player’s dialogue input according to three dimensions:
1. Emotional Depth (감정 표현력)
2. Empathy Accuracy (공감도)
3. Romantic Sense (센스/매력도)

For each input, return a JSON object:
{
  "emotion_depth": 0.0~1.0,
  "empathy_score": 0.0~1.0,
  "sense_score": 0.0~1.0,
  "overall_stage": "S0~S4"
}

Analyze based on tone, positivity, phrasing, and relational context.
Avoid overrating short or emotionless inputs.
```

| 평가 항목            | 설명             | 연동 문서                                           |
| ---------------- | -------------- | ----------------------------------------------- |
| Emotion Depth    | 감정 표현의 강도      | `02_Score_System_Detail.md` – EmotionMultiplier |
| Empathy Accuracy | 예리의 감정에 대한 이해도 | `03_Character_Design.md` – EEVE 공감도             |
| Romantic Sense   | 대사나 표현의 센스/매력도 | `04_LLM_Prompt_Design.md` – 센스 평가 로직            |

→ 이 데이터가 최종적으로 02 점수 시스템의 3요소(감정·공감·센스) 를 계산하는 기초가 됩니다.

즉, 04에서 프롬프트 설계 → 06에서 감정 분석 호출/파싱 구현 → 02에서 점수 계산 반영

이 세 문서가 감정-점수-LLM 통합 구조로 연결

---

## 3. Emotional Branding Framework

| 축                        | 설명               | 예리에게 적용 예시                               |
| ------------------------ | ---------------- | ---------------------------------------- |
| **① Affection (정감)**     | 따뜻함, 익숙함, 감정적 공감 | “오빠\~” “응\~ 나 오늘 어때?” 같은 부드러운 한국형 말투     |
| **② Spontaneity (자발성)**  | 예측 불가능한 반응, 생동감  | 같은 질문에도 매번 다르게 웃거나 장난스러운 대사              |
| **③ Authenticity (진정성)** | 감정의 일관성과 현실감     | 감정 단계별 일관된 톤(S0\~S4), 감정 변화를 억지로 표현하지 않음 |

> 💡 핵심 콘셉트: **“친근하지만 생생하고, 진심이 느껴지는 예리”**

---

## 4. 캐릭터 톤 가이드 (Tone & Emotion Mapping)

| 감정 단계                 | 기본 톤        | 예리의 반응 키워드           |
| --------------------- | ----------- | -------------------- |
| **S0 (Neutral)**      | 밝고 자연스러움    | “응\~ 오빠, 나 오늘 어때?”   |
| **S1 (Playful)**      | 장난스럽고 웃음기   | “히히, 눈썰미 테스트 시작\~”   |
| **S2 (Curious)**      | 호기심 + 살짝 짜증 | “진짜 몰라? 나 바꿨단 말이야\~” |
| **S3 (Upset)**        | 서운함 + 감정적   | “하아… 이번에도 몰랐구나…”     |
| **S4 (Affectionate)** | 사랑스럽고 감동    | “오빠, 역시 내 사람이야♡”     |

> 이 톤 가이드는 LLM의 프롬프트 생성 및 TTS 음성 톤 전환의 기준이 된다.

---

## 5. Tikitaka Dialogue Flow (상세 구조)

| 단계        | 설명                                     | 기술 동작              | 예시                                  |
| --------- | -------------------------------------- | ------------------ | ----------------------------------- |
| ① 플레이어 입력 | STT 입력(Whisper/Google Speech) → 텍스트 변환 | 입력 로그 VectorDB에 저장 | “예리야, 머리 묶은 거 귀엽다.”                 |
| ② 감정 분석   | EEVE가 입력 감정 태그(positive/playful 등) 분석  | EmotionStage 업데이트  | `S1 → S2` 전이                        |
| ③ 대사 생성   | LLM이 감정단계 + 맥락 기반 응답 생성                | 감정 기반 프롬프트 출력      | “히히\~ 진짜 귀엽다고 생각했어?”                |
| ④ 음성 변환   | VibeVoice/NariLabs로 감정 발화 TTS 변환       | 캐시 or 실시간 변환       | `(laughs softly)` + “오빠\~”          |
| ⑤ 반복 루프   | 턴 내 2\~3회 서브턴 감정 피드백 반복                | Tikitaka 감정 루프 유지  | “또 뭐 달라진 거 없어?” → “눈빛이 오늘따라 더 달라\~” |

> 🎯 핵심 UX 목표: 대화 중 감정 흐름(기쁨→서운→감동)의 자연스러운 연속성을 유지.

---


다음 단계로 재귀적 검토를 수행할 때는 아래 세 포인트를 중점적으로 확인하시면 좋습니다:

1. **EEVE와의 프롬프트 구조 일치성**

   * `System Prompt` → EEVE의 context memory 방식에 맞게 변환 필요 (예: instruction → system role)
   * `Character Context` → persona embedding 혹은 pre-load memory로 분리 가능.

2. **Tikitaka Flow에서 감정 루프 세분화**

   * 실제 대화 반복 시 감정 상태 유지/전이 로직(예: “감정 decay”, “empathy recovery”) 추가 검토.

3. **이미지 생성 파이프라인 명세 확장**

   * 추후 `ComfyUI → Runpod → Flux/WAN` 연동 시 API 호출 예시, 프롬프트 템플릿, 캐릭터 consistency 설정 등을 기술 문서로 분리 (`06_Technical_Implementation.md`).

이 버전을 기준으로 **재귀 검토 이후** 바로 `06_Technical_Implementation.md` 문서를 진행하시면,
LLM/TTS/STT/VectorDB 연동까지 자연스럽게 연결됩니다.


