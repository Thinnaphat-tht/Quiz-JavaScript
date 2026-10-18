const WEAK_ACC = 0.7;
const WEAK_MIN = 2;
const WEAK_WINDOW = 6;

function scoreExam(questions, answers) {
  const byLec = {};
  let correct = 0;
  for (const q of questions) {
    const k = String(q.lec);
    const b = byLec[k] || (byLec[k] = [0, 0]);
    b[1]++;
    if (answers[q.id] === q.ans) { correct++; b[0]++; }
  }
  const total = questions.length;
  return { correct, total, pct: total ? Math.round((correct / total) * 100) : 0, byLec };
}

// Only the latest WEAK_WINDOW attempts per topic count, so improvement clears a weakness.
function topicStats(attempts) {
  const per = {};
  for (const a of attempts) (per[a.topic] || (per[a.topic] = [])).push(a.ok);
  const out = {};
  for (const [topic, list] of Object.entries(per)) {
    const recent = list.slice(-WEAK_WINDOW);
    out[topic] = { n: recent.length, ok: recent.filter(Boolean).length, total: list.length };
  }
  return out;
}

function weakTopics(attempts) {
  return Object.entries(topicStats(attempts))
    .filter(([, t]) => t.n >= WEAK_MIN && t.ok / t.n < WEAK_ACC)
    .map(([topic, t]) => ({ topic, acc: t.ok / t.n, n: t.n }))
    .sort((a, b) => a.acc - b.acc || b.n - a.n);
}

function dayKey(d) {
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

// A streak survives until the end of the day after the last study day.
function streakDays(days, today) {
  const set = new Set(days);
  const cur = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(dayKey(cur))) cur.setDate(cur.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(cur))) { n++; cur.setDate(cur.getDate() - 1); }
  return n;
}

// Deterministic shuffle so option order stays the same between renders of one question.
function shuffledOrder(id, len) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
  const order = Array.from({ length: len }, (_, i) => i);
  for (let i = len - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
