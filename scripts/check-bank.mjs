// Validasi semua bank soal, pembagian level, dan penyusunan permainan.
import { readdirSync, readFileSync } from "node:fs";
import { ALL_SUBJECTS, LEVEL_SIZE, MIXED_SIZE, PASS_SCORE, SPECIAL, chapterProgress, drawLevel, drawMixed, levelKey, levelStars, resolveRoute } from "../src/data/catalog.js";
import { validateSubject } from "./validate-subject.mjs";

const errors = [];
let grand = 0;

// 1. Bank soal per mapel (JSON)
const dir = new URL("../src/data/mapel/", import.meta.url);
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const r = validateSubject(JSON.parse(readFileSync(new URL(f, dir), "utf8")), LEVEL_SIZE * 2);
  errors.push(...r.errors);
}

// 2. Paket ulangan (bank.js)
for (const ch of SPECIAL.chapters) {
  const seen = new Set();
  for (const q of ch.questions) {
    const key = [q.t, q.c, q.pre, q.post].join("|");
    if (seen.has(key)) errors.push(`${ch.id}: soal ganda "${key}"`);
    seen.add(key);
    if (!q.t || !q.a) errors.push(`${ch.id}: soal tidak lengkap "${q.t}"`);
    if (q.o && !q.o.includes(q.a)) errors.push(`${ch.id}: kunci tidak ada di pilihan "${q.t}"`);
    if (!q.o && !/^[a-z0-9]+$/.test(q.a)) errors.push(`${ch.id}: kunci isian tidak valid "${q.a}"`);
  }
}

// 3. Pembagian level: tiap soal masuk tepat satu level, ukuran wajar, kelompok (g) tidak bertemu
let levelCount = 0;
for (const s of ALL_SUBJECTS) {
  let n = 0, lv = 0;
  for (const ch of s.chapters) {
    const flat = ch.levels.flat();
    if (flat.length !== ch.questions.length || new Set(flat).size !== flat.length) errors.push(`${s.id}/${ch.id}: soal hilang atau ganda saat dibagi level`);
    ch.levels.forEach((list, i) => {
      const where = `${s.id}/${ch.id} level ${i + 1}`;
      if (list.length < LEVEL_SIZE / 2 || list.length > LEVEL_SIZE * 1.5) errors.push(`${where}: berisi ${list.length} soal`);
      // Soal sekelompok hanya boleh bertemu kalau kelompoknya lebih besar daripada jumlah level
      for (const g of new Set(list.map((q) => q.g).filter((g) => g !== undefined))) {
        const here = list.filter((q) => q.g === g).length;
        const all = ch.questions.filter((q) => q.g === g).length;
        if (here > Math.ceil(all / ch.levels.length)) errors.push(`${where}: kelompok "${g}" menumpuk (${here} dari ${all})`);
      }
      const sec = drawLevel(ch, i + 1);
      if (sec.questions.length !== list.length || new Set(sec.questions.map((q) => q.id)).size !== list.length) errors.push(`${where}: penyusunan level salah`);
      for (const q of sec.questions) if (q.opts && !q.opts.includes(q.src.a)) errors.push(`${where}: kunci hilang setelah diacak`);
      const r = resolveRoute(levelKey(s, ch, i + 1));
      if (r.page !== "game" || r.key !== levelKey(s, ch, i + 1)) errors.push(`${where}: alamat level tidak dikenali`);
    });
    n += ch.questions.length; lv += ch.levels.length;
  }
  for (let i = 0; i < 50; i++) {
    const mix = drawMixed(s);
    if (mix.questions.length !== MIXED_SIZE) errors.push(`${s.id}: tantangan campuran berisi ${mix.questions.length} soal`);
  }
  console.log(`${s.title}: ${s.chapters.length} bab, ${lv} level, ${n} soal`);
  grand += n; levelCount += lv;
}

// 4. Bintang dan kunci level
const s0 = ALL_SUBJECTS[0], c0 = s0.chapters[0];
const check = (cond, msg) => { if (!cond) errors.push(msg); };
check([0, 59, 60, 79, 80, 99, 100].map(levelStars).join() === "0,0,1,1,2,2,3", "aturan bintang salah");
let p = chapterProgress(s0, c0, {});
check(p.levels[0].open && !p.levels[1].open && p.stars === 0, "level awal: hanya level 1 yang terbuka");
p = chapterProgress(s0, c0, { [levelKey(s0, c0, 1)]: PASS_SCORE - 10 });
check(!p.levels[1].open, "nilai di bawah batas tidak boleh membuka level 2");
p = chapterProgress(s0, c0, { [levelKey(s0, c0, 1)]: 100, [levelKey(s0, c0, 2)]: 80 });
check(p.levels[1].open && p.levels[2].open && p.stars === 5 && p.cleared === 2, "nilai lulus harus membuka level berikutnya");
check(resolveRoute(`#/${s0.id}/${c0.id}`).page === "chapter" && resolveRoute(`#/${s0.id}/${c0.id}/level/99`).page === "chapter", "alamat bab/level tak sah harus ke peta level");

console.log(`Total: ${grand} soal dalam ${levelCount} level`);
if (errors.length) { console.error([...new Set(errors)].join("\n")); process.exit(1); }
console.log("Semua bank soal dan level valid.");
