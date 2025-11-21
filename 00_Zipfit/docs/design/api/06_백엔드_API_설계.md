# 06. 백엔드 API 설계

## 6.1 개요

ZIPFIT의 백엔드 API는 RESTful 방식으로 설계합니다.

**기술 스택**: FastAPI (Python)
- 빠른 성능
- 자동 문서화 (Swagger UI)
- 타입 안전
- 비동기 지원

---

## 6.2 API 엔드포인트 정의

### 6.2.1 챗봇 API

#### POST /api/chat

사용자 질문에 대해 LLM + RAG 답변 생성

**Request**:
```json
{
  "user_id": "user_12345",
  "message": "서울에서 혼자 사는 청년인데, 행복주택 신청할 수 있어?",
  "conversation_history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response**:
```json
{
  "message": "네, 신청 가능합니다. 서울 지역 행복주택 3건을 찾았습니다...",
  "sources": [
    {
      "document_name": "LH_행복주택_공고.pdf",
      "page_number": 3,
      "excerpt": "자격 요건: 만 19~39세...",
      "relevance_score": 0.95
    }
  ],
  "suggested_announcements": ["LH_lease_1", "LH_lease_5"],
  "timestamp": "2025-11-21T10:30:00Z"
}
```

---

### 6.2.2 공고 API

#### GET /api/announcements

공고 목록 조회 (필터링, 정렬, 페이지네이션)

**Query Parameters**:
- provider: LH, SH, GH
- region: 서울, 경기 등
- announcement_type: 행복주택, 국민임대 등
- status: 접수중, 접수마감
- sort_by: deadline, post_date, deposit
- page: 페이지 번호 (default: 1)
- limit: 페이지당 개수 (default: 20)

**Request Example**:
```
GET /api/announcements?provider=LH&region=서울&status=접수중&page=1&limit=10
```

**Response**:
```json
{
  "total": 45,
  "page": 1,
  "limit": 10,
  "announcements": [
    {
      "id": "LH_lease_1",
      "provider": "LH",
      "title": "강남구 역삼동 행복주택",
      "region": "서울특별시",
      "announcement_type": "행복주택",
      "deposit": 1500,
      "monthly_rent": 25,
      "post_date": "2025-11-15",
      "deadline": "2025-12-05",
      "status": "접수중",
      "url": "https://apply.lh.or.kr/..."
    },
    ...
  ]
}
```

#### GET /api/announcements/{id}

특정 공고 상세 정보 조회

**Response**:
```json
{
  "id": "LH_lease_1",
  "provider": "LH",
  "title": "강남구 역삼동 행복주택",
  "region": "서울특별시",
  "announcement_type": "행복주택",
  "deposit": 1500,
  "monthly_rent": 25,
  "area_type": "16㎡, 26㎡",
  "total_units": 320,
  "post_date": "2025-11-15",
  "deadline": "2025-12-05",
  "move_in_date": "2026년 3월 예정",
  "status": "접수중",
  "url": "https://apply.lh.or.kr/...",
  "pdf_url": "https://...",
  "view_count": 12345,
  "detailed_info": {
    "eligibility": ["만 19~39세", "무주택자", "소득 120% 이하"],
    "required_documents": ["주민등록등본", "소득증빙서류", "무주택확인서"],
    "application_process": ["1단계: 서류 준비", "2단계: 온라인 접수", ...]
  }
}
```

---

### 6.2.3 사용자 API

#### POST /api/user/profile

사용자 프로필 생성/업데이트

**Request**:
```json
{
  "user_id": "user_12345",
  "name": "홍길동",
  "age": 28,
  "residence": "서울특별시",
  "residence_duration": 2,
  "marital_status": "single",
  "has_children": false,
  "income": 350
}
```

**Response**:
```json
{
  "user_id": "user_12345",
  "message": "프로필이 저장되었습니다.",
  "timestamp": "2025-11-21T10:30:00Z"
}
```

#### GET /api/user/{user_id}/profile

사용자 프로필 조회

**Response**:
```json
{
  "user_id": "user_12345",
  "name": "홍길동",
  "age": 28,
  ...
}
```

---

### 6.2.4 즐겨찾기 API

#### POST /api/user/favorites

즐겨찾기 추가

**Request**:
```json
{
  "user_id": "user_12345",
  "announcement_id": "LH_lease_1"
}
```

#### DELETE /api/user/favorites/{announcement_id}

즐겨찾기 삭제

#### GET /api/user/{user_id}/favorites

즐겨찾기 목록 조회

**Response**:
```json
{
  "user_id": "user_12345",
  "favorites": [
    {
      "id": "LH_lease_1",
      "title": "강남구 역삼동 행복주택",
      ...
    },
    ...
  ]
}
```

---

### 6.2.5 비교 API

#### POST /api/user/comparison

비교 목록 추가

#### DELETE /api/user/comparison/{announcement_id}

비교 목록 삭제

#### GET /api/user/{user_id}/comparison

비교 목록 조회

---

### 6.2.6 용어 설명 API

#### GET /api/glossary/{term}

용어 설명 조회

**Request Example**:
```
GET /api/glossary/선계약후검증
```

**Response**:
```json
{
  "term": "선계약후검증",
  "definition_easy": "계약을 먼저 하고, 나중에 자격을 확인하는 방식입니다.",
  "definition_full": "...",
  "usage": "...",
  "example": "...",
  "related_terms": ["동호지정", "순번추첨"]
}
```

---

## 6.3 RAG 시스템 구현

### 6.3.1 검색 파이프라인

```python
async def rag_search(query: str, user_profile: dict) -> dict:
    # 1. 질문 임베딩
    query_embedding = embed_text(query)

    # 2. Vector DB 검색
    similar_docs = vector_db.search(
        embedding=query_embedding,
        top_k=5,
        threshold=0.7
    )

    # 3. 프롬프트 구성
    prompt = construct_prompt(
        system_prompt=SYSTEM_PROMPT,
        retrieved_docs=similar_docs,
        user_query=query,
        user_profile=user_profile
    )

    # 4. LLM 호출
    response = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=prompt
    )

    # 5. 응답 후처리
    return process_response(response, similar_docs)
```

### 6.3.2 리랭킹 전략

**[논의 필요]**

초기 검색 결과를 재정렬하여 정확도 향상:

```python
def rerank_documents(query: str, documents: list) -> list:
    # 방법 1: Cross-encoder 사용
    # 방법 2: 키워드 매칭 점수 결합
    # 방법 3: 사용자 프로필 기반 가중치
    ...
```

---

## 6.4 에러 핸들링

### 6.4.1 에러 코드 정의

```python
class ErrorCode(Enum):
    # 4xx Client Errors
    INVALID_REQUEST = 400
    UNAUTHORIZED = 401
    NOT_FOUND = 404
    VALIDATION_ERROR = 422

    # 5xx Server Errors
    INTERNAL_ERROR = 500
    DATABASE_ERROR = 501
    LLM_ERROR = 502
    VECTOR_DB_ERROR = 503
```

### 6.4.2 에러 응답 형식

```json
{
  "error": {
    "code": 404,
    "message": "Announcement not found",
    "details": "공고 ID 'LH_lease_999'를 찾을 수 없습니다."
  }
}
```

---

## 6.5 인증 및 권한 (향후)

**[논의 필요]**

Phase 2 이후:
- JWT 토큰 기반 인증
- OAuth 2.0 (소셜 로그인)
- API Rate Limiting

---

## 6.6 모니터링 및 로깅

**[논의 필요]**

- 요청/응답 로깅
- LLM 호출 비용 모니터링
- 에러 추적 (Sentry)
- 성능 모니터링 (Prometheus)

---

## 6.7 API 문서화

FastAPI 자동 문서화:
- Swagger UI: `/docs`
- ReDoc: `/redoc`

예시:
```
http://localhost:8000/docs
```

---

**작성일**: 2025년 11월 21일

**작성자**: 오흥재

**상태**: 초안 (사용자 논의 필요)
