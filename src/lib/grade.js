export const normalize = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* Jawaban yang sudah dirapikan, atau null kalau soal belum dijawab */
export function answerValue(q, raw) {
  if (q.opts) return raw ?? null;
  const v = normalize(raw);
  return v === "" ? null : v;
}

export const isCorrect = (q, raw) => answerValue(q, raw) === q.src.a;

export const toNilai = (right, total) => Math.round((right / total) * 100);

export const starsFor = (nilai) =>
  nilai === 100 ? 5 : nilai >= 80 ? 4 : nilai >= 60 ? 3 : nilai >= 40 ? 2 : 1;

export const messageFor = (nilai) =>
  nilai === 100 ? "Sempurna! Semua jawaban benar. 🎉"
  : nilai >= 80 ? "Hebat! Tinggal sedikit lagi. 💪"
  : nilai >= 60 ? "Bagus. Ayo coba soal baru."
  : "Ayo belajar lagi, lalu coba soal baru.";
