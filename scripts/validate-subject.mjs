// Validasi satu atau lebih file bank soal mapel (JSON).
// Pakai: node scripts/validate-subject.mjs src/data/mapel/bi.json [min-soal-per-bab]
import { readFileSync } from "node:fs";

export function validateSubject(subject, minPerChapter = 1, requireExplain = false) {
  const errors = [];
  const counts = [];
  const str = (v) => typeof v === "string" && v.trim() !== "";
  if (!str(subject.id) || !str(subject.title)) errors.push("mapel: id/title wajib diisi");
  if (!Array.isArray(subject.chapters) || !subject.chapters.length) errors.push("mapel: chapters kosong");
  const chapterIds = new Set();
  for (const ch of subject.chapters ?? []) {
    const where = `bab ${ch.id}`;
    if (!str(ch.id) || !str(ch.title) || !str(ch.hint) || !str(ch.icon)) errors.push(`${where}: id/title/hint/icon wajib diisi`);
    if (chapterIds.has(ch.id)) errors.push(`${where}: id bab ganda`);
    chapterIds.add(ch.id);
    const seen = new Set();
    const qs = Array.isArray(ch.questions) ? ch.questions : [];
    counts.push([ch.id, ch.title, qs.length]);
    if (qs.length < minPerChapter) errors.push(`${where}: hanya ${qs.length} soal (minimal ${minPerChapter})`);
    qs.forEach((q, i) => {
      const at = `${where} soal #${i + 1} "${String(q.t).slice(0, 50)}"`;
      if (!str(q.t)) errors.push(`${at}: teks soal (t) kosong`);
      if (!str(q.a)) errors.push(`${at}: kunci (a) kosong`);
      for (const k of Object.keys(q)) if (!["t", "c", "o", "a", "pre", "post", "wide", "keep", "g", "e"].includes(k)) errors.push(`${at}: field tidak dikenal "${k}"`);
      if (q.o !== undefined) {
        if (!Array.isArray(q.o) || q.o.length < 2 || q.o.length > 4) errors.push(`${at}: pilihan (o) harus 2-4 butir`);
        else {
          if (!q.o.every(str)) errors.push(`${at}: ada pilihan kosong`);
          if (new Set(q.o).size !== q.o.length) errors.push(`${at}: pilihan kembar`);
          if (!q.o.includes(q.a)) errors.push(`${at}: kunci tidak ada di pilihan`);
          if (q.o.some((o) => o.length > 40)) errors.push(`${at}: pilihan terlalu panjang (>40 huruf)`);
        }
        if (q.pre || q.post || q.wide) errors.push(`${at}: pre/post/wide hanya untuk soal isian`);
      } else if (!/^[a-z0-9]{1,12}$/.test(String(q.a))) {
        errors.push(`${at}: kunci isian harus huruf kecil/angka tanpa spasi, maksimal 12 karakter`);
      }
      if (q.e !== undefined && (!str(q.e) || q.e.length < 15 || q.e.length > 180)) errors.push(`${at}: penjelasan (e) harus 15-180 karakter`);
      if (requireExplain && q.e === undefined) errors.push(`${at}: belum ada penjelasan (e)`);
      const key = [q.t, q.c, q.pre, q.post].join("|");
      if (seen.has(key)) errors.push(`${at}: soal ganda`);
      seen.add(key);
    });
  }
  return { errors, counts };
}

if (process.argv[1] && process.argv[1].endsWith("validate-subject.mjs")) {
  const requireExplain = process.argv.includes("--explain");
  const files = process.argv.slice(2).filter((a) => !/^\d+$/.test(a) && a !== "--explain");
  const min = Number(process.argv.slice(2).find((a) => /^\d+$/.test(a)) ?? 1);
  let bad = false;
  for (const f of files) {
    const subject = JSON.parse(readFileSync(f, "utf8"));
    const { errors, counts } = validateSubject(subject, min, requireExplain);
    console.log(`\n${f}: ${subject.title}`);
    counts.forEach(([id, title, n]) => console.log(`  ${id}  ${n} soal  ${title}`));
    console.log(`  total ${counts.reduce((s, c) => s + c[2], 0)} soal`);
    if (errors.length) { bad = true; console.error(errors.map((e) => "  ✗ " + e).join("\n")); }
    else console.log("  ✓ valid");
  }
  process.exit(bad ? 1 : 0);
}
