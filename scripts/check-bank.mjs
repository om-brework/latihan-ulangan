// Validasi semua bank soal dan penyusunan kuis.
import { readdirSync, readFileSync } from "node:fs";
import { buildPool, PER_SECTION, SECTION_INFO } from "../src/data/bank.js";
import { SUBJECTS, drawChapter, drawMixed, drawSpecial, CHAPTER_QUIZ_SIZE } from "../src/data/catalog.js";
import { validateSubject } from "./validate-subject.mjs";

const errors = [];
let grand = 0;

// 1. Set khusus ulangan 5 Oktober
const pool = buildPool();
for (const { id } of SECTION_INFO) {
  const seen = new Set();
  for (const q of pool[id]) {
    const key = [q.t, q.c, q.pre, q.post].join("|");
    if (seen.has(key)) errors.push(`${id}: soal ganda "${key}"`);
    seen.add(key);
    if (!q.t || !q.a || !q.g) errors.push(`${id}: soal tidak lengkap "${q.t}"`);
    if (q.o && !q.o.includes(q.a)) errors.push(`${id}: kunci tidak ada di pilihan "${q.t}"`);
    if (!q.o && !/^[a-z0-9]+$/.test(q.a)) errors.push(`${id}: kunci isian tidak valid "${q.a}"`);
  }
  grand += pool[id].length;
}
console.log(`Ulangan 5 Oktober: ${grand} soal`);

// 2. Bank per mapel
const dir = new URL("../src/data/mapel/", import.meta.url);
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const subject = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
  const r = validateSubject(subject, CHAPTER_QUIZ_SIZE);
  const n = r.counts.reduce((s, c) => s + c[2], 0);
  grand += n;
  console.log(`${subject.title}: ${r.counts.length} bab, ${n} soal`);
  errors.push(...r.errors);
}

// 3. Penyusunan kuis: jumlah soal tepat, tidak ada soal kembar dalam satu kuis
function checkQuiz(name, sections, expectPerSection) {
  const ids = new Set(), texts = new Set();
  for (const s of sections) {
    if (expectPerSection && s.questions.length !== expectPerSection) errors.push(`${name}: bagian ${s.id} berisi ${s.questions.length} soal`);
    for (const q of s.questions) {
      const key = [s.id, q.src.t, q.src.c, q.src.pre, q.src.post].join("|");
      if (ids.has(q.id) || texts.has(key)) errors.push(`${name}: soal kembar dalam satu kuis`);
      ids.add(q.id); texts.add(key);
      if (q.opts && !q.opts.includes(q.src.a)) errors.push(`${name}: kunci hilang setelah diacak`);
    }
  }
}
for (let i = 0; i < 200; i++) {
  checkQuiz("ulangan", drawSpecial(), PER_SECTION);
  for (const s of SUBJECTS) {
    checkQuiz(`${s.id} campuran`, drawMixed(s));
    for (const ch of s.chapters) checkQuiz(ch.id, drawChapter(ch), CHAPTER_QUIZ_SIZE);
  }
}

console.log(`Total: ${grand} soal`);
if (errors.length) { console.error([...new Set(errors)].join("\n")); process.exit(1); }
console.log("Semua bank soal valid.");
