# GH API 추가 내용 (00_test_02.ipynb에 추가할 내용)

## 4. 데이터 내보내기 함수

### JSON 내보내기 코드

```python
def export_latest_notices_json(result_dict, filename=None):
    """
    API 결과를 JSON 파일로 내보내기
    
    Parameters:
        result_dict (dict): get_latest_notices_for_app() 결과
        filename (str): 저장할 파일명 (None이면 자동 생성)
    
    Returns:
        str: 저장된 파일 경로
    """
    if not result_dict.get('success'):
        print("❌ 내보낼 데이터가 없습니다")
        return None
    
    # 파일명 자동 생성
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"gh_notices_{timestamp}.json"
    
    # 디렉토리 생성
    os.makedirs('output', exist_ok=True)
    filepath = os.path.join('output', filename)
    
    # JSON 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(result_dict, f, ensure_ascii=False, indent=2)
    
    print(f"✅ JSON 파일 저장 완료!")
    print(f"📁 경로: {filepath}")
    print(f"📊 데이터: {result_dict['count']}건")
    
    return filepath

print("✅ 함수 정의 완료: export_latest_notices_json()")
```

---

## 5. 실제 사용 예시

### 최신 10개 공고 조회 및 JSON 저장

```python
# 최신 10개 공고 가져오기
result = get_latest_notices_for_app(count=10, exclude_test=True, min_year='2024')

if result['success']:
    print("="*80)
    print("📊 조회 결과")
    print("="*80)
    print()
    print(f"✅ 성공: {result['success']}")
    print(f"📅 API 마지막 업데이트: {result['last_api_update']}")
    print(f"📊 반환된 공고 수: {result['count']}건")
    print(f"💡 안내: {result['notice']}")
    print()
    
    # 공고 목록 출력 (최대 5개)
    print("="*80)
    print("📢 공고 목록 (최대 5개)")
    print("="*80)
    print()
    
    for idx, notice in enumerate(result['data'][:5], 1):
        date_str = str(notice.get('공고일자', 'N/A'))
        if len(date_str) == 8:
            date_formatted = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}"
        else:
            date_formatted = date_str
        
        print(f"[{idx}] {date_formatted} | {notice.get('공고명', '제목 없음')[:60]}")
        print(f"    공고번호: {notice.get('공고번호')} | 지역: {notice.get('시군구명', 'N/A')}")
        print()
    
    if result['count'] > 5:
        print(f"... 외 {result['count'] - 5}건")
        print()
    
    # JSON 파일로 내보내기
    filepath = export_latest_notices_json(result)
    
    print()
    print("="*80)
    print("✅ 앱/웹 연동 준비 완료!")
    print("="*80)
else:
    print("❌ 데이터 조회 실패")
    print(f"   에러: {result.get('error', '알 수 없는 오류')}")
```

---

## 6. API Metadata 구조

### GH API 공고 데이터 필드 구조

#### 📋 기본 정보
```python
{
    "공고번호": 742,
    "공고명": "(최초) 광주역세권 청년혁신타운 통합공공임대주택...",
    "공고일자": "20250731",
    "공고시각": "17:00",
    "게시일자": "20250731",
    "게시시각": "17:00",
    "구분": "990",
    "모집횟수": 1
}
```

#### 📍 위치 정보
```python
{
    "시군구명": "광주시",
    "접수처주소": "경기도 광주시...",
    "접수처상세주소": "...",
    "접수처우편번호": "12345",
    "접수처전화번호": "031-XXX-XXXX"
}
```

#### 📆 일정 정보
```python
{
    "접수시작일자": "20250801",
    "접수시작시각": "10:00",
    "접수종료일자": "20250822",
    "접수종료시각": "18:00",
    "당첨자발표일자": "20250825",
    "당첨자발표시각": "10:00",
    "계약기간시작일자": "20250901",
    "계약기간종료일자": "20250915",
    "입주예정년월": "202512"
}
```

#### 🏠 주택 정보
```python
{
    "주택관리번호": "2025-XXXX",
    "사업코드": "XXXX"
}
```

#### 📎 첨부파일
```python
{
    "첨부파일일련번호": 12345,
    "제출서류첨부파일일련번호": 67890
}
```

### 필드 목록 (전체)

총 **60개 이상**의 필드가 제공됩니다:

| 카테고리 | 필드 수 | 주요 필드 |
|---------|--------|-----------|
| 기본 정보 | 8 | 공고번호, 공고명, 공고일자, 구분, 모집횟수 |
| 위치 정보 | 5 | 시군구명, 접수처주소, 접수처전화번호 |
| 일정 정보 | 20+ | 접수시작/종료, 발표일자, 계약기간, 입주예정년월 |
| 주택 정보 | 3 | 주택관리번호, 사업코드, 입주예정년월 |
| 첨부파일 | 2 | 첨부파일일련번호, 제출서류첨부파일일련번호 |
| 기타 정보 | 20+ | 유의사항, 비고, 정정사유, 계약특약내용 등 |

---

## 7. LH API 통합 준비

### 🎯 목표: GH + LH API 통합

**공통 Metadata 구조 설계**를 통해 하나의 앱에서 GH와 LH 공고를 통합 관리

### 1️⃣ API 비교

| 항목 | GH API | LH API |
|------|--------|--------|
| 제공기관 | 경기주택도시공사 | 한국토지주택공사 |
| 포함 데이터 | 경기도 지역 | 전국 (LH 관할) |
| 주택 유형 | 행복주택, 국민임대, 통합공공임대, 장기전세 | 국민임대, 영구임대, 행복주택, 분양주택 등 |
| 엔드포인트 | OpenAPI (공공데이터포털) | OpenAPI (공공데이터포털) |
| 업데이트 주기 | 월 1회? (추정) | ? (확인 필요) |

### 2️⃣ 통합 Metadata 설계

#### 공통 필드 (필수)

```python
{
    # 기본 정보
    "source": "GH" | "LH",  # 데이터 출처
    "notice_id": "unique_id",  # 공고 고유번호
    "notice_title": "공고명",
    "notice_date": "20250731",  # YYYYMMDD
    "notice_type": "행복주택" | "국민임대" | ...,
    
    # 위치 정보
    "region": "경기도" | "서울시" | ...,
    "city": "광주시",
    "address": "상세 주소",
    "postal_code": "12345",
    
    # 일정 정보
    "application_start": "20250801",
    "application_end": "20250822",
    "announcement_date": "20250825",  # 당첨자 발표일
    "contract_start": "20250901",
    "contract_end": "20250915",
    "move_in_date": "202512",  # YYYYMM
    
    # 연락처
    "contact_phone": "031-XXX-XXXX",
    
    # 첨부파일
    "attachments": [
        {
            "file_id": 12345,
            "file_name": "공고문.pdf",
            "file_url": "https://..."
        }
    ],
    
    # 메타데이터
    "created_at": "2025-07-31T17:00:00",
    "updated_at": "2025-07-31T17:00:00",
    "raw_data": {...}  # 원본 데이터 전체 저장
}
```

### 3️⃣ 통합 함수 설계 (예시)

```python
def normalize_gh_notice(gh_data):
    """GH API 데이터를 공통 포맷으로 변환"""
    return {
        "source": "GH",
        "notice_id": f"GH-{gh_data['공고번호']}",
        "notice_title": gh_data['공고명'],
        "notice_date": gh_data['공고일자'],
        "notice_type": gh_data.get('구분', 'N/A'),
        "region": "경기도",
        "city": gh_data.get('시군구명', 'N/A'),
        "address": gh_data.get('접수처주소', 'N/A'),
        "postal_code": gh_data.get('접수처우편번호', 'N/A'),
        "application_start": gh_data.get('접수시작일자', 'N/A'),
        "application_end": gh_data.get('접수종료일자', 'N/A'),
        "announcement_date": gh_data.get('당첨자발표일자', 'N/A'),
        "contract_start": gh_data.get('계약기간시작일자', 'N/A'),
        "contract_end": gh_data.get('계약기간종료일자', 'N/A'),
        "move_in_date": gh_data.get('입주예정년월', 'N/A'),
        "contact_phone": gh_data.get('접수처전화번호', 'N/A'),
        "attachments": [
            {
                "file_id": gh_data.get('첨부파일일련번호'),
                "file_name": "공고문",
                "file_url": None  # GH는 직접 다운로드 불가
            }
        ] if gh_data.get('첨부파일일련번호') else [],
        "created_at": f"{gh_data['공고일자'][:4]}-{gh_data['공고일자'][4:6]}-{gh_data['공고일자'][6:]}",
        "updated_at": f"{gh_data['공고일자'][:4]}-{gh_data['공고일자'][4:6]}-{gh_data['공고일자'][6:]}",
        "raw_data": gh_data
    }

def normalize_lh_notice(lh_data):
    """LH API 데이터를 공통 포맷으로 변환 (추후 구현)"""
    # LH API 구조에 맞춰 구현
    pass

def merge_notices(gh_notices, lh_notices):
    """GH + LH 공고 데이터 병합"""
    all_notices = []
    
    # GH 데이터 정규화
    for gh in gh_notices:
        all_notices.append(normalize_gh_notice(gh))
    
    # LH 데이터 정규화
    for lh in lh_notices:
        all_notices.append(normalize_lh_notice(lh))
    
    # 날짜순 정렬
    all_notices.sort(key=lambda x: x['notice_date'], reverse=True)
    
    return all_notices
```

### 4️⃣ 앱/웹 표시 통합

```javascript
// 앱/웹에서 공통 포맷 데이터 사용
function displayNotice(notice) {
    const source_badge = notice.source === 'GH' ? '🏢 GH' : '🏛️ LH';
    
    return `
        <div class="notice-card">
            <span class="badge">${source_badge}</span>
            <h3>${notice.notice_title}</h3>
            <p>📅 공고일: ${formatDate(notice.notice_date)}</p>
            <p>📍 지역: ${notice.region} ${notice.city}</p>
            <p>📆 접수: ${formatDate(notice.application_start)} ~ ${formatDate(notice.application_end)}</p>
            <p>📞 연락처: ${notice.contact_phone}</p>
            
            ${notice.attachments.length > 0 ? 
                '<button>📎 첨부파일 다운로드</button>' : 
                ''
            }
        </div>
    `;
}
```

---

## 8. 최종 권장사항

### ✅ GH API 활용 시 체크리스트

- [x] API 키 발급 완료
- [x] 2025 엔드포인트 사용
- [x] 최신 데이터 조회 함수 구현 (`get_latest_notices_for_app`)
- [x] JSON 내보내기 함수 구현 (`export_latest_notices_json`)
- [x] API 업데이트 지연 안내 메시지 포함
- [x] 홈페이지 링크 제공
- [ ] 정기 모니터링 설정 (월 1회 권장)
- [ ] LH API 연동 (추후)

### 🚀 다음 단계

1. **LH API 조사**
   - LH 공공데이터 포털에서 주택청약 API 확인
   - Metadata 구조 분석
   - GH API와 필드 매핑

2. **통합 함수 구현**
   - `normalize_gh_notice()` 완성
   - `normalize_lh_notice()` 구현
   - `merge_notices()` 테스트

3. **앱/웹 연동**
   - 공통 포맷 JSON 생성
   - 프론트엔드에서 통합 표시
   - 필터링 기능 (지역, 유형, 날짜)

4. **유지보수**
   - 월 1회 API 업데이트 확인
   - 새로운 필드 추가 시 통합 포맷 업데이트
   - 사용자 피드백 반영

---

## 📚 참고 자료

### 공공데이터 포털
- GH 주택청약 모집정보: https://www.data.go.kr/data/15119414/
- LH 주택청약 정보: https://www.data.go.kr/ (검색 필요)

### GH 홈페이지
- 주택청약센터: https://apply.gh.or.kr/sb/sr/sr7150/selectPbancRentHouseList.do

### API 문의
- 공공데이터 포털: 1600-4119
- GH 고객센터: 031-250-1000

---

## 🎉 완료!

이제 GH API를 활용하여 최신 공고 데이터를 수집하고, 앱/웹에 연동할 준비가 완료되었습니다!

**다음 작업**: LH API 통합 및 통합 포맷 구현

