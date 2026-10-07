// Uji pembentukan catatan latihan dan rangkuman riwayat.
import assert from "node:assert/strict";
import { buildAttempt, lastScoreByKey, questionText, summarize } from "../src/lib/progress.js";

const q = (id, src, opts = null) => ({ id, src, opts });
const sections = [
  { id: "x", label: "Bab 1: Tes", short: "Bab 1", questions: [
    q("x-1", { t: "Hitung hasilnya.", pre: "3 + 4 =", a: "7" }),
    q("x-2", { t: "Ibu kota Indonesia?", o: ["Jakarta", "Medan"], a: "Jakarta" }, ["Jakarta", "Medan"]),
    q("x-3", { t: "Lengkapi katanya.", c: "Air dari langit", post: "– jan", a: "hu" }),
  ] },
];
const route = { key: "#/mtk/mtk-1", eyebrow: "Matematika", title: "Bab 1: Tes" };

const a1 = buildAttempt(route, sections, { "x-1": "8", "x-2": "Jakarta" }, 1000);
assert.equal(a1.right, 1); assert.equal(a1.total, 3); assert.equal(a1.nilai, 33);
assert.equal(a1.wrong.length, 2);
assert.deepEqual(a1.wrong.map((w) => w.given), ["8", null]);
assert.equal(a1.parts[0].right, 1);
assert.equal(questionText(a1.wrong[0]), "Hitung hasilnya. 3 + 4 = ___");
assert.equal(questionText(a1.wrong[1]), "Lengkapi katanya. ___ – jan · Air dari langit");
assert.ok(!JSON.stringify(a1).includes("undefined"));
for (const w of a1.wrong) for (const v of Object.values(w)) assert.notEqual(v, undefined, "Firestore menolak nilai undefined");

const a2 = buildAttempt(route, sections, { "x-1": "7", "x-2": "Jakarta", "x-3": "ha" }, 2000);
assert.equal(a2.nilai, 67);
const a3 = buildAttempt({ ...route, key: "#/mtk/mtk-2", title: "Bab 2" }, sections, { "x-1": "7", "x-2": "Jakarta", "x-3": "hu" }, 3000);
assert.equal(a3.nilai, 100); assert.equal(a3.wrong.length, 0);

const sum = summarize([a3, a1, a2]);
assert.deepEqual(sum.topics.map((t) => [t.key, t.last, t.best, t.count, t.avg]), [["#/mtk/mtk-1", 67, 67, 2, 50], ["#/mtk/mtk-2", 100, 100, 1, 100]]);
assert.equal(sum.frequent[0].t, "Lengkapi katanya."); assert.equal(sum.frequent[0].times, 2); assert.equal(sum.frequent[0].given, "ha");
assert.deepEqual(lastScoreByKey([a3, a1, a2]), { "#/mtk/mtk-1": 67, "#/mtk/mtk-2": 100 });
console.log("Catatan latihan dan rangkuman riwayat valid.");
