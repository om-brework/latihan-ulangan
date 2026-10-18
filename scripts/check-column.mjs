// Uji penjumlahan bersusun: rencana per kolom, isian anak, dan bank soalnya.
import assert from "node:assert/strict";
import { carryOk, columnAnswer, columnPlan, fillOrder } from "../src/lib/column.js";
import { isCorrect } from "../src/lib/grade.js";
import { MTK_DEV } from "../src/data/pengembangan/mtk.js";

const p = columnPlan(47, 38);
assert.equal(p.cols, 3);
assert.deepEqual(p.res, [5, 8, 0]);
assert.deepEqual(p.carry, [0, 1, 0]);
assert.deepEqual(columnPlan(754, 551).res, [5, 0, 3, 1]);
assert.deepEqual(columnPlan(754, 551).carry, [0, 0, 1, 1]);
assert.deepEqual(fillOrder(3), ["d0", "c1", "d1", "c2", "d2"]);

assert.equal(columnAnswer({ d: ["5", "8", ""], c: ["", "1", ""] }), "85");
assert.equal(columnAnswer({ d: ["5", "8", "0"], c: ["", "", ""] }), "85"); // nol di depan diabaikan
assert.equal(columnAnswer({ d: ["5", "", "1"], c: ["", "", ""] }), null); // ada kotak bolong
assert.equal(columnAnswer({ d: ["", "", ""], c: ["", "", ""] }), null);
assert.equal(columnAnswer(undefined), null);
assert.equal(columnAnswer({ d: ["5", "", ""], c: ["", "", ""] }, 2), null); // puluhan belum diisi
assert.ok(!isCorrect({ src: { col: [47, 38], a: "85" }, opts: null }, { d: ["5", "", ""], c: ["", "", ""] }));
assert.ok(carryOk({ c: ["", "1", ""] }, p, 1));
assert.ok(carryOk({ c: ["", "1", "0"] }, p, 2)); // 0 sama dengan tidak ada simpanan
assert.ok(!carryOk({ c: ["", "", ""] }, p, 1));

const q = { src: { col: [47, 38], a: "85" }, opts: null };
assert.ok(isCorrect(q, { d: ["5", "8", ""], c: ["", "1", ""] }));
assert.ok(!isCorrect(q, { d: ["5", "7", ""], c: ["", "", ""] }));

const ch = MTK_DEV.find((c) => c.id === "mtk-bersusun");
assert.ok(ch, "bab Penjumlahan Bersusun ada");
for (const b of ch.blocks) {
  assert.equal(b.questions.length, 10, b.name);
  for (const s of b.questions) {
    const [x, y] = s.col;
    assert.equal(s.a, String(x + y));
    const plan = columnPlan(x, y);
    assert.equal(Number(plan.res.slice().reverse().join("")), x + y, `${x} + ${y}`);
  }
}
console.log(`Penjumlahan bersusun valid: ${ch.blocks.length} level.`);
