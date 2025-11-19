# 07_Production_Pipeline.md (개발 착수 WBS)

## 1. 프로젝트 폴더 트리 (초기 세팅 구조)

```
00_Project_Yeri/
│
├─ backend/
│   ├─ app/
│   │   ├─ main.py
│   │   ├─ api/
│   │   │   ├─ session.py
│   │   │   ├─ healthcheck.py
│   │   ├─ services/
│   │   │   ├─ eeve_client.py
│   │   │   ├─ tts_client.py
│   │   │   ├─ stt_client.py
│   │   │   ├─ vector_client.py
│   │   │   └─ scoring.py
│   │   ├─ models/
│   │   │   ├─ emotion.py
│   │   │   ├─ score.py
│   │   │   └─ session.py
│   │   ├─ core/
│   │   │   ├─ config.py
│   │   │   └─ logger.py
│   │   └─ tests/
│   │       ├─ test_session_api.py
│   │       └─ test_eeve_client.py
│   ├─ .env.example
│   ├─ requirements.txt
│   └─ README.md
│
├─ frontend/
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ assets/
│   │   │   ├─ yeri/
│   │   │   │   ├─ set01_before.png
│   │   │   │   ├─ set01_after.png
│   │   │   │   ├─ test01_before.png
│   │   │   │   └─ test01_after.png
│   │   ├─ utils/
│   │   └─ styles/
│   ├─ package.json
│   └─ README.md
│
├─ docs/
│   ├─ 00_yeri_project_masterbook.md
│   ├─ 01_game_structure.md
│   ├─ 02_score_system_detail.md
│   ├─ 03_character_design.md
│   ├─ 04_llm_prompt_design.md
│   ├─ 05_UI_UX_Design.md (작성 예정)
│   ├─ 06_Technical_Implementation.md
│   └─ 07_Production_Pipeline.md (현재 문서)
│
├─ .gitignore
└─ README.md
```

> 💡 **폴더 관리 원칙**
>
> * `docs/` 폴더는 설계 문서 버전별 관리 (현재 Git에 포함)
> * `backend/` 와 `frontend/`는 완전히 분리된 환경으로 관리
> * 이미지 자산(`assets/yeri/`)은 프론트엔드 기준 관리

---

## 2. 환경 세팅 (Anaconda + FastAPI + React)

### 2.1 Python 환경 구성 (Backend)

```bash
conda create -n yeri_backend python=3.10
conda activate yeri_backend
pip install fastapi uvicorn[standard] requests pydantic python-dotenv
pip install pytest
```

### 2.2 React 환경 구성 (Frontend)

```bash
cd frontend
npx create-next-app@latest .
npm install axios react-router-dom
npm install --save-dev prettier eslint
```

### 2.3 환경변수 파일 예시 (`backend/.env.example`)

```
EEVE_ENDPOINT=http://localhost:11434
TTS_ENDPOINT=https://api.vibevoice.ai
STT_ENDPOINT=https://api.openai.com/v1/audio
VECTORDB_URL=http://localhost:8001
OPENAI_API_KEY=sk-xxxx
NARI_API_KEY=xxxx
```

---

## 3. Git & Branch 전략

| 브랜치명                      | 역할                                         | 병합 규칙              |
| ------------------------- | ------------------------------------------ | ------------------ |
| `main`                    | 최종 안정화 버전                                  | 리뷰 후 병합            |
| `dev`                     | 통합 개발                                      | 각 feature 병합용      |
| `feature/fastapi-session` | `/session/start`, `/session/answer` API 구현 | 단위 테스트 통과 후 dev 병합 |
| `feature/eeve-llm`        | EEVE 감정 평가/대사 생성 모듈                        | 로컬 mock 테스트        |
| `feature/tts-stt`         | TTS/STT 연동                                 | 외부 API 연결 전 검증     |
| `feature/vector-db`       | 감정 히스토리 저장/조회                              | 통합 이후 병합           |
| `feature/ui-client`       | React 인터페이스, 이미지 표시, 타이머                   | Backend 안정 후 진행    |

> ⚙️ 병합 전 반드시 `pytest` 실행
>
> ```
> pytest app/tests -v
> ```

---

## 4. 개발 단계별 WBS (Task-by-Task)

| 단계                                      | 주요 Task                                                               | 목표               | 산출물                              |
| --------------------------------------- | --------------------------------------------------------------------- | ---------------- | -------------------------------- |
| **1단계: Backend 뼈대 구축**                  | - FastAPI 실행<br>- `/session/start` 엔드포인트 작성<br>- `SessionState` 모델 구현 | 게임 세션 생성         | FastAPI 로컬 서버                    |
| **2단계: EEVE 연동**                        | - 감정 평가 프롬프트(04 문서 2.1) 호출<br>- 대사 생성 프롬프트(System Prompt) 호출          | 감정 점수+예리 대사 생성   | `eeve_client.py`                 |
| **3단계: 점수 계산 로직 연동**                    | - `scoring.py` 작성<br>- EmotionMultiplier/Combo 반영                     | 점수 시스템(02 문서) 완성 | 점수 계산 결과 JSON                    |
| **4단계: TTS/STT 연동**                     | - Whisper or Google Speech 입력 처리<br>- VibeVoice/NariLabs TTS 출력       | 음성 입출력 루프 완성     | `tts_client.py`, `stt_client.py` |
| **5단계: Emotion Engine + Tikitaka Flow** | - 감정 단계 업데이트(S0~S4)<br>- 감정 루프 유지                                     | 실시간 감정 전환        | `emotion_engine.py`              |
| **6단계: VectorDB 연동**                    | - 감정 기록 저장 및 조회                                                       | 히스토리 기능          | `vector_client.py`               |
| **7단계: 이미지 파이프라인 적용**                   | - 정적 이미지 관리(CDN)<br>- `image_pair_id` 매핑                              | 이미지 연동 완성        | `/assets/yeri/` 구조               |
| **8단계: Frontend UI 기본화면**               | - 예리 이미지/타이머/대사 UI<br>- API 연동                                        | MVP 화면 구성        | React 화면                         |
| **9단계: 감정 루프 & 애니메이션**                  | - 05_UI_UX_Design 기반 타임라인/페이드 전환                                      | 몰입도 개선           | UX 연출                            |
| **10단계: QA 및 Beta 준비**                  | - 전체 E2E 테스트<br>- API Key, .env 보안 검증                                 | 안정화              | Beta 버전 빌드                       |

---

## 5. 자산 관리 (이미지/음성)

| 자산 유형            | 경로                             | 관리 방식                          |
| ---------------- | ------------------------------ | ------------------------------ |
| Before/After 이미지 | `/frontend/src/assets/yeri/`   | 정적 파일 (set##_before/after.png) |
| 캐릭터 음성 파일        | `/frontend/public/audio/yeri/` | 캐시 음성(mp3) 또는 API 호출 시 동적 생성   |
| 임시 음성 캐시         | `/backend/tmp/tts/`            | 24시간 TTL 후 삭제                  |
| 문서 및 버전          | `/docs/`                       | Notion/Quip/Git 연동 가능          |

---

## 6. 보안 및 API 키 관리

* `.env`는 `.gitignore`에 반드시 포함
* `config.py`에서 환경변수 로딩 예시:

```python
from dotenv import load_dotenv
import os

load_dotenv()
EEVE_ENDPOINT = os.getenv("EEVE_ENDPOINT")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
```

* GitHub Secrets을 사용하면 배포 시 안전하게 키를 전달 가능

---

## 7. QA 및 테스트 플로우

| 테스트 유형     | 도구                       | 목적             |
| ---------- | ------------------------ | -------------- |
| 단위 테스트     | pytest                   | 각 API 및 로직 검증  |
| 통합 테스트     | Postman / Thunder Client | 전체 세션 흐름 확인    |
| 프론트 연동 테스트 | React + Mock Backend     | 시각적/UX 검증      |
| 리그레션 테스트   | GitHub Actions (선택)      | 브랜치 병합 시 자동 검사 |

---

## 8. 향후 확장

1. **WebSocket 기반 실시간 감정 피드백 (Beta 이후)**
2. **AI Love Coach Mode** – VectorDB 피드백 활용
3. **Yeri 인플루언서 확장 버전** – SNS용 자동 콘텐츠 생성
4. **모듈형 SDK 배포 (Eeveverse Toolkit)** – 다른 캐릭터로 확장 가능

---

이제 이 문서가 **실제 개발의 출발점**이 됩니다.
다음 단계는 다음 중 하나를 선택해 진행하면 됩니다 👇

1. 🔧 **“1단계: FastAPI 백엔드 뼈대 구축”** – main.py, `/session/start` 구조 작성
2. 📂 **“로컬 Anaconda 환경 세팅”** – env, requirements.txt 생성
3. 🧱 **“브랜치 초기화 및 GitHub 연결”**

어느 항목부터 실제 개발 Task로 시작할지 선택해주시면,
제가 바로 **코드 템플릿 + 구체적 실행 명령어**까지 제공드리겠습니다.
