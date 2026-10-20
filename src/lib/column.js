/* Penjumlahan dan pengurangan bersusun: hitungan per kolom, isian anak, dan urutan pengisian kotak.
   Kolom dihitung dari kanan: 0 = satuan, 1 = puluhan, 2 = ratusan, 3 = ribuan.
   Tidak bergantung pada React, supaya bisa diuji. */

export const PLACE = ["satuan", "puluhan", "ratusan", "ribuan"];

const digitsOf = (n, len) => Array.from({ length: len }, (_, i) => Math.floor(n / 10 ** i) % 10);

/* Rencana hitungan x + y (op "+") atau x − y (op "-") */
export function columnPlan(x, y, op = "+") {
  return op === "-" ? subPlan(x, y) : addPlan(x, y);
}

/* Penjumlahan: angka tiap kolom, simpanan yang masuk ke tiap kolom, dan hasilnya */
function addPlan(x, y) {
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
  return { op: "+", x, y, n, cols, xs, ys, carry: carry.slice(0, cols), res, result: x + y, steps };
}

/* Pengurangan: tanpa kolom tambahan. `borrow[i]` = nilai baru angka atas kolom i setelah meminjam
   (null = tidak berubah). Meminjam melewati nol: 403 − 158 → ratusan 3, puluhan 9, satuan 13. */
function subPlan(x, y) {
  if (y > x) throw new Error("Pengurangan bersusun butuh x ≥ y");
  const cols = String(x).length, n = cols;
  const xs = digitsOf(x, cols), ys = digitsOf(y, cols);
  const top = [...xs], borrow = Array(cols).fill(null), res = [], steps = [], after = [];
  for (let i = 0; i < cols; i++) {
    const before = top[i];
    let from = null, lenderBefore = null;
    if (top[i] < ys[i]) {
      let j = i + 1;
      while (top[j] === 0) j++;
      from = j; lenderBefore = top[j];
      top[j] -= 1; borrow[j] = top[j];
      for (let k = j - 1; k > i; k--) { top[k] = 9; borrow[k] = 9; }
      top[i] += 10; borrow[i] = top[i];
    }
    res.push(top[i] - ys[i]);
    after.push([...borrow]); // isi kotak pinjaman setelah kolom i selesai, untuk pembahasan
    steps.push({ i, bottomEmpty: i >= String(y).length, before, from, lenderBefore, lenderAfter: from === null ? null : lenderBefore - 1, a: top[i], b: ys[i], diff: top[i] - ys[i] });
  }
  return { op: "-", x, y, n, cols, xs, ys, borrow, after, res, result: x - y, steps };
}

/* Berapa kali meminjam, dan apakah ada pinjaman yang melewati nol */
export function borrowsOf(x, y) {
  const p = subPlan(x, y);
  return { count: p.steps.filter((s) => s.from !== null).length, acrossZero: p.steps.some((s) => s.from !== null && s.from > s.i + 1) };
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

/* Kotak kecil benar? Tambah: simpanan. Kurang: nilai baru angka atas (kosong boleh kalau tidak meminjam). */
export function auxOk(v, plan, i) {
  if (plan.op !== "-") return carryOk(v, plan, i);
  const got = v?.c?.[i] ?? "";
  if (plan.borrow[i] === null) return got === "" || Number(got) === plan.xs[i];
  return got !== "" && Number(got) === plan.borrow[i];
}

/* Urutan kotak hasil yang diisi otomatis: satuan, puluhan, ratusan, ...
   Kotak simpanan tidak masuk urutan: anak sendiri yang mengetuk dan mengisinya. */
export const fillOrder = (cols) => Array.from({ length: cols }, (_, i) => `d${i}`);

const cap = (t) => t[0].toUpperCase() + t.slice(1);

/* Kalimat penjelasan per kolom pengurangan */
export function subStepText(step) {
  const place = cap(PLACE[step.i]);
  if (step.from === null) {
    if (step.bottomEmpty) return `${place}: ${step.a}, tidak ada yang dikurangi. Tulis ${step.a}.`;
    return `${place}: ${step.a} − ${step.b} = ${step.diff}. Tulis ${step.diff}.`;
  }
  const lender = PLACE[step.from];
  const pinjam = step.from > step.i + 1
    ? ` ${cap(PLACE[step.i + 1])} 0, jadi pinjam dari ${lender}: ${step.lenderBefore} menjadi ${step.lenderAfter}, angka 0 di tengah menjadi 9.`
    : ` Pinjam 1 dari ${lender}: ${step.lenderBefore} menjadi ${step.lenderAfter}.`;
  return `${place}: ${step.before} kurang dari ${step.b}.${pinjam} ${step.before} menjadi ${step.a}. ${step.a} − ${step.b} = ${step.diff}. Tulis ${step.diff}.`;
}

/* Kalimat penjelasan per kolom, dipakai di pembahasan */
export function stepText(step) {
  const place = PLACE[step.i];
  const parts = step.cin ? `${step.cin} (simpanan) + ${step.a} + ${step.b}` : `${step.a} + ${step.b}`;
  if (step.sum < 10) return `${place[0].toUpperCase()}${place.slice(1)}: ${parts} = ${step.sum}. Tulis ${step.sum}.`;
  return `${place[0].toUpperCase()}${place.slice(1)}: ${parts} = ${step.sum}. Tulis ${step.sum % 10}, simpan 1 di atas ${PLACE[step.i + 1]}.`;
}
