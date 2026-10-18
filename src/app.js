const LEC_LABEL = { 6: 'Lec 6', 7: 'Lec 7', 8: 'Lec 8', cs: 'Cheat Sheet' };
const LEC_KEYS = ['6', '7', '8', 'cs'];
const TYPE_LABEL = { mc: 'เลือกตอบ', out: 'ทายผลลัพธ์', bug: 'หาจุดผิด' };
const LETTERS = ['A', 'B', 'C', 'D'];
const LEC_TO_NOTE = { 6: 'l6', 7: 'l7', 8: 'l8', cs: 'cs' };

const SECTIONS = [];
const SECTION_BY_ID = {};
for (const lec of NOTES) {
  for (const s of lec.sections) {
    const rec = { id: s.id, title: s.title, lec: lec.id, lecShort: lec.short, n: SECTIONS.length };
    SECTIONS.push(rec);
    SECTION_BY_ID[s.id] = rec;
  }
}
const NOTE_BY_ID = Object.fromEntries(NOTES.map((n) => [n.id, n]));

/* ---------- storage ---------- */
const STORE_KEY = 'js-exam-guide-v1';
let memoryOnly = false;
const blank = () => ({ read: {}, attempts: [], practice: {}, mocks: [], days: [], theme: null, last: {}, checks: {}, mockDraft: null });
let state = blank();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { memoryOnly = true; }
}
function save() {
  if (memoryOnly) return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { memoryOnly = true; toast('บันทึกลงเบราว์เซอร์ไม่ได้ ข้อมูลจะหายเมื่อปิดหน้านี้'); }
}
function markToday() {
  const k = dayKey(new Date());
  if (!state.days.includes(k)) { state.days.push(k); state.days = state.days.slice(-120); }
}

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const allQuestions = () => PRACTICE.concat(MOCK);
const Q_BY_ID = Object.fromEntries(PRACTICE.concat(MOCK).map((q) => [q.id, q]));

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
  key: '<path d="M4 7h11M4 12h16M4 17h8"/><path d="M18 5v4M16 7h4"/>',
  pencil: '<path d="M4 20l1-4L16.5 4.5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v4l2.5 1.5M9.5 3h5"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-7"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  copy: '<rect x="8" y="8" width="11" height="12" rx="1.5"/><path d="M5 16V5.5C5 4.7 5.7 4 6.5 4H16"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  print: '<path d="M7 9V4h10v5M7 17H4.5V10h15v7H17"/><path d="M7 14h10v6H7z"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.6-5.9L4 8.5"/><path d="M4 4v4.5h4.5"/>',
  warn: '<path d="M12 4 3 19.5h18z"/><path d="M12 10v4.5M12 17v.5"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.5"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.8c.6.5 1 1.2 1 2V16h5v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
};
const icon = (n, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${ICONS[n]}</svg>`;

/* ---------- syntax highlight ---------- */
const JS_KW = new Set('var let const function return if else switch case default break continue for while do in of new this class extends super constructor async await try catch finally throw typeof instanceof import from with true false null undefined static'.split(' '));
const JS_BI = new Set('console Math Number String Array Object Promise Date JSON Set Map WeakMap Symbol Boolean Error TypeError RegExp document window Iterator Atomics Float16Array Uint8Array setTimeout parseInt parseFloat alert'.split(' '));

function hlJs(code) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\[\s\S]|[^`\\])*`)|(\b\d[\d_]*\.?\d*(?:e[+-]?\d+)?n?\b)|([A-Za-z_$][\w$]*)|([\s\S])/g;
  let out = '';
  let m;
  while ((m = re.exec(code))) {
    if (m[1]) out += `<span class="tk-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="tk-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="tk-num">${esc(m[3])}</span>`;
    else if (m[4]) {
      const w = m[4];
      const next = code.slice(re.lastIndex).match(/^\s*\(/);
      if (JS_KW.has(w)) out += `<span class="tk-kw">${w}</span>`;
      else if (JS_BI.has(w)) out += `<span class="tk-bi">${w}</span>`;
      else if (next) out += `<span class="tk-fn">${w}</span>`;
      else out += w;
    } else out += esc(m[5]);
  }
  return out;
}
function hlHtml(code) {
  // highlight tags only; embedded JS lines inside <script> are left plain-escaped except comments
  return esc(code)
    .replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="tk-tag">$2</span>')
    .replace(/\s([a-z-]+)=(&quot;.*?&quot;)/g, ' <span class="tk-attr">$1</span>=<span class="tk-str">$2</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="tk-com">$1</span>');
}
function hlCss(code) {
  return esc(code).replace(/([.#]?[\w-]+)(\s*\{)/g, '<span class="tk-fn">$1</span>$2').replace(/([\w-]+)(:)/g, '<span class="tk-kw">$1</span>$2');
}
function highlight(code, lang) {
  if (lang === 'html') return hlHtml(code);
  if (lang === 'css') return hlCss(code);
  return hlJs(code);
}

function codeBox(code, lang = 'js', out = null) {
  const label = { js: 'JavaScript', html: 'HTML', css: 'CSS' }[lang] || lang;
  return `<div class="codebox"><div class="code-head"><span>${label}</span><button class="copy" type="button" data-copy aria-label="คัดลอกโค้ด">${icon('copy', 15)}<span>คัดลอก</span></button></div>` +
    `<pre class="code-pre"><code>${highlight(code, lang)}</code></pre>` +
    (out ? `<div class="code-out"><span class="lbl">ผลลัพธ์ (Output)</span><pre>${esc(out)}</pre></div>` : '') + '</div>';
}

/* ---------- toast / modal ---------- */
function toast(msg) {
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  box.appendChild(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 240); }, 2600);
}
function confirmBox(title, body, okLabel, danger) {
  return new Promise((resolve) => {
    const d = $('#modal');
    d.innerHTML = `<h2>${esc(title)}</h2><p>${esc(body)}</p><div class="actions"><button class="btn" data-no>ยกเลิก</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-yes>${esc(okLabel)}</button></div>`;
    const done = (v) => { d.close(); resolve(v); };
    $('[data-no]', d).onclick = () => done(false);
    $('[data-yes]', d).onclick = () => done(true);
    d.oncancel = () => resolve(false);
    d.showModal();
  });
}

/* ---------- theme ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $$('[data-theme-btn]').forEach((b) => {
    b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
    b.setAttribute('aria-label', t === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด');
  });
}
function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  state.theme = next; applyTheme(next); save();
}

/* ---------- derived numbers ---------- */
const readCount = () => SECTIONS.filter((s) => state.read[s.id]).length;
const practiceDone = () => Object.keys(state.practice).filter((id) => Q_BY_ID[id]).length;
const accuracy = () => { const a = state.attempts; return a.length ? pct(a.filter((x) => x.ok).length, a.length) : null; };
const bestMock = () => (state.mocks.length ? Math.max(...state.mocks.map((m) => m.pct)) : null);

function logAttempt(q, ok, mode) {
  state.attempts.push({ qid: q.id, topic: q.topic, lec: String(q.lec), ok, mode, ts: Date.now() });
  if (state.attempts.length > 1500) state.attempts = state.attempts.slice(-1500);
  markToday();
}

function nextAction() {
  const unread = SECTIONS.find((s) => !state.read[s.id]);
  if (unread && readCount() < SECTIONS.length * 0.5) return { text: 'อ่านต่อ: ' + unread.title, sub: `${unread.lecShort} · หัวข้อที่ ${unread.n + 1} จาก ${SECTIONS.length}`, href: `#/notes/${unread.lec}/${unread.id}` };
  if (practiceDone() < PRACTICE.length) return { text: 'ฝึกทำข้อสอบต่อ', sub: `ทำแล้ว ${practiceDone()} จาก ${PRACTICE.length} ข้อ`, href: '#/practice' };
  if (!state.mocks.length) return { text: 'ลองทำ Mock Exam 20 ข้อ', sub: 'จำลองสอบจริง ไม่เฉลยจนกว่าจะส่ง', href: '#/mock' };
  const weak = weakTopics(state.attempts)[0];
  if (weak) { const s = SECTION_BY_ID[weak.topic]; return { text: 'ทบทวน: ' + s.title, sub: `แม่น ${Math.round(weak.acc * 100)}% ใน ${weak.n} ครั้งล่าสุด`, href: `#/notes/${s.lec}/${s.id}` }; }
  if (unread) return { text: 'อ่านต่อ: ' + unread.title, sub: unread.lecShort, href: `#/notes/${unread.lec}/${unread.id}` };
  return { text: 'ไล่ดูหน้าทบทวนก่อนสอบ', sub: 'เช็กลิสต์สิ่งที่ต้องจำ', href: '#/last' };
}

/* ---------- router ---------- */
const NAV = [
  ['dashboard', 'หน้าหลัก', 'Home', 'home'],
  ['notes', 'อ่านสรุป', 'Notes', 'book'],
  ['concepts', 'ศัพท์และกฎ', 'Key', 'key'],
  ['practice', 'ฝึกทำ', 'Quiz', 'pencil'],
  ['mock', 'จำลองสอบ', 'Mock', 'timer'],
  ['progress', 'ความคืบหน้า', 'Stats', 'chart'],
  ['last', 'ทบทวนก่อนสอบ', 'Last', 'list'],
];
const PAGES = {};
let cleanup = null;

function route() {
  const hash = location.hash.replace(/^#\/?/, '') || 'dashboard';
  const [page, a, b] = hash.split('/');
  const name = PAGES[page] ? page : 'dashboard';
  if (cleanup) { cleanup(); cleanup = null; }
  closeNav();
  $$('.nav a').forEach((l) => (l.dataset.page === name ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current')));
  $('#crumb').textContent = NAV.find((n) => n[0] === name)[1];
  const view = $('#view');
  view.innerHTML = '';
  $('.readbar').classList.remove('on');
  const root = document.createElement('div');
  root.className = 'page';
  view.appendChild(root);
  cleanup = PAGES[name](root, a, b) || null;
  if (!(name === 'notes' && b)) window.scrollTo(0, 0);
  document.title = NAV.find((n) => n[0] === name)[1] + ' · JS Exam Guide';
}

function buildShell() {
  $('#nav').innerHTML = NAV.map(([id, th, en, ic]) => `<a href="#/${id}" data-page="${id}">${icon(ic)}<span>${th}</span><span class="nav-en">${en}</span></a>`).join('');
  $('#menu-btn').innerHTML = icon('menu');
}
function openNav() { document.body.classList.add('nav-open'); }
function closeNav() { document.body.classList.remove('nav-open'); }

function railStatus() {
  const r = readCount();
  $('#rail-read').textContent = `${r}/${SECTIONS.length}`;
  $('#rail-bar').style.width = pct(r, SECTIONS.length) + '%';
}

/* ---------- dashboard ---------- */
PAGES.dashboard = (root) => {
  const act = nextAction();
  const hr = new Date().getHours();
  const greet = hr < 5 ? 'ดึกแล้วนะ' : hr < 12 ? 'อรุณสวัสดิ์' : hr < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';
  const r = readCount();
  const p = practiceDone();
  const mockBest = bestMock();
  const weak = weakTopics(state.attempts).slice(0, 4);

  const steps = [
    ['01', 'อ่านสรุปให้ครบ', `${r} จาก ${SECTIONS.length} หัวข้อ`, pct(r, SECTIONS.length), '#/notes/l6', r === SECTIONS.length],
    ['02', 'ฝึกทำข้อสอบ', `${p} จาก ${PRACTICE.length} ข้อ`, pct(p, PRACTICE.length), '#/practice', p === PRACTICE.length],
    ['03', 'จำลองสอบ 20 ข้อ', state.mocks.length ? `ทำแล้ว ${state.mocks.length} รอบ ดีที่สุด ${mockBest}%` : 'ยังไม่เคยทำ', state.mocks.length ? 100 : 0, '#/mock', state.mocks.length > 0],
  ];

  const readOf = (noteId) => { const secs = SECTIONS.filter((s) => s.lec === noteId); return [secs.filter((s) => state.read[s.id]).length, secs.length]; };

  const chapters = ['6', '7', '8'].map((k) => {
    const note = NOTE_BY_ID[LEC_TO_NOTE[k]];
    const [rd, total] = readOf(note.id);
    const qs = PRACTICE.filter((q) => String(q.lec) === k);
    const qd = qs.filter((q) => state.practice[q.id] !== undefined).length;
    return `<article class="chapter">
      <p class="ch-num mono"><small>LECTURE</small>${note.num}</p>
      <h3>${esc(note.title)}</h3>
      <p class="ch-sub">${esc(note.sub)}</p>
      <div class="ch-prog"><span>อ่านแล้ว</span><b class="mono">${rd}/${total}</b></div>
      <div class="bar" role="img" aria-label="${note.short} อ่านแล้ว ${rd} จาก ${total} หัวข้อ"><i data-w="${pct(rd, total)}"></i></div>
      <div class="ch-links"><a class="btn btn-sm" href="#/notes/${note.id}">อ่านสรุป</a><a class="btn btn-sm" href="#/practice" data-flec="${k}">ฝึก ${qd}/${qs.length}</a></div>
    </article>`;
  }).join('');

  const cs = NOTE_BY_ID.cs;
  const [csRead, csTotal] = readOf(cs.id);

  root.innerHTML = `
  <header class="home-head">
    <p class="kicker">${greet} · ITDS241 JavaScript</p>
    <h1>ติวคืนก่อนสอบ ให้<em>ครบทั้ง 3 บท</em></h1>
    <p class="lead">สรุปจากสไลด์ Lec 6, 7, 8 พร้อม Cheat Sheet ของอาจารย์ มีข้อสอบฝึกและข้อสอบจำลอง และระบบบอกว่าหัวข้อไหนควรกลับไปอ่าน</p>
    <div class="actions">
      <a class="btn btn-primary btn-lg" href="${act.href}">${esc(act.text)} ${icon('arrow', 18)}</a>
      <a class="btn btn-lg" href="#/last">ทบทวนก่อนสอบ</a>
    </div>
    <p class="next-sub">${esc(act.sub)}</p>
  </header>
  <ol class="steps" aria-label="แผนก่อนสอบ">
    ${steps.map((s) => `<li class="${s[5] ? 'done' : ''}"><a href="${s[4]}"><span class="n">${s[0]}</span><b><span>${s[1]}</span><span class="mono">${s[3]}%</span></b><small>${esc(s[2])}</small><div class="bar"><i data-w="${s[3]}"></i></div></a></li>`).join('')}
  </ol>
  <section class="home-sec" aria-labelledby="toc-h">
    <h2 id="toc-h">สารบัญ</h2>
    <p class="sub">เลือกบทที่จะอ่านหรือฝึก ตัวเลขฝึกคือจำนวนข้อที่ตอบแล้วในบทนั้น</p>
    <div class="chapters">${chapters}</div>
    <a class="cs-line" href="#/notes/cs"><span><b>${esc(cs.short)}</b> ของอาจารย์ · ตารางอ้างอิง String / Array / Math / Date</span><span class="mono">${csRead}/${csTotal} ${icon('arrow', 16)}</span></a>
  </section>
  <section class="home-sec" aria-labelledby="weak-h">
    <h2 id="weak-h">หัวข้อที่ควรกลับไปทบทวน</h2>
    <p class="sub">คิดจากการตอบ ${WEAK_WINDOW} ครั้งล่าสุดของแต่ละหัวข้อ แม่นต่ำกว่า 70% และตอบแล้วอย่างน้อย 2 ครั้ง</p>
    ${weak.length ? `<ul class="weak-list">${weak.map((w) => { const s = SECTION_BY_ID[w.topic]; return `<li><a class="weak-item" href="#/notes/${s.lec}/${s.id}"><b>${esc(s.title)}</b><span class="pct">${Math.round(w.acc * 100)}%</span><small>${s.lecShort} · ตอบ ${w.n} ครั้งล่าสุด กดเพื่ออ่านหัวข้อนี้</small></a></li>`; }).join('')}</ul>` : `<div class="empty">${state.attempts.length < 2 ? '<b>ยังไม่มีข้อมูลพอ</b> ทำ Practice Quiz สักสองสามข้อ ระบบจะเริ่มชี้หัวข้อที่ควรอ่านซ้ำ' : '<b>ยังไม่พบหัวข้อที่อ่อน</b> ทำต่อเพื่อให้ผลแม่นขึ้น'}</div>`}
  </section>`;
  $$('[data-flec]', root).forEach((a) => a.addEventListener('click', () => { state.last.fLec = a.dataset.flec; save(); }));
  requestAnimationFrame(() => $$('[data-w]', root).forEach((el) => { el.style.width = el.dataset.w + '%'; }));
};

/* ---------- notes ---------- */
function renderBlock(b) {
  switch (b[0]) {
    case 'p': return `<p>${b[1]}</p>`;
    case 'h': return `<h3>${b[1]}</h3>`;
    case 'list': return `<ul>${b[1].map((i) => `<li>${i}</li>`).join('')}</ul>`;
    case 'key': return `<div class="callout key"><div class="callout-title">${icon('bulb', 18)}<span>${b[1]}</span></div>${b[2]}</div>`;
    case 'warn': return `<div class="callout warn"><div class="callout-title">${icon('warn', 18)}<span>ข้อควรระวัง</span></div>${b[1]}</div>`;
    case 'note': return `<div class="callout note"><div class="callout-title">${icon('info', 16)}<span>หมายเหตุ</span></div>${b[1]}</div>`;
    case 'code': return codeBox(b[2], b[1], b[3]);
    case 'table': return `<div class="tbl-wrap"><table><thead><tr>${b[1].map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${b[2].map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    default: return '';
  }
}

PAGES.notes = (root, lecId, secId) => {
  const lec = NOTE_BY_ID[lecId] || NOTES[0];
  const idx = NOTES.indexOf(lec);
  root.innerHTML = `
  <div class="notes-bar">
    <div class="seg grow" role="tablist" aria-label="เลือกบท">${NOTES.map((n) => `<button role="tab" aria-selected="${n.id === lec.id}" data-lec="${n.id}">${n.short}</button>`).join('')}</div>
    <button class="btn btn-sm toc-btn" type="button" aria-expanded="false">สารบัญ</button>
  </div>
  <div class="reader">
    <article>
      <header class="lec-head"><div class="num" aria-hidden="true">${lec.num}</div><h1>${esc(lec.title)}</h1><p>${esc(lec.sub)}</p></header>
      ${lec.sections.map((s, i) => `
      <section class="sec" id="${s.id}" data-open="true" data-id="${s.id}">
        <div class="sec-head">
          <button class="sec-toggle" type="button" aria-expanded="true" aria-controls="b-${s.id}"><span class="idx">${String(i + 1).padStart(2, '0')}</span><h2>${esc(s.title)}</h2><span class="chev">${icon('chev', 18)}</span></button>
          <button class="read-btn" type="button" aria-pressed="${!!state.read[s.id]}">${icon('check', 16)}<span>${state.read[s.id] ? 'อ่านแล้ว' : 'ทำเครื่องหมายว่าอ่านแล้ว'}</span></button>
        </div>
        <div class="sec-body" id="b-${s.id}"><div class="sec-inner">${s.blocks.map(renderBlock).join('')}</div></div>
      </section>`).join('')}
      <div class="sec-foot">
        ${idx > 0 ? `<a class="btn" href="#/notes/${NOTES[idx - 1].id}">${icon('back', 18)} ${NOTES[idx - 1].short}</a>` : '<span></span>'}
        ${idx < NOTES.length - 1 ? `<a class="btn btn-primary" href="#/notes/${NOTES[idx + 1].id}">${NOTES[idx + 1].short} ${icon('arrow', 18)}</a>` : `<a class="btn btn-primary" href="#/practice">ไปฝึกทำข้อสอบ ${icon('arrow', 18)}</a>`}
      </div>
    </article>
    <nav class="toc" aria-label="สารบัญ ${esc(lec.short)}">
      <h2>สารบัญ</h2>
      <ol>${lec.sections.map((s) => `<li><a href="#/notes/${lec.id}/${s.id}" data-toc="${s.id}" class="${state.read[s.id] ? 'is-read' : ''}">${esc(s.title)}</a></li>`).join('')}</ol>
    </nav>
  </div>`;

  $$('[data-lec]', root).forEach((b) => b.addEventListener('click', () => { location.hash = '#/notes/' + b.dataset.lec; }));
  const toc = $('.toc', root);
  const tocBtn = $('.toc-btn', root);
  tocBtn.addEventListener('click', () => { const o = toc.classList.toggle('open'); tocBtn.setAttribute('aria-expanded', o); });
  $$('[data-toc]', root).forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const sec = document.getElementById(a.dataset.toc);
    if (sec.dataset.open === 'false') setOpen(sec, true);
    sec.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#/notes/${lec.id}/${a.dataset.toc}`);
    toc.classList.remove('open');
  }));
  function setOpen(sec, open) {
    sec.dataset.open = String(open);
    $('.sec-toggle', sec).setAttribute('aria-expanded', open);
  }
  $$('.sec', root).forEach((sec) => {
    $('.sec-toggle', sec).addEventListener('click', () => setOpen(sec, sec.dataset.open !== 'true'));
    const rb = $('.read-btn', sec);
    rb.addEventListener('click', () => {
      const id = sec.dataset.id;
      const now = !state.read[id];
      if (now) state.read[id] = true; else delete state.read[id];
      markToday(); save(); railStatus();
      rb.setAttribute('aria-pressed', now);
      $('span', rb).textContent = now ? 'อ่านแล้ว' : 'ทำเครื่องหมายว่าอ่านแล้ว';
      $(`[data-toc="${id}"]`, root).classList.toggle('is-read', now);
      if (now) {
        toast(`อ่านแล้ว ${readCount()} จาก ${SECTIONS.length} หัวข้อ`);
      }
    });
  });
  bindCopy(root);

  const bar = $('.readbar');
  const fill = $('i', bar);
  bar.classList.add('on');
  const secs = $$('.sec', root);
  const tocLinks = $$('[data-toc]', root);
  const art = $('article', root);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const r = art.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      fill.style.transform = `scaleX(${p})`;
      let cur = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top < 160) cur = s;
      tocLinks.forEach((a) => a.classList.toggle('is-current', a.dataset.toc === cur.id));
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (secId && document.getElementById(secId)) {
    requestAnimationFrame(() => document.getElementById(secId).scrollIntoView({ block: 'start' }));
  }
  return () => window.removeEventListener('scroll', onScroll);
};

function bindCopy(root) {
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = $('.code-pre', btn.closest('.codebox')).textContent;
    let ok = false;
    try {
      // writeText can hang without focus or permission, so fall back after a short wait.
      await Promise.race([navigator.clipboard.writeText(text), new Promise((_, no) => setTimeout(no, 700))]);
      ok = true;
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
    }
    if (ok) {
      btn.classList.add('done');
      $('span', btn).textContent = 'คัดลอกแล้ว';
      toast('คัดลอกโค้ดแล้ว');
      setTimeout(() => { btn.classList.remove('done'); $('span', btn).textContent = 'คัดลอก'; }, 1600);
    } else toast('คัดลอกไม่สำเร็จ ลองลากเลือกข้อความเอง');
  });
}

/* ---------- key concepts ---------- */
PAGES.concepts = (root) => {
  const link = (topic) => { const s = SECTION_BY_ID[topic]; return s ? `<a href="#/notes/${s.lec}/${s.id}">อ่านหัวข้อ: ${esc(s.title)}</a>` : ''; };
  const blocks = {
    syntax: KEYS.syntax.map((s) => ({ text: s.t + ' ' + s.code, html: `<div class="syn"><h3>${esc(s.t)}</h3>${codeBox(s.code, 'js')}</div>` })),
    compare: KEYS.compare.map((c) => ({ text: c.title + ' ' + c.rows.flat().join(' '), html: `<div class="cmp"><h3>${esc(c.title)}</h3><div class="tbl-wrap"><table><thead><tr>${c.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${c.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${link(c.topic)}</div>` })),
    pitfalls: KEYS.pitfalls.map((p) => ({ text: p.t + ' ' + p.d, html: `<div class="pit"><b>${icon('warn', 17)}${esc(p.t)}</b><p>${esc(p.d)}</p>${link(p.topic)}</div>` })),
    terms: KEYS.terms.map((t) => ({ text: t.t + ' ' + t.d, html: `<div class="term"><b>${esc(t.t)}</b><p>${esc(t.d)}</p>${link(t.topic)}</div>` })),
  };
  const meta = [['syntax', 'Syntax ที่ต้องจำ', 'syn-grid'], ['compare', 'ตารางเทียบจุดที่สับสนง่าย', 'cmp-grid'], ['pitfalls', 'ข้อควรระวัง', 'pit-list'], ['terms', 'คำศัพท์สำคัญ', 'term-list']];
  root.innerHTML = `
    <header class="page-head"><div class="kicker">Key Concepts</div><h1>ศัพท์ ไวยากรณ์ และกับดัก</h1><p>รวมสิ่งที่ต้องรู้จากสไลด์ทั้ง 3 บทและ Cheat Sheet พิมพ์คำค้นเพื่อกรองทุกหมวดพร้อมกัน</p></header>
    <div class="search"><input type="search" id="kc-q" placeholder="ค้นหา เช่น closure, switch, splice" aria-label="ค้นหา Key Concepts" autocomplete="off"></div>
    <div id="kc-body"></div>`;
  const body = $('#kc-body', root);
  const draw = (q) => {
    const needle = q.trim().toLowerCase();
    let any = false;
    body.innerHTML = meta.map(([key, title, cls]) => {
      const items = blocks[key].filter((b) => !needle || b.text.toLowerCase().includes(needle));
      if (!items.length) return '';
      any = true;
      return `<section class="kc-block"><h2>${title}<small>${items.length}</small></h2><div class="${cls}">${items.map((i) => i.html).join('')}</div></section>`;
    }).join('') || '';
    if (!any) body.innerHTML = `<div class="empty" style="margin-top:1.5rem"><b>ไม่พบ "${esc(q)}"</b> ลองคำสั้นลง หรือคำภาษาอังกฤษจากสไลด์</div>`;
  };
  draw('');
  $('#kc-q', root).addEventListener('input', (e) => draw(e.target.value));
  bindCopy(root);
};

/* ---------- quiz rendering ---------- */
function optionsFor(q) {
  const order = shuffledOrder(q.id, q.opts.length);
  return order.map((orig) => ({ orig, text: q.opts[orig] }));
}
function questionBody(q) {
  return `<div class="q-text">${esc(q.q)}</div>${q.code ? codeBox(q.code, q.lang || 'js') : ''}`;
}
function optionHtml(o, i, q, cls = '') {
  const isCode = q.type === 'out' || o.text.includes('\n');
  return `<li><button type="button" class="opt ${isCode ? 'is-code' : ''} ${cls}" data-orig="${o.orig}" data-pos="${i}"><span class="opt-key">${LETTERS[i]}</span><span class="opt-txt">${esc(o.text)}</span><span class="mark"></span></button></li>`;
}
const markSvg = (ok) => icon(ok ? 'check' : 'x', 22);

/* ---------- practice ---------- */
PAGES.practice = (root) => {
  let fLec = state.last.fLec || 'all';
  let fType = state.last.fType || 'all';
  let list = [];
  let cur = 0;
  const filtered = () => PRACTICE.filter((q) => (fLec === 'all' || String(q.lec) === fLec) && (fType === 'all' || q.type === fType));

  function shell() {
    root.innerHTML = `
    <header class="page-head"><div class="kicker">Practice Quiz · ${PRACTICE.length} ข้อ</div><h1>ฝึกทำข้อสอบ</h1><p>ตอบแล้วเฉลยทันทีพร้อมคำอธิบาย และลิงก์กลับไปหัวข้อที่เกี่ยวข้อง กดตัวเลข 1–4 เพื่อเลือกคำตอบ กด Enter เพื่อไปข้อถัดไป</p></header>
    <div class="q-tools">
      <div class="grp"><span>บท</span><div class="seg" id="f-lec">${['all', ...LEC_KEYS].map((k) => `<button aria-pressed="${fLec === k}" data-v="${k}">${k === 'all' ? 'ทั้งหมด' : LEC_LABEL[k]}</button>`).join('')}</div></div>
      <div class="grp"><span>ชนิด</span><div class="seg" id="f-type">${['all', 'mc', 'out', 'bug'].map((k) => `<button aria-pressed="${fType === k}" data-v="${k}">${k === 'all' ? 'ทั้งหมด' : TYPE_LABEL[k]}</button>`).join('')}</div></div>
      <button class="btn btn-sm" id="reset-practice">${icon('reset', 16)} ทำใหม่ทั้งหมด</button>
    </div>
    <div id="quiz-area"></div>`;
    $('#f-lec', root).onclick = (e) => { const b = e.target.closest('button'); if (b) { fLec = b.dataset.v; state.last.fLec = fLec; save(); cur = 0; shell(); start(); } };
    $('#f-type', root).onclick = (e) => { const b = e.target.closest('button'); if (b) { fType = b.dataset.v; state.last.fType = fType; save(); cur = 0; shell(); start(); } };
    $('#reset-practice', root).onclick = async () => {
      if (await confirmBox('ทำใหม่ทั้งหมด?', 'ล้างคำตอบที่ทำไว้ในหน้า Practice (ประวัติคะแนนรวมยังอยู่ในหน้าความคืบหน้า)', 'ล้างคำตอบ', true)) {
        state.practice = {}; save(); cur = 0; start(); toast('ล้างคำตอบ Practice แล้ว');
      }
    };
  }

  function start() {
    list = filtered();
    if (cur >= list.length) cur = 0;
    draw();
  }

  function draw() {
    const area = $('#quiz-area', root);
    if (!list.length) { area.innerHTML = '<div class="empty"><b>ไม่มีข้อที่ตรงตัวกรอง</b> ลองเปลี่ยนบทหรือชนิดข้อสอบ</div>'; return; }
    const q = list[cur];
    const opts = optionsFor(q);
    const picked = state.practice[q.id];
    const answered = picked !== undefined;
    const doneCount = list.filter((x) => state.practice[x.id] !== undefined).length;

    area.innerHTML = `
    <div class="quiz">
      <div>
        <div class="q-card">
          <div class="q-meta"><span class="no">ข้อ ${cur + 1}/${list.length}</span><span class="chip acc">${LEC_LABEL[q.lec]}</span><span class="chip">${TYPE_LABEL[q.type]}</span></div>
          ${questionBody(q)}
          <ul class="opts" role="group" aria-label="ตัวเลือกคำตอบ">${opts.map((o, i) => optionHtml(o, i, q)).join('')}</ul>
          <div id="explain"></div>
          <div class="q-foot">
            <button class="btn" id="prev" ${cur === 0 ? 'disabled' : ''}>${icon('back', 18)} ก่อนหน้า</button>
            <span class="muted mono" style="font-size:.85rem">ทำแล้ว ${doneCount}/${list.length}</span>
            <button class="btn btn-primary" id="next">${cur === list.length - 1 ? 'ดูสรุป' : 'ข้อถัดไป'} ${icon('arrow', 18)}</button>
          </div>
        </div>
      </div>
      <aside class="qnav" aria-label="ตัวนำทางข้อสอบ">
        <h2>เลือกข้อ</h2>
        <div class="qdots">${list.map((x, i) => { const p = state.practice[x.id]; const c = p === undefined ? '' : p === x.ans ? 'ok' : 'bad'; return `<button class="qdot ${c}" data-i="${i}" aria-label="ข้อ ${i + 1}${c === 'ok' ? ' ตอบถูก' : c === 'bad' ? ' ตอบผิด' : ''}" ${i === cur ? 'aria-current="true"' : ''}>${i + 1}</button>`; }).join('')}</div>
        <div class="legend"><span><i style="background:var(--ok-soft);border:1px solid var(--ok)"></i>ถูก</span><span><i style="background:var(--bad-soft);border:1px solid var(--bad)"></i>ผิด</span><span><i style="background:var(--surface);border:1px solid var(--line-strong)"></i>ยังไม่ทำ</span></div>
      </aside>
    </div>`;

    const optBtns = $$('.opt', area);
    const showResult = (orig, fresh) => {
      const ok = orig === q.ans;
      optBtns.forEach((b) => {
        const o = Number(b.dataset.orig);
        b.disabled = true;
        $('.mark', b).innerHTML = o === q.ans ? markSvg(true) : o === orig ? markSvg(false) : '';
        if (o === q.ans) b.classList.add('correct', ...(fresh && ok ? ['pop'] : []));
        else if (o === orig) b.classList.add('wrong', ...(fresh ? ['shake'] : []));
        else b.classList.add('dim');
      });
      const sec = SECTION_BY_ID[q.topic];
      $('#explain', area).innerHTML = `<div class="explain ${ok ? 'ok' : 'bad'}" role="status"><h3>${markSvg(ok)} ${ok ? 'ถูกต้อง' : 'ยังไม่ถูก'}</h3><p>${esc(q.why)}</p><a class="btn btn-sm go" href="#/notes/${sec.lec}/${sec.id}">${icon('book', 16)} อ่านหัวข้อ: ${esc(sec.title)}</a></div>`;
    };
    const choose = (orig) => {
      if (state.practice[q.id] !== undefined) return;
      state.practice[q.id] = orig;
      const ok = orig === q.ans;
      logAttempt(q, ok, 'practice');
      save(); railStatus();
      showResult(orig, true);
      const dot = $(`.qdot[data-i="${cur}"]`, area);
      dot.classList.add(ok ? 'ok' : 'bad');
      const n = list.filter((x) => state.practice[x.id] !== undefined).length;
      $('.q-foot .mono', area).textContent = `ทำแล้ว ${n}/${list.length}`;
    };
    optBtns.forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.orig))));
    if (answered) showResult(picked, false);

    const go = (i) => { cur = i; draw(); $('.q-card', root).scrollIntoView({ block: 'nearest' }); };
    $('#prev', area).onclick = () => go(cur - 1);
    $('#next', area).onclick = () => (cur === list.length - 1 ? summary() : go(cur + 1));
    $$('.qdot', area).forEach((d) => d.addEventListener('click', () => go(Number(d.dataset.i))));
  }

  function summary() {
    const area = $('#quiz-area', root);
    const done = list.filter((q) => state.practice[q.id] !== undefined);
    const right = done.filter((q) => state.practice[q.id] === q.ans).length;
    const wrong = done.length - right;
    const sc = scoreExam(list, state.practice);
    area.innerHTML = `
    <div class="result">
      <div class="score-big"><span data-count="${right}">0</span><small> / ${list.length}</small></div>
      <p>${done.length < list.length ? `ยังไม่ได้ทำอีก ${list.length - done.length} ข้อ ` : ''}${wrong ? `ผิด ${wrong} ข้อ ลองทำเฉพาะข้อที่ผิดซ้ำเพื่อเก็บให้ครบ` : done.length === list.length ? 'ถูกครบทุกข้อในชุดนี้' : 'ตอบถูกทุกข้อที่ทำไป'}</p>
      <div class="lec-rows">${LEC_KEYS.filter((k) => sc.byLec[k]).map((k) => `<div class="lec-row"><span class="tag">${LEC_LABEL[k]}</span><div class="bar ${sc.byLec[k][0] === sc.byLec[k][1] ? 'ok' : ''}"><i data-w="${pct(sc.byLec[k][0], sc.byLec[k][1])}"></i></div><span class="pct">${sc.byLec[k][0]}/${sc.byLec[k][1]}</span></div>`).join('')}</div>
      <div class="actions">
        ${wrong ? '<button class="btn btn-primary" id="redo-wrong">ทำเฉพาะข้อที่ผิดอีกครั้ง</button>' : ''}
        <button class="btn" id="review-all">กลับไปดูทุกข้อ</button>
        <a class="btn" href="#/progress">ดูความคืบหน้า</a>
      </div>
    </div>`;
    countUp($('[data-count]', area));
    requestAnimationFrame(() => $$('[data-w]', area).forEach((el) => { el.style.width = el.dataset.w + '%'; }));
    $('#review-all', area).onclick = () => { cur = 0; draw(); };
    const rw = $('#redo-wrong', area);
    if (rw) rw.onclick = () => {
      list.forEach((q) => { if (state.practice[q.id] !== q.ans) delete state.practice[q.id]; });
      save(); cur = list.findIndex((q) => state.practice[q.id] === undefined); draw();
    };
  }

  const onKey = (e) => {
    const t = e.target instanceof Element ? e.target : document.body;
    if (t.closest('input, textarea, dialog')) return;
    const area = $('#quiz-area', root);
    if (!area || !$('.opt', area)) return;
    if (/^[1-4]$/.test(e.key)) {
      const b = $$('.opt', area)[Number(e.key) - 1];
      if (b && !b.disabled) b.click();
    } else if (e.key === 'Enter' && !t.closest('button')) {
      const n = $('#next', area); if (n) n.click();
    }
  };
  document.addEventListener('keydown', onKey);
  shell();
  const firstOpen = PRACTICE.findIndex((q) => state.practice[q.id] === undefined);
  list = filtered();
  cur = fLec === 'all' && fType === 'all' && firstOpen > 0 ? firstOpen : 0;
  draw();
  return () => document.removeEventListener('keydown', onKey);
};

function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion() || target === 0) { el.textContent = target; return; }
  const t0 = performance.now();
  const dur = 900;
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- mock exam ---------- */
const fmtTime = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

PAGES.mock = (root) => {
  let timerId = null;
  let draft = state.mockDraft;
  let cur = 0;

  function intro() {
    const last = state.mocks[state.mocks.length - 1];
    root.innerHTML = `
    <header class="page-head"><div class="kicker">Mock Exam</div><h1>จำลองสอบ ${MOCK.length} ข้อ</h1><p>ชุดข้อสอบนี้แยกจาก Practice ทั้งหมด จัดสัดส่วนตามบท ไม่เฉลยระหว่างทำ เฉลยพร้อมคำอธิบายหลังกดส่ง</p></header>
    <div class="card rules">
      <h2>กติกา</h2>
      <ul>
        <li>ทั้งหมด ${MOCK.length} ข้อ: Lec 6 จำนวน 7 ข้อ, Lec 7 จำนวน 7 ข้อ, Lec 8 จำนวน 4 ข้อ, Cheat Sheet จำนวน 2 ข้อ</li>
        <li>เลือกตอบได้ เปลี่ยนคำตอบได้ และข้ามไปข้ออื่นได้จนกว่าจะกดส่ง</li>
        <li>เวลานับขึ้นให้ดูเอง ไม่มีการตัดเวลา</li>
        <li>ข้อที่ไม่ตอบนับเป็นผิด ไม่มีคะแนนติดลบ</li>
      </ul>
      <div class="mock-meta"><div><b>${MOCK.length}</b><span>ข้อ</span></div><div><b>${state.mocks.length}</b><span>รอบที่ทำแล้ว</span></div><div><b>${last ? last.pct + '%' : '-'}</b><span>คะแนนรอบล่าสุด</span></div></div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap">
        ${draft ? `<button class="btn btn-primary" id="resume">ทำต่อจากที่ค้าง (ตอบแล้ว ${Object.keys(draft.answers).length} ข้อ)</button><button class="btn" id="fresh">เริ่มรอบใหม่</button>` : '<button class="btn btn-primary" id="begin">เริ่มทำข้อสอบ</button>'}
      </div>
    </div>`;
    const begin = (fresh) => {
      if (fresh || !draft) { draft = { answers: {}, start: Date.now() }; state.mockDraft = draft; save(); }
      cur = 0; exam();
    };
    if (draft) { $('#resume', root).onclick = () => begin(false); $('#fresh', root).onclick = () => begin(true); } else $('#begin', root).onclick = () => begin(true);
  }

  function exam() {
    const q = MOCK[cur];
    const opts = optionsFor(q);
    const sel = draft.answers[q.id];
    const answered = Object.keys(draft.answers).length;
    root.innerHTML = `
    <div class="mock-top"><div><span class="mono" style="font-weight:600">Mock Exam</span> <span class="muted">· ตอบแล้ว ${answered}/${MOCK.length}</span></div><span class="timer" id="timer" role="timer" aria-label="เวลาที่ใช้">00:00</span></div>
    <div class="quiz">
      <div>
        <div class="q-card">
          <div class="q-meta"><span class="no">ข้อ ${cur + 1}/${MOCK.length}</span><span class="chip acc">${LEC_LABEL[q.lec]}</span><span class="chip">${TYPE_LABEL[q.type]}</span></div>
          ${questionBody(q)}
          <ul class="opts" role="group" aria-label="ตัวเลือกคำตอบ">${opts.map((o, i) => optionHtml(o, i, q, sel === o.orig ? 'sel' : '')).join('')}</ul>
          <div class="q-foot">
            <button class="btn" id="prev" ${cur === 0 ? 'disabled' : ''}>${icon('back', 18)} ก่อนหน้า</button>
            ${cur === MOCK.length - 1 ? '<button class="btn btn-primary" id="submit">ส่งข้อสอบ</button>' : `<button class="btn btn-primary" id="next">ถัดไป ${icon('arrow', 18)}</button>`}
          </div>
        </div>
      </div>
      <aside class="qnav" aria-label="ตัวนำทางข้อสอบ">
        <h2>เลือกข้อ</h2>
        <div class="qdots">${MOCK.map((x, i) => `<button class="qdot ${draft.answers[x.id] !== undefined ? 'has' : ''}" data-i="${i}" aria-label="ข้อ ${i + 1}${draft.answers[x.id] !== undefined ? ' ตอบแล้ว' : ''}" ${i === cur ? 'aria-current="true"' : ''}>${i + 1}</button>`).join('')}</div>
        <div class="legend"><span><i style="background:var(--accent-soft);border:1px solid var(--accent)"></i>ตอบแล้ว</span><span><i style="background:var(--surface);border:1px solid var(--line-strong)"></i>ยังไม่ตอบ</span></div>
        <button class="btn btn-sm" id="submit-side" style="margin-top:1rem;width:100%">ส่งข้อสอบ</button>
      </aside>
    </div>`;
    $$('.opt', root).forEach((b) => b.addEventListener('click', () => {
      draft.answers[q.id] = Number(b.dataset.orig);
      save();
      $$('.opt', root).forEach((x) => x.classList.toggle('sel', x === b));
      $(`.qdot[data-i="${cur}"]`, root).classList.add('has');
      $('.mock-top .muted', root).textContent = `· ตอบแล้ว ${Object.keys(draft.answers).length}/${MOCK.length}`;
    }));
    const go = (i) => { cur = i; exam(); window.scrollTo(0, 0); };
    $('#prev', root).onclick = () => go(cur - 1);
    const nx = $('#next', root); if (nx) nx.onclick = () => go(cur + 1);
    $$('.qdot', root).forEach((d) => d.addEventListener('click', () => go(Number(d.dataset.i))));
    const trySubmit = async () => {
      const left = MOCK.length - Object.keys(draft.answers).length;
      const ok = await confirmBox('ส่งข้อสอบ?', left ? `ยังไม่ได้ตอบอีก ${left} ข้อ ข้อที่ไม่ตอบจะนับเป็นผิด เมื่อส่งแล้วแก้ไม่ได้` : 'ตอบครบทุกข้อแล้ว เมื่อส่งแล้วแก้ไม่ได้', 'ส่งข้อสอบ');
      if (ok) finish();
    };
    $('#submit-side', root).onclick = trySubmit;
    const sb = $('#submit', root); if (sb) sb.onclick = trySubmit;
    const tick = () => { const el = $('#timer', root); if (el) el.textContent = fmtTime(Math.floor((Date.now() - draft.start) / 1000)); };
    tick();
    clearInterval(timerId);
    timerId = setInterval(tick, 1000);
  }

  function finish() {
    clearInterval(timerId);
    const secs = Math.floor((Date.now() - draft.start) / 1000);
    const sc = scoreExam(MOCK, draft.answers);
    const answers = draft.answers;
    MOCK.forEach((q) => logAttempt(q, answers[q.id] === q.ans, 'mock'));
    state.mocks.push({ ts: Date.now(), score: sc.correct, total: sc.total, pct: sc.pct, secs, byLec: sc.byLec });
    state.mockDraft = null; draft = null;
    markToday(); save(); railStatus();
    result(sc, secs, answers);
    toast(`ส่งข้อสอบแล้ว ได้ ${sc.correct}/${sc.total}`);
  }

  function result(sc, secs, answers) {
    const weak = [...new Set(MOCK.filter((q) => answers[q.id] !== q.ans).map((q) => q.topic))];
    root.innerHTML = `
    <div class="result">
      <p class="meta">ผลสอบจำลอง · ใช้เวลา ${fmtTime(secs)}</p>
      <div class="score-big"><span data-count="${sc.correct}">0</span><small> / ${sc.total}</small></div>
      <p>คิดเป็น <b>${sc.pct}%</b> ${weak.length ? `ผิดใน ${weak.length} หัวข้อ ด้านล่างมีลิงก์ไปอ่านซ้ำ` : 'ถูกครบทุกข้อ'}</p>
      <div class="lec-rows">${LEC_KEYS.map((k) => `<div class="lec-row"><span class="tag">${LEC_LABEL[k]}</span><div class="bar ${sc.byLec[k][0] === sc.byLec[k][1] ? 'ok' : ''}"><i data-w="${pct(sc.byLec[k][0], sc.byLec[k][1])}"></i></div><span class="pct">${sc.byLec[k][0]}/${sc.byLec[k][1]}</span></div>`).join('')}</div>
      ${weak.length ? `<div style="margin-top:1.75rem;text-align:left;max-width:32rem;margin-inline:auto"><b>หัวข้อที่ควรกลับไปอ่าน</b><ul class="weak-list" style="margin-top:.6rem">${weak.map((t) => { const s = SECTION_BY_ID[t]; return `<li><a class="weak-item" href="#/notes/${s.lec}/${s.id}"><b>${esc(s.title)}</b><span class="pct">${s.lecShort}</span></a></li>`; }).join('')}</ul></div>` : ''}
      <div class="actions"><button class="btn btn-primary" id="again">ทำรอบใหม่</button><button class="btn" id="only-wrong">ดูเฉพาะข้อที่ผิด</button><a class="btn" href="#/progress">ดูความคืบหน้า</a></div>
    </div>
    <div class="review" id="review"></div>`;
    countUp($('[data-count]', root));
    requestAnimationFrame(() => $$('[data-w]', root).forEach((el) => { el.style.width = el.dataset.w + '%'; }));
    const rv = $('#review', root);
    let onlyWrong = false;
    const drawReview = () => {
      rv.innerHTML = MOCK.map((q, n) => {
        const pick = answers[q.id];
        const ok = pick === q.ans;
        if (onlyWrong && ok) return '';
        const sec = SECTION_BY_ID[q.topic];
        const opts = optionsFor(q);
        return `<article class="review-item ${ok ? 'ok' : 'bad'}"><div class="q-meta"><span class="no">ข้อ ${n + 1}</span><span class="chip acc">${LEC_LABEL[q.lec]}</span><span class="chip">${TYPE_LABEL[q.type]}</span><span class="chip" style="${ok ? 'color:var(--ok)' : 'color:var(--bad)'}">${pick === undefined ? 'ไม่ได้ตอบ' : ok ? 'ถูก' : 'ผิด'}</span></div>${questionBody(q)}<ul class="opts">${opts.map((o, i) => { const cls = o.orig === q.ans ? 'correct' : o.orig === pick ? 'wrong' : 'dim'; return optionHtml(o, i, q, cls).replace('<span class="mark"></span>', `<span class="mark">${o.orig === q.ans ? markSvg(true) : o.orig === pick ? markSvg(false) : ''}</span>`).replace('<button', '<button disabled'); }).join('')}</ul><div class="explain ${ok ? 'ok' : 'bad'}"><h3>เฉลยและคำอธิบาย</h3><p>${esc(q.why)}</p><a class="btn btn-sm go" href="#/notes/${sec.lec}/${sec.id}">${icon('book', 16)} อ่านหัวข้อ: ${esc(sec.title)}</a></div></article>`;
      }).join('') || '<div class="empty"><b>ไม่มีข้อที่ผิด</b></div>';
      bindCopy(rv);
    };
    drawReview();
    $('#only-wrong', root).onclick = (e) => { onlyWrong = !onlyWrong; e.currentTarget.textContent = onlyWrong ? 'ดูทุกข้อ' : 'ดูเฉพาะข้อที่ผิด'; drawReview(); };
    $('#again', root).onclick = () => { draft = null; intro(); window.scrollTo(0, 0); };
  }

  intro();
  return () => clearInterval(timerId);
};

/* ---------- progress ---------- */
PAGES.progress = (root) => {
  const stats = topicStats(state.attempts);
  const rows = Object.entries(stats).map(([topic, t]) => ({ topic, acc: t.ok / t.n, n: t.n, total: t.total })).filter((r) => SECTION_BY_ID[r.topic]).sort((a, b) => a.acc - b.acc || b.n - a.n);
  const weak = weakTopics(state.attempts);
  const acc = accuracy();
  const mocks = state.mocks.slice().reverse().slice(0, 8);
  const fmtDate = (ts) => new Date(ts).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  root.innerHTML = `
    <header class="page-head"><div class="kicker">Progress</div><h1>ความคืบหน้าและจุดอ่อน</h1><p>สรุปจากสิ่งที่ทำจริงในเครื่องนี้ ${memoryOnly ? '(เบราว์เซอร์ไม่ให้บันทึกถาวร ข้อมูลจะหายเมื่อปิดหน้า)' : ''}</p></header>
    <div class="stats">
      <div class="stat"><b>${readCount()}/${SECTIONS.length}</b><span>หัวข้อที่อ่านแล้ว</span></div>
      <div class="stat"><b>${practiceDone()}/${PRACTICE.length}</b><span>ข้อ Practice ที่ทำแล้ว</span></div>
      <div class="stat"><b>${acc === null ? '-' : acc + '%'}</b><span>ตอบถูกรวม (${state.attempts.length} ครั้ง)</span></div>
      <div class="stat"><b>${bestMock() === null ? '-' : bestMock() + '%'}</b><span>Mock ดีที่สุด</span></div>
    </div>
    <div class="dash-grid">
      <section class="card" aria-labelledby="w-h">
        <h2 id="w-h">วิเคราะห์จุดอ่อนรายหัวข้อ</h2>
        <p class="sub">เรียงจากแม่นน้อยไปมาก นับ ${WEAK_WINDOW} ครั้งล่าสุดของแต่ละหัวข้อ</p>
        ${rows.length ? `<div class="topic-rows">${rows.map((r) => { const s = SECTION_BY_ID[r.topic]; const p = Math.round(r.acc * 100); const isWeak = weak.some((w) => w.topic === r.topic); return `<div class="topic-row"><a href="#/notes/${s.lec}/${s.id}">${esc(s.title)}<small>${s.lecShort} · ${r.n} ครั้ง${isWeak ? ' · ควรทบทวน' : ''}</small></a><div class="bar ${isWeak ? 'bad' : p >= 85 ? 'ok' : ''}"><i data-w="${p}"></i></div><span class="pct">${p}%</span></div>`; }).join('')}</div>` : '<div class="empty"><b>ยังไม่มีข้อมูล</b> ทำ Practice Quiz หรือ Mock Exam สักชุด แล้วกลับมาดูหน้านี้</div>'}
      </section>
      <div class="stack">
        <section class="card" aria-labelledby="r-h">
          <h2 id="r-h">แนะนำให้อ่านซ้ำ</h2>
          ${weak.length ? `<ul class="weak-list" style="margin-top:.75rem">${weak.slice(0, 6).map((w) => { const s = SECTION_BY_ID[w.topic]; return `<li><a class="weak-item" href="#/notes/${s.lec}/${s.id}"><b>${esc(s.title)}</b><span class="pct">${Math.round(w.acc * 100)}%</span><small>${s.lecShort}</small></a></li>`; }).join('')}</ul>` : '<p class="muted" style="margin:.5rem 0 0">ยังไม่มีหัวข้อที่แม่นต่ำกว่า 70% (ต้องตอบอย่างน้อย 2 ครั้งต่อหัวข้อ)</p>'}
        </section>
        <section class="card" aria-labelledby="h-h">
          <h2 id="h-h">ประวัติ Mock Exam</h2>
          ${mocks.length ? `<ul class="hist" style="margin-top:.75rem">${mocks.map((m) => `<li><span>${fmtDate(m.ts)}</span><span class="muted mono">${fmtTime(m.secs)}</span><span class="sc">${m.score}/${m.total}</span></li>`).join('')}</ul>` : '<p class="muted" style="margin:.5rem 0 0">ยังไม่เคยทำ Mock Exam</p>'}
        </section>
      </div>
    </div>
    <div class="danger-zone"><span>ล้างความคืบหน้าทั้งหมดในเครื่องนี้ (อ่านแล้ว คะแนน ประวัติ)</span><button class="btn btn-danger btn-sm" id="wipe">${icon('reset', 16)} ล้างข้อมูล</button></div>`;
  requestAnimationFrame(() => $$('[data-w]', root).forEach((el) => { el.style.width = el.dataset.w + '%'; }));
  $('#wipe', root).onclick = async () => {
    if (await confirmBox('ล้างข้อมูลทั้งหมด?', 'ข้อมูลที่อ่านแล้ว คะแนนทุกรอบ และประวัติการตอบจะหายถาวร แก้คืนไม่ได้', 'ล้างข้อมูล', true)) {
      const theme = state.theme;
      state = blank(); state.theme = theme; save(); railStatus(); route(); toast('ล้างข้อมูลแล้ว');
    }
  };
};

/* ---------- last-minute ---------- */
PAGES.last = (root) => {
  const total = LAST.reduce((n, g) => n + g.items.length, 0);
  const done = () => Object.values(state.checks).filter(Boolean).length;
  root.innerHTML = `
    <header class="page-head"><div class="kicker">Last-Minute Review</div><h1>สิ่งที่ต้องจำก่อนเข้าห้องสอบ</h1><p>ติ๊กเมื่อจำได้แล้ว กดลิงก์ข้างข้อเพื่อกลับไปอ่านหัวข้อนั้น สั่งพิมพ์เป็นกระดาษได้</p></header>
    <div class="last-top"><div style="flex:1;min-width:14rem;max-width:26rem"><div class="mono" style="font-size:.88rem;margin-bottom:.4rem"><span id="chk-n">${done()}</span>/${total} จำได้แล้ว</div><div class="bar ok"><i id="chk-bar" data-w="${pct(done(), total)}"></i></div></div><button class="btn" id="print">${icon('print', 18)} พิมพ์หน้านี้</button></div>
    <div class="last-grid">${LAST.map((g, gi) => `<section class="card last-group"><h2>${esc(g.lec)}<small>${g.items.length} ข้อ</small></h2>${g.items.map((it, ii) => { const id = `c${gi}-${ii}`; const s = SECTION_BY_ID[it[1]]; return `<label class="check"><input type="checkbox" data-id="${id}" ${state.checks[id] ? 'checked' : ''}><span>${esc(it[0])}</span></label>${s ? `<a class="no-print" style="display:block;margin:-.3rem 0 .4rem 2.05rem;font-size:.8rem" href="#/notes/${s.lec}/${s.id}">อ่าน: ${esc(s.title)}</a>` : ''}`; }).join('')}</section>`).join('')}</div>`;
  requestAnimationFrame(() => { const b = $('#chk-bar', root); b.style.width = b.dataset.w + '%'; });
  $$('input[type=checkbox]', root).forEach((c) => c.addEventListener('change', () => {
    if (c.checked) state.checks[c.dataset.id] = true; else delete state.checks[c.dataset.id];
    markToday(); save();
    $('#chk-n', root).textContent = done();
    $('#chk-bar', root).style.width = pct(done(), total) + '%';
    if (done() === total) toast('จำครบทุกข้อแล้ว ขอให้สอบผ่านนะ');
  }));
  $('#print', root).onclick = () => window.print();
};

/* ---------- boot ---------- */
function boot() {
  load();
  buildShell();
  applyTheme(state.theme || 'light');
  railStatus();
  $$('[data-theme-btn]').forEach((b) => b.addEventListener('click', toggleTheme));
  $('#menu-btn').addEventListener('click', openNav);
  $('#scrim').addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('hashchange', route);
  if (memoryOnly) toast('เบราว์เซอร์ไม่ให้บันทึกถาวร ความคืบหน้าจะหายเมื่อปิดหน้า');
  route();
}
boot();
