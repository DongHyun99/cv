# CV

개인 연구자 홈페이지. 내용은 전부 `content/*.md`에 쓰고, `date` 기준 최신순으로 자동 정렬된다. md 만 고치고 push 하면 된다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/pages.yml`)가 `node scripts/build.js`로 `content/*.md`를 `index.html`에 미리 그려 넣은 `_site/`를 만들어 GitHub Pages에 올린다. 그래서 JavaScript를 실행하지 않는 크롤러나 AI 도구(Claude, ChatGPT 등)도 내용을 읽을 수 있다. 저장소의 `index.html`은 빈 틀을 유지하고, 빌드 결과(`_site/`)는 커밋하지 않는다.

배포본을 로컬에서 확인하려면:

```bash
node scripts/build.js && python3 -m http.server 8000 -d _site
```

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
│   ├── patents.md
│   ├── research.md
│   ├── experience.md
│   ├── education.md
│   └── awards.md
├── images/
│   ├── profile.jpg       프로필 사진 (profile.md 의 photo 경로)
│   └── pubs/             논문 썸네일 — 파일명 = short 값 (아래 참고)
├── files/
│   ├── cv.pdf            CV 파일 (profile.md 의 cv 경로) — 공개됨
│   └── bib/              논문 BibTeX (.bib)
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
| `native` | (선택) 이름 옆에 작게 붙는 다른 표기, 예: `한동현` |
| `photo` | 사진 경로, 예: `images/profile.jpg` |
| `keywords` | 이름 아래 파란 키워드 줄 |
| `position`, `affiliation` | 직함, 소속 |
| `email`, `scholar`, `alphaxiv`, `github`, `linkedin`, `twitter`, `cv` | 있는 것만 링크 버튼으로 표시 |
| `stats` | 소개 아래 회색 요약 한 줄 |
| 일반 문단 | 소개(bio). `**굵게**` 부분은 포인트 색으로 강조 |

### `publications.md`

| 키 | 설명 |
|---|---|
| `date` | 정렬 + 연도 구분(2026 / 2025 …) 기준 |
| `venue` | 학회·저널명 |
| `tag` | venue 뒤에 ` · `로 이어 붙는 부가 정보. 쉼표로 여러 개: `SCIE, Q1, IF 4.6`, `Oral` |
| `topic` | 필터 버튼. 논문당 1–2개, 여러 논문에 같은 이름을 재사용: `Vision-Language, Efficient Inference`. 버튼은 해당 논문이 많은 주제부터 정렬 |
| `authors` | 저자. 본인 이름은 `**굵게**`. 이름 바로 뒤의 `*` `†` `‡`는 위첨자: `**Your Name***†, Coauthor*` |
| `note` | (선택) 저자 줄 끝에 작게: `* Equal contribution · † Corresponding author` |
| `short` | 썸네일 대신 보일 짧은 이름 + 썸네일 파일명 |
| `thumb` | (선택) 썸네일 경로를 직접 지정 |
| `paper` `arxiv` `pdf` `code` `project` `slides` `poster` `video` | 있는 것만 버튼으로 표시 |
| `bibtex` | `.bib` 파일 경로(예: `files/bib/TAVER.bib`)면 버튼을 눌렀을 때 항목 아래에 펼쳐지고 Copy 버튼이 생김. 일반 URL이면 링크 |

**썸네일 찾는 순서**
1. `thumb`에 적은 경로
2. `images/pubs/<short>.png|jpg|jpeg|webp|pdf` — 예: `short: Foveated Compression` 이면
   `images/pubs/Foveated Compression.png` 또는 `images/pubs/foveated-compression.png`
3. 둘 다 없으면 `short` 글자를 표시

PDF는 **첫 페이지**를 썸네일로 그린다(논문 그림을 PDF로 저장한 경우 그대로 넣으면 됨). 같은 이름의 이미지 파일이 있으면 이미지가 우선. PDF 렌더링용 pdf.js 는 PDF 썸네일이 있을 때만 불러온다.

PDF 썸네일은 방문할 때마다 PDF와 pdf.js를 받아서 느리므로, 같은 이름의 PNG로 변환해 두는 것을 권장한다:

```bash
uv run --with pymupdf python -c "import pymupdf,sys;p=pymupdf.open(sys.argv[1])[0];z=800/p.rect.width;p.get_pixmap(matrix=pymupdf.Matrix(z,z)).save(sys.argv[1][:-4]+'.png')" 'images/pubs/COVE.pdf'
```

### `patents.md`

| 키 | 설명 |
|---|---|
| `## 특허 제목` | |
| `office` | 배지: `US`, `KR`, `PCT` … |
| `number` | (선택) 출원·등록 번호 |
| `status` | (선택) `Pending`(출원 중), `Granted`(등록) … |
| `date` | 정렬 기준 (출원일) |

### `news.md`

| 키 | 설명 |
|---|---|
| `## 제목` | 뉴스 내용 한 줄 |
| `date` | 날짜 |
| `type` | 배지: `Paper`, `Award`, `Grant`, `Position`, `Preprint`, `Talk` … |

### `research.md`

참여 과제·연구 주제 단위로 쓴다. 한 줄에 한 과제씩, 왼쪽에 기간·기관, 오른쪽에 제목·태그·설명·성과가 표시된다(모바일에서는 위아래로).

| 키 | 설명 |
|---|---|
| `## 과제/연구 이름` | 예: `Competency-Aware Machine Learning (CAML)` |
| `tag` | 분야·과제 키워드, 쉼표로 **최대 2개** (3개 이상 적으면 앞의 2개만 표시): `National R&D, Vision Foundation Models` |
| `org`, `period` | (선택) 수행 기관, 기간 — 왼쪽 열 |
| `focus` | (선택) 과제 안에서 내가 맡은 부분 한 줄 — 제목 바로 아래 파란 글씨 |
| `metric` | (선택) 성과 한 줄 — 맨 아래 초록 `OUTPUT` 줄 |
| `image` | (선택) 과제 대표 그림 한 장, 예: `images/research/shadow.png`. 설명 아래 16:9 칸에 표시 |
| `video` | (선택) YouTube 주소. YouTube 썸네일 + 재생 버튼으로 표시되고 누르면 영상으로 이동. `image`도 있으면 그 그림을 썸네일로 씀 |
| `caption` | (선택) 그림 아래 작은 설명 |
| `date` | (선택) 있으면 최신순, 없으면 적은 순서대로 |

그 아래 첫 문단은 "무엇을 왜 했는지" 한두 문장(진하게 표시), `- ` 로 시작하는 줄은 내가 한 일 목록이 된다. 글머리표를 `단어: …` 처럼 콜론으로 시작하면 키로 읽히니 피할 것(`- **TAVER** — …` 처럼 쓰면 안전).

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

`type`(뉴스) 배지 색은 단어를 보고 자동으로 정해진다. 논문 `tag`는 배지 없이 회색 글자로, 특허 `office`는 회색 배지로 표시된다.

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
- 포인트 색 변경: `assets/style.css` 맨 위 `--ac`(진한 색), `--soft`(연한 배경). 다크 모드 색은 바로 아래 `:root[data-theme="dark"]`.
- 다크/라이트: 오른쪽 위 버튼으로 전환. 처음 방문하면 기기 설정을 따르고, 한 번 누르면 브라우저에 기억된다.
