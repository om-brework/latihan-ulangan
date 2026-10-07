// Uji pengenalan jenis pembahasan pada seluruh bank soal.
import assert from "node:assert/strict";
import { ALL_SUBJECTS } from "../src/data/catalog.js";
import { closingText, explainKind, graphemes } from "../src/lib/explain.js";

const k = (src) => explainKind({ src, opts: src.o ?? null });
assert.deepEqual(k({ t: "x", pre: "3 + 4 =", a: "7" }), { kind: "calc", a: 3, b: 4, op: "+", result: 7 });
assert.equal(k({ t: "x", pre: "14 – 3 =", a: "11" }).kind, "calc");
assert.equal(k({ t: "x", pre: "3 + 4 =", a: "8" }).kind, "fill"); // kunci tidak cocok: jangan dianimasikan
assert.deepEqual(k({ t: "x", pre: "3 +", post: "= 7", a: "4" }), { kind: "missing", a: 3, c: 7, op: "+", b: 4 });
assert.deepEqual(k({ t: "x", pre: "2 + 3 + 4 =", a: "9" }), { kind: "chain", steps: [{ a: 2, b: 3, op: "+" }, { a: 5, b: 4, op: "+" }], result: 9 });
assert.equal(k({ t: "x", pre: "9 – 2 – 4 =", a: "3" }).result, 3);
assert.deepEqual(k({ t: "x", post: "+ 4 = 9", a: "5" }), { kind: "inverse", a: 9, b: 4, op: "-", asked: "+", x: 5 });
assert.deepEqual(k({ t: "x", post: "– 3 = 4", a: "7" }), { kind: "inverse", a: 4, b: 3, op: "+", asked: "-", x: 7 });
assert.deepEqual(k({ t: "Ada berapa apel?", c: "🍎🍎🍎🍎🍎", a: "5" }), { kind: "count", emoji: "🍎", n: 5 });
assert.equal(k({ t: "x", c: "🍎🍎🍏", a: "3" }).kind, "fill");
assert.deepEqual(k({ t: "x", pre: "6, 7,", post: ", 9", a: "8" }), { kind: "seq", items: [6, 7, 8, 9], at: 2, d: 1 });
assert.deepEqual(k({ t: "x", pre: "10, 9,", a: "8" }), { kind: "seq", items: [10, 9, 8], at: 2, d: -1 });
assert.deepEqual(k({ t: "x", post: "– jan", a: "hu" }), { kind: "tiles", before: [], after: ["jan"], word: "hujan" });
assert.deepEqual(k({ t: "x", pre: "ta –", a: "hu" }), { kind: "tiles", before: ["ta"], after: [], word: "tahu" });
assert.deepEqual(k({ t: "x", pre: "tan + hu =", a: "hutan" }), { kind: "join", parts: ["tan", "hu"], word: "hutan" });
assert.equal(k({ t: "Siapa namamu …", o: ["?", "!"], a: "?" }).word, "siapa");
assert.equal(k({ t: "Awas, ada lubang …", o: ["?", "!"], a: "!" }).word, null);
assert.equal(k({ t: "x", o: ["maaf", "tolong", "terima kasih", "permisi"], a: "maaf" }).kind, "ajaib");
assert.equal(k({ t: "x", o: ["a", "b"], a: "a" }).kind, "choice");
assert.equal(graphemes("🧑‍🚒 🧑‍🚒").length, 2);

const counts = {};
let noText = 0;
for (const s of ALL_SUBJECTS) for (const ch of s.chapters) for (const src of ch.all) {
  const q = { src, opts: src.o ?? null };
  const info = explainKind(q);
  counts[info.kind] = (counts[info.kind] ?? 0) + 1;
  const text = closingText(q, info);
  assert.ok(typeof text === "string" && text.length >= 15, `penutup kosong: ${src.t}`);
  if (!src.e && !info.rule) noText++;
  if (info.kind === "tiles") assert.ok(info.word.length >= 3, `kata terlalu pendek: ${src.t}`);
  if (info.kind === "calc") assert.equal(String(info.result), src.a);
}
assert.equal(noText, 0, "ada soal tanpa penjelasan maupun aturan");
console.log("Jenis pembahasan:", Object.entries(counts).map(([a, b]) => `${a} ${b}`).join(", "));
console.log("Semua soal punya pembahasan.");
