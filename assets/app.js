/*
 * content/*.md 를 읽어서 페이지를 만든다.
 * 각 항목은 "## 제목" + "- key: value" 줄들로 쓰고, date 기준 최신순으로 자동 정렬된다.
 * 형식은 README.md 참고.
 */

// 섹션 순서와 사용하는 파일. 순서를 바꾸거나 줄을 지우면 페이지에도 그대로 반영된다.
const SECTIONS = [
  { id: "news", title: "News", file: "news.md", render: renderNews },
  { id: "publications", title: "Publications", file: "publications.md", render: renderPubs },
  { id: "research", title: "Research", file: "research.md", render: renderResearch },
  { id: "experience", title: "Experience", file: "experience.md", render: renderTimeline },
  { id: "education", title: "Education", file: "education.md", render: renderTimeline },
  { id: "awards", title: "Awards", file: "awards.md", render: renderAwards },
];

// 논문 썸네일 자동 탐색 확장자
const THUMB_EXT = ["png", "jpg", "jpeg", "webp"];

// 논문 항목에서 버튼으로 보여줄 링크 키 (이 순서대로 표시)
const PUB_LINKS = ["paper", "arxiv", "pdf", "code", "project", "slides", "poster", "video", "bibtex"];

const PROFILE_LINKS = [
  ["email", "Email", "mail"], ["scholar", "Scholar", "cap"], ["github", "GitHub", "code"],
  ["linkedin", "LinkedIn", "in"], ["twitter", "X", "x"], ["cv", "CV", "doc"],
];
const ICON = {
  mail: '<path d="M3 6h18v12H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="2"/>',
  cap: '<path d="M12 4 1 9.5l11 5.5 11-5.5z"/><path d="M5 12.5V17c2 2 12 2 14 0v-4.5l-7 3.5z"/>',
  code: '<path d="M8 6 2 12l6 6M16 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2"/>',
  in: '<rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 10v7M7 7v.01M11 17v-7M11 13c0-2 1.2-3 2.8-3S16.5 11 16.5 13v4" stroke="#fff" stroke-width="2" fill="none"/>',
  x: '<path d="M4 4l16 16M20 4 4 20" stroke="currentColor" stroke-width="2.4"/>',
  doc: '<path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12h7M9 16h7" stroke="currentColor" stroke-width="2"/>',
};

/* ---------- 마크다운 파싱 ---------- */

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 한 줄 안의 **굵게**, *기울임*, `코드`, [링크](url)
function inline(s) {
  return esc(s || "")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*(?=\S)(.+?)(?<=\S)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
}

const BULLET = "\u0000";  // 본문 안의 "- 항목" 줄 표시

// 본문: 일반 문단은 <p>, 연속된 "- 항목" 줄은 <ul>
function renderBody(body) {
  let html = "", list = [];
  const flushList = () => { if (list.length) { html += `<ul>${list.map(x => `<li>${inline(x)}</li>`).join("")}</ul>`; list = []; } };
  for (const b of body) {
    if (b.startsWith(BULLET)) list.push(b.slice(1));
    else { flushList(); html += `<p>${inline(b)}</p>`; }
  }
  flushList();
  return html;
}

// "# 제목", "## 항목", "- key: value", "- 글머리표", 일반 문단, <!-- 주석 --> 을 읽는다.
function parse(md) {
  const doc = { title: "", fields: {}, body: [], entries: [] };
  let cur = doc, para = [], inComment = false;
  const flush = () => { if (para.length) { cur.body.push(para.join(" ")); para = []; } };
  for (const raw of md.replace(/\r/g, "").split("\n")) {
    let line = raw.trim();
    if (inComment) { if (line.includes("-->")) inComment = false; continue; }
    if (line.startsWith("<!--")) { if (!line.includes("-->")) inComment = true; continue; }
    let m;
    if ((m = line.match(/^#\s+(.*)/)) && cur === doc && !doc.entries.length) { flush(); doc.title = m[1]; }
    else if ((m = line.match(/^##\s+(.*)/))) { flush(); cur = { title: m[1], fields: {}, body: [], order: doc.entries.length }; doc.entries.push(cur); }
    else if ((m = line.match(/^[-*]\s+([A-Za-z][\w ]*?)\s*:\s+(.*)$/))) { flush(); cur.fields[m[1].toLowerCase()] = m[2].trim(); }
    else if ((m = line.match(/^[-*]\s+(.*)/))) { flush(); cur.body.push(BULLET + m[1]); }
    else if (!line) flush();
    else para.push(line);
  }
  flush();
  return doc;
}

/* ---------- 날짜 ---------- */

// "2026-09", "2026.9", "2026/09/15", "2026" → 정렬용 "2026-09-15"
function dateKey(s) {
  const m = String(s || "").match(/(\d{4})(?:\D+(\d{1,2}))?(?:\D+(\d{1,2}))?/);
  if (!m) return "";
  return [m[1], (m[2] || "0").padStart(2, "0"), (m[3] || "0").padStart(2, "0")].join("-");
}
function dateLabel(s) {
  const k = dateKey(s);
  if (!k) return "";
  const [y, mo] = k.split("-");
  return mo === "00" ? y : `${y}.${mo}`;
}
// 최신순. 날짜가 없는 항목은 파일에 적은 순서대로 맨 뒤에.
const byDate = entries => [...entries].sort((a, b) => {
  const x = dateKey(a.fields.date), y = dateKey(b.fields.date);
  if (x && y && x !== y) return x < y ? 1 : -1;
  if (!x !== !y) return x ? -1 : 1;
  return a.order - b.order;
});
const when = e => e.fields.period ? inline(e.fields.period) : dateLabel(e.fields.date);
const desc = e => e.body.length ? `<div class="desc">${renderBody(e.body)}</div>` : "";

// 배지 색: 아는 단어는 정해진 색, 처음 보는 단어는 이름으로 색을 골라 항상 같은 색이 나온다.
const TAG_COLORS = [
  [/^if\s*[\d.]+$/, ["#e3eef6", "#2c5b75"]],          // 임팩트 팩터: IF1.2, IF 4.5 …
  [/^q[1-4]$/, ["#edf3e3", "#4f6b22"]],                // 저널 분위: Q1–Q4
  [/\b(sci|scie|ssci|scopus|kci)\b/, ["#f1ece4", "#7a5c33"]], // 색인 종류
  [/best|award|grant|prize|honou?r/, ["#fdf1dc", "#a8650a"]],
  [/oral/, ["#fde8e8", "#c0392b"]],
  [/spotlight|highlight/, ["#fff3d6", "#b7791f"]],
  [/poster/, ["#e0f4f1", "#137a6b"]],
  [/preprint|arxiv|under review|submitted/, ["#efeff1", "#6b6b74"]],
  [/position|join|intern/, ["#e2f5ec", "#1e7a55"]],
  [/talk|invited|keynote/, ["#f1eafe", "#6d3fc4"]],
  [/workshop/, ["#e8eafd", "#4049c4"]],
  [/paper|accept|publication/, ["#e8effd", "#2563eb"]],
];
const TAG_PALETTE = [["#fde7f1", "#b4235f"], ["#e0f2fe", "#0369a1"], ["#ecfccb", "#4d7c0f"], ["#fef3c7", "#a16207"],
  ["#ede9fe", "#6d28d9"], ["#ffedd5", "#c2410c"], ["#ccfbf1", "#0f766e"], ["#f3e8ff", "#9333ea"]];
function tagStyle(t) {
  const k = t.toLowerCase();
  let c = TAG_COLORS.find(([re]) => re.test(k))?.[1];
  if (!c) { let h = 0; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0; c = TAG_PALETTE[h % TAG_PALETTE.length]; }
  return `style="--b:${c[0]};--f:${c[1]}"`;
}
const badge = (t, cls = "bd") => t ? `<span class="${cls}" ${tagStyle(t)}>${esc(t)}</span>` : "";

/* ---------- 섹션 렌더러 ---------- */

function renderProfile(doc) {
  const f = doc.fields;
  const name = doc.title || "Your Name";
  document.title = name;
  const photo = f.photo
    ? `<img class="photo" src="${esc(f.photo)}" alt="${esc(name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'photo',textContent:'PHOTO'}))">`
    : `<div class="photo">PHOTO</div>`;
  const links = PROFILE_LINKS.filter(([k]) => f[k]).map(([k, label, ic]) => {
    const href = k === "email" && !f[k].startsWith("mailto:") ? "mailto:" + f[k] : f[k];
    return `<a href="${esc(href)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor">${ICON[ic]}</svg>${label}</a>`;
  }).join("");
  return `<section id="about"><div class="hero">${photo}<div>
      <h1>${inline(name)}</h1>
      ${f.keywords ? `<div class="kw">${inline(f.keywords)}</div>` : ""}
      <div class="sub">${[f.position, f.affiliation].filter(Boolean).map(inline).join(" · ")}</div>
      <div class="links">${links}</div></div></div>
    <div class="bio">${doc.body.map(p => `<p>${inline(p)}</p>`).join("")}</div>
    ${f.stats ? `<p class="stats">${inline(f.stats)}</p>` : ""}</section>`;
}

function renderNews(doc) {
  return `<table>${byDate(doc.entries).map(e =>
    `<tr><td>${when(e)}</td><td>${badge(e.fields.type)}${inline(e.title)}${desc(e)}</td></tr>`).join("")}</table>`;
}

function renderPubs(doc) {
  const pubs = byDate(doc.entries);
  const topics = [...new Set(pubs.flatMap(p => (p.fields.topic || "").split(",").map(t => t.trim()).filter(Boolean)))];
  const filters = topics.length
    ? `<div class="filters"><button class="on" data-f="">All</button>${topics.map(t => `<button data-f="${esc(t)}">${esc(t)}</button>`).join("")}</div>`
    : "";
  let html = filters, year = null;
  for (const p of pubs) {
    const f = p.fields;
    const y = dateKey(f.date).slice(0, 4) || "Other";
    if (y !== year) { year = y; html += `<div class="year" data-year="${y}">${y}</div>`; }
    // thumb 를 적었으면 그 이미지, 아니면 images/pubs/<short 그대로 또는 소문자-하이픈>.(png|jpg|jpeg|webp) 를 찾아보고, 없으면 short 글자
    const slug = (f.short || "").trim();
    const names = [...new Set([slug, slug.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "")])].filter(Boolean);
    const cands = (f.thumb ? [f.thumb] : names.flatMap(n => THUMB_EXT.map(x => `images/pubs/${n}.${x}`))).map(encodeURI);
    const thumb = `<div class="th" data-src="${esc(cands.join("|"))}">${esc(slug)}</div>`;
    const btns = PUB_LINKS.filter(k => f[k]).map(k => `<a href="${esc(f[k])}" target="_blank" rel="noopener">${k}</a>`).join("");
    html += `<div class="pub" data-year="${y}" data-topic="${esc((f.topic || "").split(",").map(t => t.trim()).join("|"))}">${thumb}<div>
      <div class="ven">${inline(f.venue || "")}${f.tag ? f.tag.split(",").map(t => badge(t.trim(), "hl")).join("") : ""}</div>
      <h3>${inline(p.title)}</h3><div class="au">${inline(f.authors || "")}</div>${desc(p)}
      ${btns ? `<div class="act">${btns}</div>` : ""}</div></div>`;
  }
  return html;
}

const MAX_RESEARCH_TAGS = 2;  // Research 카드에 보이는 태그 수

function renderResearch(doc) {
  return `<div class="rg">${byDate(doc.entries).map(e => {
    const f = e.fields;
    const tags = (f.tag || "").split(",").map(t => t.trim()).filter(Boolean).slice(0, MAX_RESEARCH_TAGS).map(t => `<span class="rt">${esc(t)}</span>`).join("");
    const meta = [f.org, f.period].filter(Boolean).map(inline).join(" · ");
    return `<div class="rc${/^(yes|true|1)$/i.test(f.wide || "") ? " wide" : ""}">
      <div class="rh">${tags}${meta ? `<span class="rp">${meta}</span>` : ""}</div>
      <h3>${inline(e.title)}</h3><div class="rb">${renderBody(e.body)}</div>
      ${f.metric ? `<div class="met">${inline(f.metric)}</div>` : ""}</div>`;
  }).join("")}</div>`;
}

// experience / education 공용: 기간 | 제목 + role/degree + 설명
function renderTimeline(doc) {
  return `<table>${byDate(doc.entries).map(e => {
    const sub = e.fields.role || e.fields.degree;
    return `<tr><td>${when(e)}</td><td><b>${inline(e.title)}</b>${sub ? `<br><span class="mut">${inline(sub)}</span>` : ""}${desc(e)}</td></tr>`;
  }).join("")}</table>`;
}

function renderAwards(doc) {
  return `<table>${byDate(doc.entries).map(e => `<tr><td>${when(e)}</td><td>${inline(e.title)}${desc(e)}</td></tr>`).join("")}</table>`;
}

/* ---------- 조립 ---------- */

async function load(file) {
  const r = await fetch("content/" + file, { cache: "no-cache" });
  if (!r.ok) return null;
  return parse(await r.text());
}

async function main() {
  const root = document.getElementById("content");
  let profile, docs;
  try {
    [profile, ...docs] = await Promise.all([load("profile.md"), ...SECTIONS.map(s => load(s.file))]);
  } catch (e) {
    root.innerHTML = `<p class="error">content/*.md 파일을 불러오지 못했어요. 파일을 직접 열지 말고 웹 서버로 열어 주세요:<br><code>python3 -m http.server 8000</code></p>`;
    return;
  }
  const shown = SECTIONS.map((s, i) => ({ ...s, doc: docs[i] })).filter(s => s.doc && s.doc.entries.length);

  root.innerHTML = (profile ? renderProfile(profile) : "") +
    shown.map(s => `<section id="${s.id}"><h2>${s.title}</h2>${s.render(s.doc)}</section>`).join("") +
    `<footer>© ${new Date().getFullYear()} ${inline(profile?.title || "")}</footer>`;

  const navItems = [{ id: "about", title: "About" }, ...shown];
  const navHtml = navItems.map(s => `<a href="#${s.id}">${s.title}</a>`).join("");
  document.getElementById("toc").innerHTML = navHtml;
  document.getElementById("mnav").innerHTML = navHtml;

  // 논문 썸네일: 후보 경로를 차례로 시도해서 처음 열리는 이미지로 교체
  root.querySelectorAll(".th[data-src]").forEach(el => {
    const list = el.dataset.src.split("|").filter(Boolean);
    const next = () => {
      const src = list.shift();
      if (!src) return;
      const img = new Image();
      img.alt = el.textContent;
      img.onload = () => el.replaceChildren(img);
      img.onerror = next;
      img.src = src;
    };
    next();
  });

  // 논문 필터: 해당 주제만 보이고, 비게 된 연도 제목은 숨김
  root.querySelectorAll(".filters button").forEach(b => b.onclick = () => {
    root.querySelectorAll(".filters button").forEach(x => x.classList.toggle("on", x === b));
    const f = b.dataset.f;
    root.querySelectorAll(".pub").forEach(p => p.hidden = !!f && !p.dataset.topic.split("|").includes(f));
    root.querySelectorAll(".year").forEach(y => {
      y.hidden = ![...root.querySelectorAll(`.pub[data-year="${y.dataset.year}"]`)].some(p => !p.hidden);
    });
  });

  // 목차: 지금 보고 있는 섹션 표시
  const links = [...document.querySelectorAll("#toc a")];
  const spy = () => {
    let k = 0;
    links.forEach((a, i) => { const s = document.getElementById(a.hash.slice(1)); if (s && s.getBoundingClientRect().top < 120) k = i; });
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) k = links.length - 1;
    links.forEach((a, i) => a.classList.toggle("on", i === k));
  };
  addEventListener("scroll", spy, { passive: true });
  spy();
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

main();
