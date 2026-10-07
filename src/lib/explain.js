/* Menentukan jenis pembahasan untuk sebuah soal. Tidak bergantung pada React, supaya bisa diuji. */
import { KATA } from "../data/bank.js";

const TANYA = ["di mana", "ke mana", "dari mana", "jam berapa", "siapa", "apakah", "apa", "kapan", "berapa", "mengapa", "kenapa", "bagaimana", "bolehkah", "sudahkah", "mana"];
const isNum = (s) => /^\d+$/.test(s);
const isWord = (s) => /^[a-z]+$/.test(s);

export function graphemes(text) {
  const s = String(text).replace(/\s+/g, "");
  if (typeof Intl !== "undefined" && Intl.Segmenter) return [...new Intl.Segmenter("id", { granularity: "grapheme" }).segment(s)].map((x) => x.segment);
  return [...s];
}

export const AJAIB = {
  "tolong": "saat meminta bantuan",
  "terima kasih": "saat diberi atau dibantu",
  "maaf": "saat berbuat salah",
  "permisi": "saat mau lewat atau masuk",
};

const MARK_RULE = {
  "?": "Kalimat tanya diakhiri tanda tanya (?).",
  "!": "Seruan, ajakan, perintah, dan larangan diakhiri tanda seru (!).",
  ".": "Kalimat yang memberi tahu sesuatu diakhiri tanda titik (.).",
};

/* Mengembalikan { kind, ... } untuk soal q = { src, opts } */
export function explainKind(q) {
  const s = q.src, a = String(s.a);
  const pre = (s.pre ?? "").trim(), post = (s.post ?? "").trim();
  let m, m2;

  if (!s.o) {
    // 3 + 4 =   |   9 – 2 =
    if (!post && (m = pre.match(/^(\d+)\s*([+–-])\s*(\d+)\s*=$/))) {
      const x = +m[1], y = +m[3], op = m[2] === "+" ? "+" : "-";
      const r = op === "+" ? x + y : x - y;
      if (String(r) === a && r >= 0 && Math.max(x, r) <= 20) return { kind: "calc", a: x, b: y, op, result: r };
    }
    // 2 + 3 + 4 =   |   9 – 2 – 4 =   |   6 + 3 – 2 =
    if (!post && (m = pre.match(/^(\d+)\s*([+–-])\s*(\d+)\s*([+–-])\s*(\d+)\s*=$/))) {
      const sign = (t) => (t === "+" ? "+" : "-");
      const calc = (x, op, y) => (op === "+" ? x + y : x - y);
      const x = +m[1], y = +m[3], z = +m[5], op1 = sign(m[2]), op2 = sign(m[4]);
      const r1 = calc(x, op1, y), r2 = calc(r1, op2, z);
      if (String(r2) === a && [x, r1, r2].every((v) => v >= 0 && v <= 20)) return { kind: "chain", steps: [{ a: x, b: y, op: op1 }, { a: r1, b: z, op: op2 }], result: r2 };
    }
    // _ + 4 = 9   |   _ – 3 = 4   (bekerja mundur)
    if (!pre && (m = post.match(/^([+–-])\s*(\d+)\s*=\s*(\d+)$/))) {
      const op = m[1] === "+" ? "+" : "-", b = +m[2], c = +m[3];
      const x = op === "+" ? c - b : c + b;
      if (String(x) === a && x >= 0 && Math.max(x, c) <= 20) return { kind: "inverse", a: c, b, op: op === "+" ? "-" : "+", asked: op, x };
    }
    // 3 + _ = 7   |   9 – _ = 4
    if ((m = pre.match(/^(\d+)\s*([+–-])$/)) && (m2 = post.match(/^=\s*(\d+)$/))) {
      const x = +m[1], c = +m2[1], op = m[2] === "+" ? "+" : "-";
      const b = op === "+" ? c - x : x - c;
      if (String(b) === a && b >= 0 && Math.max(x, c) <= 20) return { kind: "missing", a: x, c, op, b };
    }
    // membilang deretan emoji yang sama
    if (isNum(a) && s.c && !pre && !post) {
      const g = graphemes(s.c);
      if (g.length === +a && g.length >= 1 && g.length <= 20 && g.every((x) => x === g[0]) && !/[\w\d]/.test(g[0])) return { kind: "count", emoji: g[0], n: g.length };
    }
    // 6, 7, _, 9
    if (isNum(a) && (pre || post) && /^[\d,\s]*$/.test(pre) && /^[\d,\s]*$/.test(post)) {
      const left = pre.split(",").map((x) => x.trim()).filter(Boolean).map(Number);
      const right = post.split(",").map((x) => x.trim()).filter(Boolean).map(Number);
      const items = [...left, +a, ...right];
      if (items.length >= 3) {
        const d = items[1] - items[0];
        if (d !== 0 && items.every((v, i) => i === 0 || v - items[i - 1] === d)) return { kind: "seq", items, at: left.length, d };
      }
    }
    // tan + hu =
    if (!post && (m = pre.match(/^([a-z]+)\s*\+\s*([a-z]+)\s*=$/)) && (a === m[1] + m[2] || a === m[2] + m[1])) {
      return { kind: "join", parts: [m[1], m[2]], word: a };
    }
    // __ – jan   |   ta – __
    if (isWord(a) && (pre || post) && /[–-]/.test(pre + post) && !/[+=\d]/.test(pre + post)) {
      const before = pre.split(/[–-]/).map((x) => x.trim()).filter(Boolean);
      const after = post.split(/[–-]/).map((x) => x.trim()).filter(Boolean);
      if ([...before, ...after].every(isWord)) return { kind: "tiles", before, after, word: [...before, a, ...after].join("") };
    }
    return { kind: "fill" };
  }

  if (s.o.every((o) => o in MARK_RULE)) {
    const sentence = s.t.includes(":") ? s.t.slice(s.t.lastIndexOf(":") + 1) : s.t;
    const clean = sentence.replace(/[“”"…]/g, "").replace(/\.{3}/g, "").trim();
    const word = TANYA.find((w) => clean.toLowerCase().startsWith(w + " ") || clean.toLowerCase() === w) ?? null;
    return { kind: "marks", sentence: clean, word: a === "?" ? word : null, rule: MARK_RULE[a] };
  }
  if (s.o.length === KATA.length && KATA.every((k) => s.o.includes(k))) return { kind: "ajaib", rule: `Kita berkata “${a}” ${AJAIB[a]}.` };
  return { kind: "choice" };
}

/* Kalimat penutup: penjelasan dari bank soal, atau aturan umum jenis soalnya */
export function closingText(q, info) {
  return q.src.e ?? info.rule ?? `Jawaban yang benar adalah ${q.src.a}.`;
}
