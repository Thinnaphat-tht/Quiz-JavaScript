// Run: node src/verify.js  (checks question bank, example outputs and scoring logic)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const files = ['notes-l6.js', 'notes-l7.js', 'notes-l8.js', 'notes-cs.js', 'quiz-practice.js', 'quiz-mock.js', 'logic.js'];
const src = 'var NOTES = [];\n' + files.map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n') +
  '\n({ NOTES, PRACTICE, MOCK, scoreExam, topicStats, weakTopics, streakDays, shuffledOrder, dayKey });';
const L = vm.runInNewContext(src);

let failures = 0;
const fail = (m) => { failures++; console.log('FAIL  ' + m); };
const ok = (m) => console.log('ok    ' + m);

function run(code) {
  return new Promise((resolve) => {
    const out = [];
    const ctx = vm.createContext({
      console: { log: (...a) => out.push(a.map(String).join(' ')) },
      setTimeout,
    });
    let err = null;
    try { new vm.Script(code).runInContext(ctx); } catch (e) { err = e; }
    setTimeout(() => resolve(err ? 'ERR:' + err.name : out.join('\n')), 60);
  });
}

(async () => {
  const sectionIds = new Set();
  for (const lec of L.NOTES) for (const s of lec.sections) {
    if (sectionIds.has(s.id)) fail('duplicate section id ' + s.id);
    sectionIds.add(s.id);
  }

  const count = (list, f) => list.filter(f).length;
  const want = { practice: { 6: 12, 7: 12, 8: 8, cs: 4 }, mock: { 6: 7, 7: 7, 8: 4, cs: 2 } };
  [['practice', L.PRACTICE, 36], ['mock', L.MOCK, 20]].forEach(([name, list, total]) => {
    if (list.length !== total) fail(`${name} has ${list.length} questions, want ${total}`);
    for (const [lec, n] of Object.entries(want[name])) {
      const got = count(list, (q) => String(q.lec) === lec);
      if (got !== n) fail(`${name} lec ${lec}: ${got}, want ${n}`);
    }
    const types = {};
    list.forEach((q) => { types[q.type] = (types[q.type] || 0) + 1; });
    console.log(`info  ${name} types: ${JSON.stringify(types)}`);
  });

  const all = [...L.PRACTICE, ...L.MOCK];
  const ids = new Set();
  for (const q of all) {
    if (ids.has(q.id)) fail('duplicate question id ' + q.id);
    ids.add(q.id);
    if (!['mc', 'out', 'bug'].includes(q.type)) fail(q.id + ' bad type');
    if (!sectionIds.has(q.topic)) fail(q.id + ' unknown topic ' + q.topic);
    if (!Array.isArray(q.opts) || q.opts.length !== 4) fail(q.id + ' needs 4 options');
    else if (new Set(q.opts).size !== 4) fail(q.id + ' duplicate options');
    if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) fail(q.id + ' bad ans');
    if (!q.why || q.why.length < 20) fail(q.id + ' missing explanation');
    if (!q.q) fail(q.id + ' missing question text');
    if (q.type === 'out' && !q.code) fail(q.id + ' out question without code');

    if (q.type === 'out') {
      const got = await run(q.code);
      if (got !== q.opts[q.ans]) fail(`${q.id} output mismatch\n   code gives: ${JSON.stringify(got)}\n   marked    : ${JSON.stringify(q.opts[q.ans])}`);
    }
    if (q.check) {
      const got = await run(q.check.code);
      if (got !== q.check.expect) fail(`${q.id} check mismatch: got ${JSON.stringify(got)} want ${JSON.stringify(q.check.expect)}`);
    }
  }
  ok(`checked ${all.length} questions`);

  let ran = 0;
  for (const lec of L.NOTES) for (const s of lec.sections) for (const b of s.blocks) {
    if (b[0] !== 'code' || b[1] !== 'js' || b[3] == null || (b[4] && b[4].norun)) continue;
    const got = await run(b[2]);
    ran++;
    if (got !== b[3]) fail(`note ${s.id} example mismatch\n   code gives: ${JSON.stringify(got)}\n   shown     : ${JSON.stringify(b[3])}`);
  }
  ok(`ran ${ran} note examples`);

  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };
  const qs = L.MOCK;
  const perfect = Object.fromEntries(qs.map((q) => [q.id, q.ans]));
  eq(L.scoreExam(qs, perfect).correct, 20, 'perfect score');
  eq(L.scoreExam(qs, {}).correct, 0, 'blank score');
  const half = Object.fromEntries(qs.map((q, i) => [q.id, i % 2 ? q.ans : (q.ans + 1) % 4]));
  eq(L.scoreExam(qs, half).pct, 50, 'half pct');
  const changed = { ...perfect, m01: (qs[0].ans + 1) % 4 };
  changed.m01 = qs[0].ans;
  eq(L.scoreExam(qs, changed).correct, 20, 'changed-back answer counts');
  eq(L.scoreExam(qs, perfect).byLec['6'], [7, 7], 'byLec lec 6');
  eq(L.scoreExam([], {}).pct, 0, 'empty exam');

  const att = [
    { topic: 'a', ok: false }, { topic: 'a', ok: false }, { topic: 'b', ok: true }, { topic: 'b', ok: false },
    { topic: 'c', ok: false },
  ];
  eq(L.weakTopics(att).map((t) => t.topic), ['a', 'b'], 'weak topics (c has 1 attempt, b is 50%)');
  const recovered = att.concat(Array.from({ length: 6 }, () => ({ topic: 'a', ok: true })));
  eq(L.weakTopics(recovered).map((t) => t.topic), ['b'], 'recent success clears weakness');

  const d = (s) => new Date(s + 'T12:00:00');
  eq(L.streakDays(['2026-10-16', '2026-10-17', '2026-10-18'], d('2026-10-18')), 3, 'streak 3');
  eq(L.streakDays(['2026-10-16', '2026-10-17'], d('2026-10-18')), 2, 'streak alive until tomorrow');
  eq(L.streakDays(['2026-10-15'], d('2026-10-18')), 0, 'streak broken');
  eq(L.streakDays([], d('2026-10-18')), 0, 'no days');

  const o1 = L.shuffledOrder('p01', 4);
  eq(o1, L.shuffledOrder('p01', 4), 'shuffle is stable');
  eq([...o1].sort(), [0, 1, 2, 3], 'shuffle is a permutation');
  ok('logic asserts done');

  console.log(failures ? `\n${failures} problem(s)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
})();
