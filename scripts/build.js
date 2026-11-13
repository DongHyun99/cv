// 배포용 정적 HTML 만들기: content/*.md 를 assets/app.js 와 같은 렌더러로 그려서
// _site/index.html 에 미리 넣는다. JS 를 실행하지 않는 크롤러·AI 도구도 내용을 읽을 수 있다.
// 사용법: node scripts/build.js   (결과물: _site/)
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "_site");
// 배포하지 않는 것들
const SKIP = new Set([".git", ".github", ".gjc", ".omc", "_site", "scripts", "cv", "paper", "node_modules"]);

const app = require(path.join(ROOT, "assets/app.js"));
const inRoot = p => {
  const abs = path.resolve(ROOT, p);
  return abs.startsWith(ROOT + path.sep) ? abs : null;
};
app.BUILD.exists = p => { const abs = inRoot(p); return !!abs && fs.existsSync(abs); };
app.BUILD.read = p => { const abs = inRoot(p); return abs && fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null; };

const load = file => {
  const abs = path.join(ROOT, "content", file);
  return fs.existsSync(abs) ? app.parse(fs.readFileSync(abs, "utf8")) : null;
};
const page = app.renderPage(load("profile.md"), app.SECTIONS.map(s => load(s.file)));

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const fill = (re, to) => {
  if (!re.test(html)) throw new Error(`index.html 에서 ${re} 를 찾지 못했어요`);
  html = html.replace(re, () => to);
};
const escText = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
fill(/<title>[^<]*<\/title>/, `<title>${escText(page.title)}</title>`);
fill(/<nav class="mnav" id="mnav"><\/nav>/, `<nav class="mnav" id="mnav">${page.nav}</nav>`);
fill(/<nav class="toc" id="toc"><\/nav>/, `<nav class="toc" id="toc">${page.nav}</nav>`);
fill(/<main id="content">[\s\S]*?<\/main>/, `<main id="content" data-prerendered="1">${page.content}</main>`);

fs.rmSync(OUT, { recursive: true, force: true });
for (const name of fs.readdirSync(ROOT)) {
  if (!SKIP.has(name)) fs.cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}
fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`built ${path.relative(ROOT, OUT)}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
