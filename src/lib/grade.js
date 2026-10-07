export const normalize = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* Jawaban yang sudah dirapikan, atau null kalau soal belum dijawab */
export function answerValue(q, raw) {
  if (q.opts) return raw ?? null;
  const v = normalize(raw);
  return v === "" ? null : v;
}

export const isCorrect = (q, raw) => answerValue(q, raw) === q.src.a;
