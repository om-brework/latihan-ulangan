/* Katalog pelajaran, bab, level, dan alamat halaman. Bank soal per mapel ada di ./mapel/*.json */
import bi from "./mapel/bi.json" with { type: "json" };
import mtk from "./mapel/mtk.json" with { type: "json" };
import pp from "./mapel/pp.json" with { type: "json" };
import { SECTION_INFO, buildPool } from "./bank.js";
import { pick, shuffle } from "../lib/random.js";

export const LEVEL_SIZE = 10;   // soal per level
export const MIXED_SIZE = 15;   // soal di tantangan campuran
export const PASS_SCORE = 60;   // nilai minimal untuk membuka level berikutnya

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

/* Bagi soal satu bab menjadi level berisi sekitar LEVEL_SIZE soal, mengikuti urutan bank soal.
   Soal dengan kelompok (g) yang sama disebar merata supaya sebisa mungkin tidak bertemu di satu level. */
export function makeLevels(questions) {
  if (!questions.length) return [];
  const count = Math.max(1, Math.round(questions.length / LEVEL_SIZE));
  const cap = Math.ceil(questions.length / count);
  const levels = Array.from({ length: count }, () => []);
  const sameGroup = (lv, q) => (q.g === undefined ? 0 : lv.filter((x) => x.g === q.g).length);
  for (const q of questions) {
    let best = null;
    for (const lv of levels) {
      if (lv.length >= cap) continue;
      if (best === null || sameGroup(lv, q) < sameGroup(best, q)) best = lv;
    }
    best.push(q);
  }
  // Perbaikan: tukar soal antar-level selama itu mengurangi soal sekelompok yang bertemu
  const others = (lv, skip, q) => (q.g === undefined ? 0 : lv.filter((x) => x !== skip && x.g === q.g).length);
  for (let pass = 0, moved = true; moved && pass < 20; pass++) {
    moved = false;
    for (const A of levels) {
      for (let i = 0; i < A.length; i++) {
        const q = A[i];
        if (others(A, q, q) === 0) continue;
        search: for (const B of levels) {
          if (B === A) continue;
          for (let j = 0; j < B.length; j++) {
            const r = B[j];
            if (others(A, q, q) + others(B, r, r) > others(B, r, q) + others(A, q, r)) {
              A[i] = r; B[j] = q; moved = true;
              break search;
            }
          }
        }
      }
    }
  }
  return levels;
}

function withLevels(subject) {
  const chapters = subject.chapters.map((ch, i) => ({
    ...ch,
    short: ch.short ?? ch.title.split(":")[0],
    c: ch.c ?? PALETTE[i % PALETTE.length][0],
    cd: ch.cd ?? PALETTE[i % PALETTE.length][1],
    // Level biasa dulu, lalu level tantangan (kalau bab punya soal "challenge")
    levels: [...makeLevels(ch.questions), ...makeLevels(ch.challenge ?? [])],
    hardFrom: makeLevels(ch.questions).length,
    all: [...ch.questions, ...(ch.challenge ?? [])],
  }));
  return { ...subject, chapters, total: chapters.reduce((n, ch) => n + ch.all.length, 0) };
}

export const SUBJECTS = [bi, mtk, pp].map((s) => withLevels({ ...s, ...META[s.id] }));

/* Acak dengan urutan tetap (sama tiap kali dibuka), supaya isi level tidak berubah-ubah */
function fixedShuffle(list, seedText) {
  let seed = [...seedText].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);
  const rand = () => {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Paket khusus: latihan ulangan Bahasa Indonesia (lima materi, A-E).
   Bank soalnya tersusun per jenis (misalnya 30 kalimat tanya lalu 30 seruan), jadi diacak dulu sebelum dibagi level. */
const SPECIAL_POOL = buildPool();
export const SPECIAL = withLevels({
  id: "ulangan-bahasa-indonesia",
  icon: "📝",
  title: "Ulangan Bahasa Indonesia",
  c: "#FFD23F",
  cd: "#E0A800",
  blurb: "Instruksi lisan, tanda tanya dan seru, kata ajaib, suku kata ha dan ca",
  chapters: SECTION_INFO.map((sec) => ({
    id: sec.id,
    title: `${sec.id}. ${sec.title}`,
    short: sec.id,
    hint: sec.hint,
    icon: sec.icon,
    c: sec.c,
    cd: sec.cd,
    marks: sec.marks,
    questions: fixedShuffle(SPECIAL_POOL[sec.id], sec.id),
  })),
});

export const ALL_SUBJECTS = [...SUBJECTS, SPECIAL];

export const levelKey = (subject, ch, n) => `#/${subject.id}/${ch.id}/level/${n}`;

/* Bintang untuk satu level: 60 = 1, 80 = 2, 100 = 3 */
export const levelStars = (nilai) => (nilai === undefined || nilai === null ? 0 : nilai >= 100 ? 3 : nilai >= 80 ? 2 : nilai >= PASS_SCORE ? 1 : 0);

/* Kemajuan satu bab untuk seorang anak. bests: { kunci level: nilai terbaik } */
export function chapterProgress(subject, ch, bests) {
  const levels = ch.levels.map((_, i) => {
    const n = i + 1;
    const best = bests[levelKey(subject, ch, n)];
    return { n, key: levelKey(subject, ch, n), best, stars: levelStars(best), size: ch.levels[i].length, hard: i >= ch.hardFrom };
  });
  levels.forEach((lv, i) => { lv.open = i === 0 || (levels[i - 1].best ?? 0) >= PASS_SCORE; });
  return {
    levels,
    stars: levels.reduce((s, l) => s + l.stars, 0),
    maxStars: levels.length * 3,
    cleared: levels.filter((l) => (l.best ?? 0) >= PASS_SCORE).length,
  };
}

function toSection(base, list) {
  return {
    ...base,
    questions: list.map((src, i) => ({
      id: `${base.id}-${i + 1}`,
      no: i + 1,
      sec: base.id,
      src,
      opts: src.o ? (src.keep ? src.o : shuffle(src.o)) : null,
    })),
  };
}

/* Soal satu level, urutannya diacak tiap kali dimainkan */
export function drawLevel(ch, n) {
  return toSection({ id: `${ch.id}-L${n}`, label: `${ch.title} · Level ${n}`, short: `Level ${n}`, icon: ch.icon, c: ch.c, cd: ch.cd, marks: ch.marks }, shuffle(ch.levels[n - 1]));
}

/* Tantangan campuran: soal acak dari semua bab satu pelajaran */
export function drawMixed(subject) {
  const all = subject.chapters.flatMap((ch) => ch.questions.map((q) => ({ ...q, g: q.g === undefined ? undefined : `${ch.id}:${q.g}` })));
  return toSection({ id: `${subject.id}-mix`, label: "Tantangan campuran", short: "Campuran", icon: "🎲", c: subject.c, cd: subject.cd }, pick(all, MIXED_SIZE));
}

/* Terjemahkan alamat (#/pelajaran/bab/level/n) menjadi halaman yang ditampilkan */
export function resolveRoute(hash) {
  const [a, b, mode, arg] = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!a) return { page: "home" };
  if (a === "orangtua") return { page: "parent" };
  if (a === "privasi") return { page: "privacy" };
  const subject = ALL_SUBJECTS.find((s) => s.id === a);
  if (!subject) return { page: "home" };
  if (!b) return { page: "subject", subject };
  if (b === "semua") {
    return {
      page: "game", key: `#/${subject.id}/semua`, back: `#/${subject.id}`, subject,
      eyebrow: subject.title, title: "Tantangan campuran", heading: "Tantangan campuran",
      c: subject.c, cd: subject.cd, draw: () => drawMixed(subject),
    };
  }
  const ch = subject.chapters.find((c) => c.id === b);
  if (!ch) return { page: "subject", subject };
  if (mode === "belajar") return { page: "lesson", subject, chapter: ch };
  const n = Number(arg);
  if (mode === "level" && Number.isInteger(n) && n >= 1 && n <= ch.levels.length) {
    return {
      page: "game", key: levelKey(subject, ch, n), back: `#/${subject.id}/${ch.id}`, subject, chapter: ch, level: n,
      prev: n > 1 ? levelKey(subject, ch, n - 1) : null,
      next: n < ch.levels.length ? levelKey(subject, ch, n + 1) : null,
      hard: n > ch.hardFrom,
      eyebrow: subject.title, title: `${ch.title} · Level ${n}${n > ch.hardFrom ? " (tantangan)" : ""}`, heading: n > ch.hardFrom ? `🔥 Tantangan · Level ${n}` : `Level ${n}`,
      c: ch.c, cd: ch.cd, draw: () => drawLevel(ch, n),
    };
  }
  return { page: "chapter", subject, chapter: ch };
}
