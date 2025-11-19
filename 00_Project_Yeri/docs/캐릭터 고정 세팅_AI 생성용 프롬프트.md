## 🎨 캐릭터 “예리(Yeri)” 고정 세팅 (AI 생성용 프롬프트 기반)

| 항목 | 설정 |
| --- | --- |
| 이름 | 예리 (Yeri) |
| 성격 | 밝고 장난기 많음, 약간의 자신감과 허당미 |
| 비주얼 | 20대 초반, 긴 갈색 머리, 따뜻한 인상 |
| 복장 기본값 | 핑크 톤 상의 + 블랙 스커트 + 미니백 |
| 스타일 | 세미 캐주얼 / Webtoon 스타일 / 고해상도 일러스트 |
| 톤 | “자기야~” or “오빠~” 라고 부름 |

---

## 🧠 시리즈 확장 방향

(LLM + 이미지 생성 AI 조합 시 설계 가능한 범주별 예시)

| 카테고리 | 구체적 변화 예시 |
| --- | --- |
| **악세서리 계열** | 가방, 목걸이, 귀걸이, 반지, 팔찌, 시계 |
| **헤어 스타일 계열** | 앞머리 가르마 방향, 컬 정도, 묶음 여부, 색상, 길이 |
| **메이크업 계열** | 립컬러, 볼터치, 음영, 쿨톤/웜톤, 렌즈 색상 |
| **의상 계열** | 상의 색상, 단추 수, 스커트 길이, 자켓 착용 |
| **피부/조명/디테일 계열** | 하이라이트(쇄골, 볼, 코끝), 그림자 방향, 톤 차 |
| **표정 계열** | 웃음 강도, 시선 방향, 입꼬리, 눈썹 각도 |
| **구도/배경 계열** | 카메라 각도, 배경색, 주변 오브젝트 |
| **극미세 디테일** | 속눈썹 길이, 아이브로우 색, 눈꼬리 쉐입 |

---

## 🎨 [예리 캐릭터 기본 프롬프트 템플릿]

### 🧱 **Core Character Prompt (불변 요소)**

*(이건 모든 Before/After 이미지의 “공통 DNA”야.)*

```
Yeri, a 23-year-old Korean woman, cheerful and warm personality, 
medium-long dark brown wavy hair, smooth fair skin, 
large brown eyes, natural smile, 
wearing a pink puff-sleeve blouse and a black mini skirt, 
carrying a small shoulder bag, 
soft natural lighting, 
webtoon-style semi-realistic illustration, 
high resolution, 4K, 
center composition, upper-body portrait, 
clean white background, gentle expression, 
consistent facial features across all images, 
same camera angle and framing.
```

---

```
Yeri, a 23-year-old Korean woman, bright and charming personality, 
medium-length brown hair with soft waves, slightly side-parted bangs, 
fair neutral skin tone, gentle smile, large expressive eyes, 
wearing a simple yet elegant outfit: a soft pink blouse and black skirt, 
light natural makeup, subtle gloss lips, 
minimalist accessories such as small earrings or a thin necklace, 
clean background in warm pastel tone, 
illustrated in a semi-stylized modern 2D art style (between anime and concept art), 
soft lighting, warm color palette, 
smooth linework, cohesive art direction, 
consistent facial proportions and hairstyle across all generations, 
framed as a half-body portrait, front-facing, high resolution.
```

---

### ✳️ **스타일 톤**

| 요소 | 목표 | 프롬프트 제어 예시 |
| --- | --- | --- |
| **전체 분위기** | 따뜻하고 포근한 감정톤 | “warm pastel tones”, “soft focus”, “cinematic soft light” |
| **라인 스타일** | 간결하고 미려한 선 | “smooth minimal line art”, “studio ghibli inspired lighting” |
| **색감** | 부드럽고 덜 포화된 색 | “soft desaturated colors”, “gentle gradient shading” |
| **피부톤** | 뉴트럴 톤 | “neutral fair skin tone, soft natural texture” |
| **눈** | 감정 표현력 ↑ | “large warm brown eyes, gentle sparkle” |
| **배경** | 화이트 대신 부드러운 톤 | “pastel peach or beige background, clean composition” |

---

### 🎭 **가변 시드 (변화를 줄 요소들)**

*(Before/After에서 바뀔 수 있는 요소들을 각각 명시할 수 있어)*

| 카테고리 | 속성 예시 | 프롬프트 제어 키워드 예시 |
| --- | --- | --- |
| **헤어** | 길이, 컬, 색상, 가르마, 묶음 여부 | `long hair`, `short bob`, `blond`, `side parted`, `ponytail` |
| **악세서리** | 귀걸이, 목걸이, 가방, 헤어밴드 | `wearing gold earrings`, `black handbag`, `brown leather bag`, `headband` |
| **메이크업** | 립색, 톤, 하이라이트 | `pink lipstick`, `warm tone makeup`, `cool tone`, `highlighted collarbone` |
| **표정/시선** | 입꼬리, 미소, 시선방향 | `subtle smile`, `looking slightly right`, `open mouth smile` |
| **조명/색감** | 웜/쿨, 밝기 차이 | `soft warm lighting`, `cool neutral lighting` |

---

## 🪄 **예시 세트 생성 프롬프트**

### 💫 <불변 시드> + <바뀐 변수>

변화된 변수 : 가방, 립컬러, 헤어벤드, 귀걸이, 쿨톤-웜톤 화장, 하이라이트, 쇄골 하이라이트, 블러셔, 아이라인길이, 아이라인 각도, 아이라인 컬러, 마스카라 종류, 렌즈색, 쉐딩 강도,  

**Before**

```
<불변 시드>, carrying a black quilted handbag, wearing red lipstick.
, without headband, small gold hoop earrings.
, cool tone makeup, matte skin finish, no collarbone highlight.
```

**After**

```
<불변 시드>, carrying a brown leather handbag, wearing soft pink lipstick.
, wearing black headband, long dangling earrings.
, warm tone makeup, glowing skin, highlighted collarbone.
```

---

## 🧩 **생성 팁**

- **기본 시드 문장은 항상 동일하게 유지해야 해.**
    
    (그게 “같은 사람처럼 보이게 만드는 핵심”)
    
- 변화시키는 문장만 바꿔가며 두 장씩 생성.
- 모델 예시:
    - Stable Diffusion XL (prompt fidelity ↑)
    - Krea or DALL·E 3 (색감 자연, facial consistency↑)
- 추가 파라미터:
    
    ```
    Steps: 30
    CFG Scale: 7.0
    Seed: fixed (예: 12345)
    Aspect Ratio: 1:1 or 3:4
    ```
    

---

## ✨ 결과 기대치

- **일관된 캐릭터 스타일**
- **미묘한 변화**
- **확대해도 눈에 띄는 디테일 차이 (립, 가방, 빛 등)**
- **차이찾기 게임에 적합한 시각 밸런스**

---