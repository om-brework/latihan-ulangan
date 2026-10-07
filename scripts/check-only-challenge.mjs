// Memastikan sebuah bank soal hanya berbeda dari versi git HEAD pada field "challenge" tiap bab.
// Pakai: node scripts/check-only-challenge.mjs src/data/mapel/mtk.json
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
const f = process.argv[2];
const strip = (s) => JSON.stringify(JSON.parse(s), (k, v) => (k === "challenge" ? undefined : v));
const before = strip(execSync(`git show HEAD:${f}`, { encoding: "utf8", maxBuffer: 1 << 26 }));
const after = strip(readFileSync(f, "utf8"));
if (before !== after) { console.error(`✗ ${f}: ada perubahan selain field "challenge"`); process.exit(1); }
console.log(`✓ ${f}: hanya field "challenge" yang ditambahkan`);
