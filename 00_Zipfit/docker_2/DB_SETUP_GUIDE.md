# RAG 챗봇 DB 접근 가이드 (Windows 팀원용)

## 목차
1. [개요](#개요)
2. [옵션 1: Docker로 로컬 DB 실행 (권장)](#옵션-1-docker로-로컬-db-실행-권장)
3. [옵션 2: 원격 DB 서버 접근](#옵션-2-원격-db-서버-접근)
4. [데이터베이스 정보](#데이터베이스-정보)
5. [연결 테스트](#연결-테스트)
6. [백엔드/프론트엔드 연동](#백엔드프론트엔드-연동)

---

## 개요

현재 벡터화된 데이터베이스 상태:
- **총 공고**: 473개
- **벡터화 완료**: 320개 공고
- **생성된 청크**: 20,352개
- **DB 크기**: 284MB (백업 파일 기준)

---

## 옵션 1: Docker로 로컬 DB 실행 (권장)

팀원 각자의 윈도우 PC에서 Docker로 DB를 실행하는 방법입니다.

### 1.1 사전 준비

#### Docker Desktop 설치
1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) 다운로드
2. 설치 후 재부팅
3. Docker Desktop 실행 확인

#### 필요한 파일 다운로드
프로젝트 디렉토리에서 다음 파일들이 필요합니다:
```
3rd-proj/
├── docker-compose.yml
├── Dockerfile
├── schema.sql
└── backups/
    └── db_backup_473_local.sql  (284MB)
```

### 1.2 DB 컨테이너 실행

#### Windows PowerShell 또는 CMD에서:

```powershell
# 1. 프로젝트 폴더로 이동
cd 프로젝트_폴더

# 2. Docker Compose로 DB 실행 (db_dump.sql 이미 포함되어 있음)
docker-compose up -d postgres

# 3. 실행 확인
docker ps
```

출력 예시:
```
CONTAINER ID   IMAGE          PORTS                    NAMES
abc123def456   postgres:14    0.0.0.0:5432->5432/tcp   rag-chatbot-db
```

### 1.3 데이터 임포트

DB 컨테이너가 실행되면 자동으로 데이터가 로드됩니다.

확인:
```powershell
docker exec rag-chatbot-db psql -U rag_user -d skn19_3rd_proj -c "SELECT COUNT(*) FROM document_chunks;"
```

출력:
```
 count
-------
 20352
```

### 1.4 연결 정보

로컬 PC에서 DB에 접근하려면:

```
Host: localhost (또는 127.0.0.1)
Port: 5432
Database: skn19_3rd_proj
Username: rag_user
Password: skn19
```

### 1.5 Python RAG 예시 (간단한 질의응답)

Docker로 DB를 실행한 후 Python으로 RAG 질의응답을 테스트할 수 있습니다.

#### 필요한 패키지 설치

```powershell
pip install psycopg2-binary sentence-transformers openai python-dotenv
```

#### RAG 검색 예시 코드

`simple_rag.py` 파일을 생성하세요:

```python
# simple_rag.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# DB 연결 설정
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'skn19_3rd_proj',
    'user': 'rag_user',
    'password': 'skn19'
}

# 임베딩 모델 로드 (최초 실행 시 다운로드, 시간 소요)
print("임베딩 모델 로딩 중...")
embedding_model = SentenceTransformer('BAAI/bge-m3')
print("모델 로드 완료!")

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def search_similar_chunks(query: str, top_k: int = 5):
    """쿼리와 유사한 문서 청크 검색"""

    # 1. 쿼리를 임베딩으로 변환
    print(f"\n🔍 검색 쿼리: {query}")
    query_embedding = embedding_model.encode(query, normalize_embeddings=True).tolist()

    # 2. DB에서 벡터 유사도 검색
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT
            dc.chunk_text,
            dc.metadata,
            a.id as announcement_id,
            a.title,
            a.category,
            a.region,
            a.notice_type,
            (dc.embedding <=> %s::vector) AS distance,
            (1 - (dc.embedding <=> %s::vector)) AS similarity
        FROM document_chunks dc
        JOIN announcements a ON dc.announcement_id = a.id
        ORDER BY distance
        LIMIT %s
    """, (query_embedding, query_embedding, top_k))

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return results


def generate_answer(query: str, contexts: list):
    """검색된 문서를 바탕으로 GPT 답변 생성"""

    # 컨텍스트 구성
    context_text = "\n\n".join([
        f"[문서 {i+1}] {ctx['title']} ({ctx['region']})\n{ctx['chunk_text']}"
        for i, ctx in enumerate(contexts)
    ])

    # GPT에게 프롬프트 전달
    system_prompt = """당신은 LH 공공주택 안내 전문가입니다.
사용자의 질문에 대해 제공된 공고 문서를 참고하여 정확하고 친절하게 답변하세요.

답변 형식:
1. 질문에 대한 직접적인 답변
2. 관련 공고 정보 (공고명, 지역)
3. 추가로 확인이 필요한 사항이 있다면 안내

문서에 정보가 없으면 "제공된 문서에서 해당 정보를 찾을 수 없습니다"라고 답변하세요."""

    user_prompt = f"""질문: {query}

참고 문서:
{context_text}

위 문서를 바탕으로 질문에 답변해주세요."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3,
        max_tokens=1500
    )

    return response.choices[0].message.content


def rag_query(query: str, top_k: int = 5, show_sources: bool = True):
    """RAG 전체 파이프라인"""

    # 1. 유사 문서 검색
    results = search_similar_chunks(query, top_k)

    if not results:
        print("검색 결과가 없습니다.")
        return

    # 2. 검색 결과 출력
    print(f"\n📚 검색된 문서 ({len(results)}건):")
    print("=" * 80)
    for i, result in enumerate(results, 1):
        print(f"\n[{i}] {result['title']}")
        print(f"    지역: {result['region']} | 유형: {result['notice_type']}")
        print(f"    유사도: {result['similarity']:.3f}")
        if show_sources:
            print(f"    내용: {result['chunk_text'][:150]}...")

    # 3. GPT로 답변 생성
    print("\n" + "=" * 80)
    print("🤖 AI 답변 생성 중...\n")

    answer = generate_answer(query, results)

    print("💡 답변:")
    print("=" * 80)
    print(answer)
    print("=" * 80)

    return {
        'query': query,
        'sources': results,
        'answer': answer
    }


# 메인 실행
if __name__ == "__main__":
    # 예시 쿼리들
    queries = [
        "서울 강남구 임대주택 신청 방법을 알려주세요",
        "무주택 세대주 자격 조건이 어떻게 되나요?",
        "소득 기준은 어떻게 확인하나요?"
    ]

    # 대화형 모드
    print("=" * 80)
    print("LH 공고 RAG 챗봇 (종료: 'quit' 입력)")
    print("=" * 80)

    while True:
        query = input("\n질문을 입력하세요: ").strip()

        if query.lower() in ['quit', 'exit', '종료', 'q']:
            print("종료합니다.")
            break

        if not query:
            continue

        try:
            rag_query(query, top_k=5, show_sources=True)
        except Exception as e:
            print(f"❌ 오류 발생: {e}")
```

#### 실행 방법

1. `.env` 파일에 OpenAI API 키 설정:
```bash
# .env
OPENAI_API_KEY=your-openai-api-key-here
```

2. 스크립트 실행:
```powershell
python simple_rag.py
```

#### 실행 예시

```
임베딩 모델 로딩 중...
모델 로드 완료!
================================================================================
LH 공고 RAG 챗봇 (종료: 'quit' 입력)
================================================================================

질문을 입력하세요: 서울 강남구 임대주택 신청 방법을 알려주세요

🔍 검색 쿼리: 서울 강남구 임대주택 신청 방법을 알려주세요

📚 검색된 문서 (5건):
================================================================================

[1] 서울 지역 행복주택 입주자 모집공고
    지역: 서울 | 유형: 행복주택
    유사도: 0.754
    내용: 신청 방법 인터넷 청약 LH 청약센터(apply.lh.or.kr)에서 신청 가능합니다...

[2] 강남구 국민임대주택 입주자 모집
    지역: 서울 강남구 | 유형: 국민임대
    유사도: 0.721
    내용: 접수 기간 2025년 1월 2일 ~ 1월 10일 인터넷 청약 접수...

================================================================================
🤖 AI 답변 생성 중...

💡 답변:
================================================================================
서울 강남구 임대주택 신청 방법은 다음과 같습니다:

1. **신청 방법**
   - LH 청약센터(apply.lh.or.kr)에서 인터넷 청약 신청
   - 모바일 앱 'LH 청약센터' 이용 가능

2. **관련 공고**
   - 강남구 국민임대주택 입주자 모집 (서울 강남구)
   - 서울 지역 행복주택 입주자 모집공고 (서울)

3. **추가 확인사항**
   - 신청 자격 조건 확인 (무주택 세대주, 소득 기준 등)
   - 접수 기간 확인 (공고별로 상이)
   - 필요 서류 준비 (주민등록등본, 소득증빙서류 등)

자세한 내용은 LH 청약센터나 해당 공고문을 참고하시기 바랍니다.
================================================================================
```

#### 간단한 검색만 하는 버전 (OpenAI 없이)

OpenAI API가 없어도 벡터 검색만 테스트할 수 있습니다:

```python
# simple_search.py
import psycopg2
from psycopg2.extras import RealDictCursor
from sentence_transformers import SentenceTransformer

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'skn19_3rd_proj',
    'user': 'rag_user',
    'password': 'skn19'
}

print("임베딩 모델 로딩 중...")
model = SentenceTransformer('BAAI/bge-m3')
print("모델 로드 완료!")

def search(query: str, top_k: int = 5):
    # 쿼리 임베딩
    query_emb = model.encode(query, normalize_embeddings=True).tolist()

    # DB 검색
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT
            a.title,
            a.region,
            dc.chunk_text,
            (1 - (dc.embedding <=> %s::vector)) AS similarity
        FROM document_chunks dc
        JOIN announcements a ON dc.announcement_id = a.id
        ORDER BY dc.embedding <=> %s::vector
        LIMIT %s
    """, (query_emb, query_emb, top_k))

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    # 결과 출력
    print(f"\n🔍 검색: {query}\n")
    for i, r in enumerate(results, 1):
        print(f"[{i}] {r['title']} ({r['region']})")
        print(f"    유사도: {r['similarity']:.3f}")
        print(f"    {r['chunk_text'][:200]}...\n")

# 테스트
search("무주택 세대주 자격 조건")
search("서울 강남구 임대주택")
```

실행:
```powershell
python simple_search.py
```

---

## 옵션 2: 원격 DB 서버 접근

만약 DB를 클라우드나 서버에 배포한다면 아래 방법을 사용하세요.

### 2.1 AWS RDS PostgreSQL (예시)

#### AWS RDS 생성 (담당자가 1회 수행)

1. AWS Console → RDS → "Create database"
2. 설정:
   - Engine: PostgreSQL 14
   - Template: Free tier (또는 Dev/Test)
   - DB instance identifier: `rag-chatbot-db`
   - Master username: `rag_user`
   - Master password: `skn19` (또는 안전한 비밀번호)
   - Storage: 20GB (최소)
   - Public access: Yes (팀원 접근 위해)
   - VPC security group: PostgreSQL (5432) 포트 열기

3. pgvector 확장 설치:
```sql
CREATE EXTENSION vector;
```

4. 데이터 임포트:
```powershell
# 로컬에서 백업 파일 복원
psql -h <RDS-ENDPOINT> -U rag_user -d skn19_3rd_proj < backups/db_backup_473_local.sql
```

#### 팀원 연결 정보

```
Host: <RDS-ENDPOINT>.rds.amazonaws.com
Port: 5432
Database: skn19_3rd_proj
Username: rag_user
Password: skn19
```

### 2.2 다른 클라우드 옵션

- **Google Cloud SQL**: PostgreSQL 지원, pgvector 확장 가능
- **Azure Database for PostgreSQL**: pgvector 지원
- **Supabase**: 무료 티어, pgvector 기본 지원, 추천!

---

## 데이터베이스 정보

### 테이블 구조

#### 1. `announcements` (공고)
```sql
-- 320개 벡터화된 공고 정보
id              VARCHAR(50)    -- 'LH_lease_1', 'LH_sale_1', ...
title           TEXT           -- 공고명
category        VARCHAR(20)    -- 'sale' 또는 'lease'
region          VARCHAR(100)   -- 지역
notice_type     VARCHAR(100)   -- 공고 유형
posted_date     DATE
deadline_date   DATE
is_vectorized   BOOLEAN        -- 벡터화 완료 여부
```

#### 2. `announcement_files` (첨부파일)
```sql
-- 공고별 PDF 파일 정보
id                SERIAL
announcement_id   VARCHAR(50)   -- announcements.id FK
file_name         TEXT          -- PDF 파일명
is_vectorized     BOOLEAN
```

#### 3. `document_chunks` (RAG 핵심 테이블)
```sql
-- 20,352개 벡터화된 텍스트 청크
id                BIGSERIAL
announcement_id   VARCHAR(50)   -- announcements.id FK
file_id           INTEGER       -- announcement_files.id FK
chunk_text        TEXT          -- 청크 텍스트
chunk_index       INTEGER       -- 파일 내 순서
embedding         VECTOR(1024)  -- 임베딩 벡터 (BAAI/bge-m3)
metadata          JSONB         -- { file_name, section, has_table, ... }
```

### 주요 인덱스

```sql
-- 벡터 검색용 HNSW 인덱스 (빠른 유사도 검색)
CREATE INDEX idx_chunks_embedding ON document_chunks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
```

---

## 연결 테스트

### Python에서 연결 테스트

```python
# test_db_connection.py
import psycopg2
from psycopg2.extras import RealDictCursor

# 연결 정보 (환경에 맞게 수정)
DB_CONFIG = {
    'host': 'localhost',  # 또는 RDS endpoint
    'port': 5432,
    'database': 'skn19_3rd_proj',
    'user': 'rag_user',
    'password': 'skn19'
}

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # 1. 전체 공고 수
    cursor.execute("SELECT COUNT(*) as count FROM announcements")
    print(f"총 공고: {cursor.fetchone()['count']}개")

    # 2. 벡터화된 공고 수
    cursor.execute("SELECT COUNT(*) as count FROM announcements WHERE is_vectorized = true")
    print(f"벡터화된 공고: {cursor.fetchone()['count']}개")

    # 3. 청크 수
    cursor.execute("SELECT COUNT(*) as count FROM document_chunks")
    print(f"총 청크: {cursor.fetchone()['count']:,}개")

    # 4. 벡터 검색 테스트
    cursor.execute("""
        SELECT a.title, dc.chunk_text
        FROM document_chunks dc
        JOIN announcements a ON dc.announcement_id = a.id
        LIMIT 1
    """)
    sample = cursor.fetchone()
    print(f"\n샘플 데이터:")
    print(f"공고: {sample['title'][:50]}...")
    print(f"청크: {sample['chunk_text'][:100]}...")

    print("\n✅ DB 연결 성공!")

    cursor.close()
    conn.close()

except Exception as e:
    print(f"❌ DB 연결 실패: {e}")
```

실행:
```powershell
python test_db_connection.py
```

### pgAdmin으로 연결 (GUI 도구)

1. [pgAdmin 다운로드](https://www.pgadmin.org/download/)
2. 설치 후 실행
3. Add New Server:
   - Name: `RAG Chatbot DB`
   - Host: `localhost` (또는 원격 서버 주소)
   - Port: `5432`
   - Database: `skn19_3rd_proj`
   - Username: `rag_user`
   - Password: `skn19`

---

## 백엔드/프론트엔드 연동

### 백엔드 (FastAPI/Flask 예시)

#### 환경변수 설정 (`.env`)

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skn19_3rd_proj
DB_USER=rag_user
DB_PASSWORD=skn19
OPENAI_API_KEY=your-openai-api-key
```

#### FastAPI 연결 코드

```python
# backend/database.py
import os
from typing import List, Dict
import asyncpg
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        """DB 연결 풀 생성"""
        self.pool = await asyncpg.create_pool(
            host=os.getenv('DB_HOST'),
            port=int(os.getenv('DB_PORT')),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            min_size=5,
            max_size=20
        )

    async def search_similar_chunks(self, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        """벡터 유사도 검색"""
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT
                    dc.chunk_text,
                    dc.metadata,
                    a.title,
                    a.category,
                    a.region,
                    (dc.embedding <=> $1::vector) AS distance
                FROM document_chunks dc
                JOIN announcements a ON dc.announcement_id = a.id
                ORDER BY distance
                LIMIT $2
            """, query_embedding, top_k)

            return [dict(row) for row in results]

    async def close(self):
        """연결 종료"""
        await self.pool.close()

# 사용 예시
db = Database()
await db.connect()
results = await db.search_similar_chunks(query_embedding, top_k=5)
```

#### API 엔드포인트 예시

```python
# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer

app = FastAPI()
db = Database()
model = SentenceTransformer('BAAI/bge-m3')

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.close()

@app.post("/search")
async def search(request: SearchRequest):
    """벡터 검색 API"""
    try:
        # 1. 쿼리 임베딩 생성
        query_embedding = model.encode(request.query, normalize_embeddings=True).tolist()

        # 2. 유사 청크 검색
        results = await db.search_similar_chunks(query_embedding, request.top_k)

        return {
            "query": request.query,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/announcements")
async def get_announcements(category: str = None, region: str = None):
    """공고 목록 조회"""
    async with db.pool.acquire() as conn:
        query = "SELECT * FROM announcements WHERE 1=1"
        params = []

        if category:
            params.append(category)
            query += f" AND category = ${len(params)}"

        if region:
            params.append(region)
            query += f" AND region LIKE ${len(params)}"

        results = await conn.fetch(query, *params)
        return [dict(row) for row in results]
```

### 프론트엔드 연동

#### API 호출 예시 (React/TypeScript)

```typescript
// frontend/src/api/search.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface SearchRequest {
  query: string;
  top_k?: number;
}

export interface SearchResult {
  chunk_text: string;
  metadata: any;
  title: string;
  category: string;
  region: string;
  distance: number;
}

export const searchAnnouncements = async (query: string, topK: number = 5): Promise<SearchResult[]> => {
  const response = await axios.post<{ results: SearchResult[] }>(
    `${API_BASE_URL}/search`,
    { query, top_k: topK }
  );
  return response.data.results;
};

export const getAnnouncements = async (category?: string, region?: string) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (region) params.append('region', region);

  const response = await axios.get(`${API_BASE_URL}/announcements?${params}`);
  return response.data;
};
```

#### 사용 예시 (React 컴포넌트)

```tsx
// frontend/src/components/Search.tsx
import React, { useState } from 'react';
import { searchAnnouncements, SearchResult } from '../api/search';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchAnnouncements(query, 5);
      setResults(data);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? '검색 중...' : '검색'}
      </button>

      <div>
        {results.map((result, idx) => (
          <div key={idx}>
            <h3>{result.title}</h3>
            <p>{result.chunk_text.substring(0, 200)}...</p>
            <small>
              {result.category} | {result.region} | 유사도: {(1 - result.distance).toFixed(3)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 트러블슈팅

### 1. Docker 컨테이너가 시작되지 않음

```powershell
# 로그 확인
docker logs rag-chatbot-db

# 컨테이너 재시작
docker-compose down
docker-compose up -d postgres
```

### 2. 연결 거부 (Connection refused)

- Docker Desktop이 실행 중인지 확인
- 방화벽에서 5432 포트 허용 확인
- `docker ps`로 컨테이너 상태 확인

### 3. pgvector 확장 오류

```sql
-- 수동으로 확장 설치
docker exec -it rag-chatbot-db psql -U rag_user -d skn19_3rd_proj
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Windows에서 파일 경로 문제

PowerShell에서 경로는 `\`를 사용:
```powershell
copy backups\db_backup_473_local.sql db_dump.sql
```

Git Bash에서는 `/`를 사용:
```bash
cp backups/db_backup_473_local.sql db_dump.sql
```

---

## 요약

### 빠른 시작 (Windows 팀원)

1. Docker Desktop 설치
2. 프로젝트 클론
3. DB 백업 파일 복사:
   ```powershell
   copy backups\db_backup_473_local.sql db_dump.sql
   ```
4. Docker Compose 실행:
   ```powershell
   docker-compose up -d postgres
   ```
5. 연결 테스트:
   ```python
   python test_db_connection.py
   ```

### DB 연결 정보

```
Host: localhost
Port: 5432
Database: skn19_3rd_proj
Username: rag_user
Password: skn19
```

### 문의

DB 접근 관련 문제가 있으면 팀 채널에 공유해주세요!
