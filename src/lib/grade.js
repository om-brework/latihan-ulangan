import { columnAnswer } from "./column.js";

export const normalize = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* Jawaban yang sudah dirapikan, atau null kalau soal belum dijawab */
export function answerValue(q, raw) {
  // Bersusun: kotak sebanyak angka bilangan terpanjang wajib terisi (pengurangan: semua kolom, 0 di depan boleh)
  if (q.src.col) return columnAnswer(raw, Math.max(...q.src.col.map((n) => String(n).length)));
  if (q.opts) return raw ?? null;
  const v = normalize(raw);
  return v === "" ? null : v;
}

export const isCorrect = (q, raw) => answerValue(q, raw) === q.src.a;
