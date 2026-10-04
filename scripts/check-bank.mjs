// Validasi bank soal: jumlah, kunci jawaban, duplikat, dan pengambilan acak.
import { buildPool, PER_SECTION, SECTION_INFO } from "../src/data/bank.js";
import { pick } from "../src/lib/random.js";

const pool = buildPool();
const errors = [];
let total = 0;
for (const { id } of SECTION_INFO) {
  const qs = pool[id];
  total += qs.length;
  const seen = new Set();
  for (const q of qs) {
    const key = [q.t, q.c, q.pre, q.post].join("|");
    if (seen.has(key)) errors.push(`${id}: soal ganda "${key}"`);
    seen.add(key);
    if (!q.t || !q.a || !q.g) errors.push(`${id}: soal tidak lengkap "${q.t}"`);
    if (q.o && !q.o.includes(q.a)) errors.push(`${id}: kunci tidak ada di pilihan "${q.t}"`);
    if (q.o && new Set(q.o).size !== q.o.length) errors.push(`${id}: pilihan ganda kembar "${q.t}"`);
    if (!q.o && !/^[a-z]+$/.test(q.a)) errors.push(`${id}: kunci isian tidak valid "${q.a}"`);
  }
  for (let i = 0; i < 500; i++) {
    const r = pick(qs, PER_SECTION);
    if (r.length !== PER_SECTION || new Set(r.map((q) => q.g)).size !== PER_SECTION) {
      errors.push(`${id}: pengambilan acak gagal`);
      break;
    }
  }
  console.log(`${id}: ${qs.length} soal`);
}
console.log(`Total: ${total} soal`);
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("Bank soal valid.");
