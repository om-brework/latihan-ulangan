/* Penjumlahan bersusun: hitungan per kolom, isian anak, dan urutan pengisian kotak.
   Kolom dihitung dari kanan: 0 = satuan, 1 = puluhan, 2 = ratusan, 3 = ribuan.
   Tidak bergantung pada React, supaya bisa diuji. */

export const PLACE = ["satuan", "puluhan", "ratusan", "ribuan"];

const digitsOf = (n, len) => Array.from({ length: len }, (_, i) => Math.floor(n / 10 ** i) % 10);

/* Rencana hitungan x + y: angka tiap kolom, simpanan yang masuk ke tiap kolom, dan hasilnya */
export function columnPlan(x, y) {
  const n = Math.max(String(x).length, String(y).length);
  const cols = n + 1; // satu kolom tambahan di kiri untuk simpanan terakhir
  const xs = digitsOf(x, cols), ys = digitsOf(y, cols);
  const carry = Array(cols + 1).fill(0); // carry[i] = simpanan yang masuk ke kolom i
  const res = [];
  for (let i = 0; i < cols; i++) {
    const s = xs[i] + ys[i] + carry[i];
    res.push(s % 10);
    carry[i + 1] = Math.floor(s / 10);
  }
  const steps = Array.from({ length: n }, (_, i) => ({ i, a: xs[i], b: ys[i], cin: carry[i], sum: xs[i] + ys[i] + carry[i] }));
  return { x, y, n, cols, xs, ys, carry: carry.slice(0, cols), res, result: x + y, steps };
}

export const emptyColumn = (cols) => ({ d: Array(cols).fill(""), c: Array(cols).fill("") });

/* Jawaban yang tertulis di kotak hasil, atau null kalau belum lengkap.
   Kotak boleh kosong hanya di sebelah kiri angka pertama; minDigits kotak paling kanan wajib terisi. */
export function columnAnswer(v, minDigits = 1) {
  if (!v || !Array.isArray(v.d)) return null;
  const top = v.d.reduce((hi, ch, i) => (ch !== "" ? i : hi), -1);
  if (top < minDigits - 1) return null;
  for (let i = 0; i <= top; i++) if (v.d[i] === "") return null;
  const s = v.d.slice(0, top + 1).reverse().join("").replace(/^0+(?=\d)/, "");
  return s;
}

/* Simpanan anak benar? Kotak kosong dan 0 sama-sama berarti "tidak ada simpanan" */
export const carryOk = (v, plan, i) => (Number(v?.c?.[i] || 0)) === plan.carry[i];

/* Urutan kotak hasil yang diisi otomatis: satuan, puluhan, ratusan, ...
   Kotak simpanan tidak masuk urutan: anak sendiri yang mengetuk dan mengisinya. */
export const fillOrder = (cols) => Array.from({ length: cols }, (_, i) => `d${i}`);

/* Kalimat penjelasan per kolom, dipakai di pembahasan */
export function stepText(step) {
  const place = PLACE[step.i];
  const parts = step.cin ? `${step.cin} (simpanan) + ${step.a} + ${step.b}` : `${step.a} + ${step.b}`;
  if (step.sum < 10) return `${place[0].toUpperCase()}${place.slice(1)}: ${parts} = ${step.sum}. Tulis ${step.sum}.`;
  return `${place[0].toUpperCase()}${place.slice(1)}: ${parts} = ${step.sum}. Tulis ${step.sum % 10}, simpan 1 di atas ${PLACE[step.i + 1]}.`;
}
