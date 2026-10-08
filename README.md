# CV

개인 연구자 홈페이지. 내용은 전부 `content/*.md`에 쓰고, 페이지가 열릴 때 읽어서 `date` 기준 최신순으로 자동 정렬한다. 빌드 과정 없음.

## 미리보기

```bash
python3 -m http.server 8000   # http://localhost:8000
```

`index.html`을 파일로 직접 열면 동작하지 않는다(브라우저가 `.md` 읽기를 막음). 반드시 서버로 열 것.

## 어디에 무엇을 넣나

```
CV/
├── content/              ← 내용 (여기만 고치면 됨)
│   ├── profile.md        이름 · 사진 경로 · 링크 · 소개
│   ├── news.md
│   ├── publications.md
│   ├── research.md
│   ├── experience.md
│   ├── education.md
│   └── awards.md
├── images/
│   ├── profile.jpg       프로필 사진 (profile.md 의 photo 경로)
│   └── pubs/             논문 썸네일 — 파일명 = short 값 (아래 참고)
├── files/
│   └── cv.pdf            CV 파일 (profile.md 의 cv 경로) — 지금은 .gitignore 로 공개 제외
├── assets/               페이지 코드 (app.js, style.css) — 보통 안 건드림
└── theme-samples/        테마 고를 때 만든 시안 (사이트와 무관)
```

## 작성 규칙 (모든 파일 공통)

```markdown
## 항목 제목
- key: value
- key: value

그 아래 일반 문장은 설명으로 표시된다(선택).
```

- `## 제목` 하나가 항목 하나. **아무 순서로 추가해도** `date` 기준 최신순으로 정렬된다. `date`가 없는 항목은 적은 순서대로 맨 뒤.
- `date` 형식: `2026`, `2026-09`, `2026.09`, `2026-09-15` 모두 가능.
- 키는 대소문자 구분 없음 (`arXiv:` = `arxiv:`).
- 글 안에서 `**굵게**`, `*기울임*`, `` `코드` ``, `[글자](링크)` 사용 가능.
- `<!-- ... -->` 는 주석이라 화면에 안 나온다. 잠깐 숨기고 싶은 줄은 이걸로 감싸면 된다.
- 파일이 비어 있거나 없으면 그 섹션과 왼쪽 목차 항목이 자동으로 숨겨진다.

## 파일별 키

### `profile.md`

| 키 | 설명 |
|---|---|
| `# 이름` | 맨 위 제목 줄이 이름 (브라우저 탭 제목도 됨) |
| `photo` | 사진 경로, 예: `images/profile.jpg` |
| `keywords` | 이름 아래 파란 키워드 줄 |
| `position`, `affiliation` | 직함, 소속 |
| `email`, `scholar`, `github`, `linkedin`, `twitter`, `cv` | 있는 것만 링크 버튼으로 표시 |
| `stats` | 소개 아래 회색 요약 한 줄 |
| 일반 문단 | 소개(bio). `**굵게**` 부분은 포인트 색으로 강조 |

### `publications.md`

| 키 | 설명 |
|---|---|
| `date` | 정렬 + 연도 구분(2026 / 2025 …) 기준 |
| `venue` | 학회·저널명 |
| `tag` | 배지. 쉼표로 여러 개 가능: `Oral, Best Paper` |
| `topic` | 필터 버튼. 쉼표로 여러 개: `Vision-Language, Token Compression` |
| `authors` | 저자. 본인 이름은 `**굵게**` |
| `short` | 썸네일 대신 보일 짧은 이름 + 썸네일 파일명 |
| `thumb` | (선택) 썸네일 경로를 직접 지정 |
| `paper` `arxiv` `pdf` `code` `project` `slides` `poster` `video` `bibtex` | 있는 것만 버튼으로 표시 |

**썸네일 찾는 순서**
1. `thumb`에 적은 경로
2. `images/pubs/<short>.png|jpg|jpeg|webp` — 예: `short: Foveated Compression` 이면
   `images/pubs/Foveated Compression.png` 또는 `images/pubs/foveated-compression.png`
3. 둘 다 없으면 `short` 글자를 표시

### `news.md`

| 키 | 설명 |
|---|---|
| `## 제목` | 뉴스 내용 한 줄 |
| `date` | 날짜 |
| `type` | 배지: `Paper`, `Award`, `Grant`, `Position`, `Preprint`, `Talk` … |

### `research.md`

참여 과제·연구 주제 단위로 쓴다.

| 키 | 설명 |
|---|---|
| `## 과제/연구 이름` | 예: `Competency-Aware Machine Learning (CAML)` |
| `tag` | 분야·과제 키워드, 쉼표로 **최대 2개** (3개 이상 적으면 앞의 2개만 표시): `National R&D, Vision Foundation Models` |
| `org`, `period` | (선택) 수행 기관, 기간 — 카드 오른쪽 위 |
| `metric` | (선택) 성과 한 줄 — 카드 맨 아래 초록 글씨 |
| `wide` | (선택) `yes` 면 카드를 한 줄 전체 너비로 |
| `date` | (선택) 있으면 최신순, 없으면 적은 순서대로 |

그 아래 일반 문단은 설명, `- ` 로 시작하는 줄은 글머리표 목록이 된다. 글머리표를 `단어: …` 처럼 콜론으로 시작하면 키로 읽히니 피할 것(`- **TAVER.** …` 처럼 쓰면 안전).

### `experience.md` / `education.md`

| 키 | 설명 |
|---|---|
| `## 기관 / 학교` | |
| `role` / `degree` | 직함 · 학위 (한 줄 설명) |
| `date` | 정렬 기준 (시작 시점) |
| `period` | (선택) 화면에 보일 기간, 예: `2023 – present`. 없으면 `date` 표시 |

### `awards.md`

`## 수상명, 주최` + `date` + 설명(선택).

## 배지 색

`tag`(논문)와 `type`(뉴스) 배지 색은 단어를 보고 자동으로 정해진다.

| 포함된 단어 | 색 |
|---|---|
| IF + 숫자 (`IF1.2`, `IF 4.5` …) | 하늘-남색 (모든 IF 같은 색) |
| Q1 ~ Q4 | 올리브 (모든 분위 같은 색) |
| SCI, SCIE, SSCI, Scopus, KCI | 갈색 |
| best, award, grant, prize, honor | 금색 |
| oral | 빨강 |
| spotlight, highlight | 노랑 |
| poster | 청록 |
| preprint, arxiv, under review, submitted | 회색 |
| position, join, intern | 초록 |
| talk, invited, keynote | 보라 |
| workshop | 남색 |
| paper, accept, publication | 파랑 |

목록에 없는 단어(예: `Dataset`, `Demo`)는 단어마다 고정된 색이 자동으로 배정된다. 규칙을 바꾸려면 `assets/app.js`의 `TAG_COLORS`를 수정.

## 그 밖에

- 섹션 순서·이름 변경, 섹션 빼기: `assets/app.js` 맨 위 `SECTIONS`.
- 포인트 색 변경: `assets/style.css` 맨 위 `--ac`(진한 색), `--soft`(연한 배경).
