/* Membentuk catatan satu latihan dan merangkum riwayat. Tidak bergantung pada React atau Firebase. */
import { answerValue, isCorrect } from "./grade.js";

const clip = (s, n) => (s == null ? null : String(s).slice(0, n));

/* Catatan satu latihan: nilai, rincian per bagian, dan soal yang salah beserta jawaban anak */
export function buildAttempt({ key, eyebrow, title }, sections, answers, at = Date.now()) {
  let right = 0, total = 0;
  const wrong = [];
  const parts = sections.map((s) => {
    let ok = 0;
    for (const q of s.questions) {
      total++;
      if (isCorrect(q, answers[q.id])) { ok++; right++; continue; }
      const given = answerValue(q, answers[q.id]);
      wrong.push({
        part: s.label,
        t: clip(q.src.t, 300),
        c: clip(q.src.c, 200),
        pre: clip(q.src.pre, 60),
        post: clip(q.src.post, 60),
        given: clip(given, 60),
        a: clip(q.src.a, 60),
      });
    }
    return { label: s.label, short: s.short, right: ok, total: s.questions.length };
  });
  return { at, key, eyebrow, title, right, total, nilai: Math.round((right / total) * 100), parts, wrong };
}

/* Teks soal yang utuh untuk ditampilkan di riwayat */
export function questionText(w) {
  const blank = w.pre || w.post ? ` ${w.pre ?? ""} ___ ${w.post ?? ""}`.replace(/\s+/g, " ").trimEnd() : "";
  return [w.t + blank, w.c].filter(Boolean).join(" · ");
}

/* Rangkuman: per materi (terakhir, terbaik, rata-rata) dan soal yang paling sering salah */
export function summarize(attempts) {
  const byKey = new Map();
  const misses = new Map();
  for (const a of [...attempts].sort((x, y) => x.at - y.at)) {
    const g = byKey.get(a.key) ?? { key: a.key, eyebrow: a.eyebrow, title: a.title, count: 0, sum: 0, best: 0, last: 0, lastAt: 0, first: a.nilai };
    g.count++; g.sum += a.nilai; g.best = Math.max(g.best, a.nilai); g.last = a.nilai; g.lastAt = a.at;
    byKey.set(a.key, g);
    for (const w of a.wrong ?? []) {
      const id = [a.key, w.t, w.c, w.pre, w.post].join("|");
      const m = misses.get(id) ?? { ...w, key: a.key, eyebrow: a.eyebrow, title: a.title, times: 0, lastAt: 0 };
      m.times++; m.lastAt = a.at; m.given = w.given;
      misses.set(id, m);
    }
  }
  const topics = [...byKey.values()].map((g) => ({ ...g, avg: Math.round(g.sum / g.count) })).sort((x, y) => x.last - y.last);
  const frequent = [...misses.values()].sort((x, y) => y.times - x.times || y.lastAt - x.lastAt).slice(0, 20);
  return { topics, frequent };
}

export function lastScoreByKey(attempts) {
  const out = {};
  for (const a of [...attempts].sort((x, y) => x.at - y.at)) out[a.key] = a.nilai;
  return out;
}
