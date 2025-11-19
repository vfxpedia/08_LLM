# 🔑 API 키 설정 가이드

## ✅ 완료된 작업

모든 노트북 파일에서 API 키가 환경변수로 변경되었습니다:
- ✅ `00_test_02.ipynb` (현재 작업 파일)
- ✅ `00_test_01.ipynb`
- ✅ `00_test.ipynb`

---

## 🔧 설정 방법

### 1. `.env` 파일 확인

`00_Zipfit/.env` 파일에 다음 내용이 있는지 확인하세요:

```env
GH_API_KEY=your_api_key_here
```

### 2. `.gitignore` 확인

`.env` 파일이 Git에 커밋되지 않도록 `.gitignore`에 추가되어 있는지 확인하세요:

```gitignore
# 환경변수 파일
.env
.env.local
.env.*.local
```

### 3. `.env.example` 파일 생성 (선택)

팀원들과 공유할 때를 위해 `.env.example` 파일을 생성하세요:

```env
# GH (경기주택도시공사) API 키
# 공공데이터포털에서 발급받은 API 키를 입력하세요
# https://www.data.go.kr/
GH_API_KEY=your_api_key_here
```

---

## 📦 필수 패키지

```bash
pip install python-dotenv
```

현재 설치 상태: ✅ `python-dotenv==1.1.1` (설치 완료)

---

## 🔍 코드 변경 사항

### Before (보안 취약):
```python
# API 설정
API_KEY = "your_api_key_here"
```

### After (보안 강화):
```python
import os
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드
load_dotenv()

# API 설정 (.env 파일에서 읽기)
API_KEY = os.getenv('GH_API_KEY')
if not API_KEY:
    raise ValueError("⚠️  .env 파일에 GH_API_KEY가 설정되지 않았습니다!")
```

---

## 🚨 주의사항

1. **`.env` 파일을 Git에 커밋하지 마세요!**
   - 개인 API 키가 노출될 수 있습니다.
   - `.gitignore`에 반드시 추가하세요.

2. **`.env.example`은 커밋 가능**
   - 실제 API 키가 없는 템플릿 파일입니다.
   - 팀원들이 참고할 수 있도록 공유하세요.

3. **환경변수가 로드되지 않으면**
   - `.env` 파일 위치 확인 (노트북과 같은 디렉토리)
   - 파일 이름 확인 (`.env` 정확히 입력)
   - `load_dotenv()` 호출 확인

---

## 🧪 테스트

노트북의 첫 번째 셀을 실행하여 API 키가 제대로 로드되는지 확인하세요:

```python
# Cell 2 실행 (00_test_02.ipynb)
# 출력 예시:
# ✅ API 설정 완료!
# 📡 BASE URL: https://api.odcloud.kr/api/15119414/v1
# 🔑 API KEY: your_api_key_here....
# 🌐 사용 엔드포인트: 2025 (최신)
```

---

## 📚 참고

- [python-dotenv 공식 문서](https://pypi.org/project/python-dotenv/)
- [12 Factor App - Config](https://12factor.net/config)

