/* Katalog mapel, bab, dan penyusun kuis. Bank soal per mapel ada di ./mapel/*.json */
import bi from "./mapel/bi.json" with { type: "json" };
import mtk from "./mapel/mtk.json" with { type: "json" };
import pp from "./mapel/pp.json" with { type: "json" };
import { PER_SECTION, SECTION_INFO, buildPool } from "./bank.js";
import { pick, shuffle } from "../lib/random.js";

export const CHAPTER_QUIZ_SIZE = 20;
export const MIXED_QUIZ_SIZE = 30;

const PALETTE = [
  ["#FF8A3D", "#C2500A"],
  ["#FF5FA2", "#C2256B"],
  ["#2DBE7E", "#12804F"],
  ["#9B6BFF", "#6236D6"],
  ["#29A8F2", "#0E6FB0"],
];

const META = {
  bi: { icon: "📖", c: "#FF5FA2", cd: "#C2256B", blurb: "Huruf, suku kata, tanda baca, dan kata ajaib" },
  mtk: { icon: "🔢", c: "#29A8F2", cd: "#0E6FB0", blurb: "Membilang, tambah, kurang, bentuk, dan ukuran" },
  pp: { icon: "🦅", c: "#FF8A3D", cd: "#C2500A", blurb: "Teman, aturan, Indonesia, dan lingkunganku" },
};

export const SUBJECTS = [bi, mtk, pp].map((s) => ({
  ...s,
  ...META[s.id],
  total: s.chapters.reduce((n, ch) => n + ch.questions.length, 0),
  chapters: s.chapters.map((ch, i) => ({
    ...ch,
    short: ch.title.split(":")[0],
    c: PALETTE[i % PALETTE.length][0],
    cd: PALETTE[i % PALETTE.length][1],
  })),
}));

/* Set khusus: latihan ulangan Bahasa Indonesia 5 Oktober 2026 (lima materi, A-E) */
const SPECIAL_POOL = buildPool();
export const SPECIAL = {
  id: "ulangan-5-oktober",
  icon: "📝",
  title: "Ulangan Bahasa Indonesia",
  date: "Senin, 5 Oktober 2026",
  blurb: "Instruksi lisan, tanda tanya dan seru, kata ajaib, suku kata ha dan ca",
  total: Object.values(SPECIAL_POOL).reduce((n, qs) => n + qs.length, 0),
};

function toQuestions(pool, n, sec) {
  return pick(pool, n).map((src, i) => ({
    id: `${sec}-${i + 1}`,
    no: i + 1,
    sec,
    src,
    opts: src.o ? (src.keep ? src.o : shuffle(src.o)) : null,
  }));
}

export function drawSpecial() {
  return SECTION_INFO.map((sec) => ({
    ...sec,
    label: `${sec.id}. ${sec.title}`,
    short: sec.id,
    questions: toQuestions(SPECIAL_POOL[sec.id], PER_SECTION, sec.id),
  }));
}

function chapterSection(ch, n) {
  return { id: ch.id, label: ch.title, short: ch.short, hint: ch.hint, icon: ch.icon, c: ch.c, cd: ch.cd, questions: toQuestions(ch.questions, n, ch.id) };
}

export const drawChapter = (ch) => [chapterSection(ch, CHAPTER_QUIZ_SIZE)];

export function drawMixed(subject) {
  const per = Math.max(3, Math.round(MIXED_QUIZ_SIZE / subject.chapters.length));
  return subject.chapters.map((ch) => chapterSection(ch, per));
}

/* Terjemahkan alamat (#/mapel/bab) menjadi halaman yang ditampilkan */
export function resolveRoute(hash) {
  const [a, b] = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!a) return { page: "home" };
  if (a === SPECIAL.id) {
    return { page: "quiz", back: "#/", eyebrow: SPECIAL.date, title: SPECIAL.title, pool: SPECIAL.total, draw: drawSpecial, parentNote: true };
  }
  const subject = SUBJECTS.find((s) => s.id === a);
  if (!subject) return { page: "home" };
  if (!b) return { page: "subject", subject };
  if (b === "semua") {
    return { page: "quiz", back: `#/${subject.id}`, eyebrow: subject.title, title: "Campuran semua bab", pool: subject.total, draw: () => drawMixed(subject) };
  }
  const ch = subject.chapters.find((c) => c.id === b);
  if (!ch) return { page: "subject", subject };
  return { page: "quiz", back: `#/${subject.id}`, eyebrow: subject.title, title: ch.title, pool: ch.questions.length, draw: () => drawChapter(ch) };
}
