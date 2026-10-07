/* Jalur "Berhitung Lancar": latihan hitung berjenjang dengan langkah sangat kecil.
   Urutan materinya mengikuti pola latihan berhitung bertahap (membilang, +1, +2, ... lalu pengurangan,
   lalu bilangan dua dan tiga angka). Soal dibuat oleh kode, dengan acakan tetap supaya isi level tidak berubah. */

function rng(seedText) {
  let seed = [...seedText].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);
  return () => {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 10;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/* Ambil SIZE butir berbeda dari daftar calon, urutan acak tetap */
function take(name, candidates) {
  const rand = rng(name);
  const list = [...candidates];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  if (list.length < SIZE) throw new Error(`Blok "${name}" hanya punya ${list.length} calon soal`);
  return list.slice(0, SIZE);
}

const digits = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];

function explainAdd(x, y) {
  const r = x + y;
  if (r <= 20) return `${x} ditambah ${y} hasilnya adalah ${r}.`;
  if (y <= 10) return `Mulai dari ${x}, lalu maju ${y} langkah. Sampai di ${r}. Jadi ${x} + ${y} = ${r}.`;
  const [, xp, xs] = digits(x), [, yp, ys] = digits(y);
  if (x < 100 && y < 100) {
    const s = xs + ys;
    return s < 10
      ? `Satuan: ${xs} + ${ys} = ${s}. Puluhan: ${xp} + ${yp} = ${xp + yp}. Jadi hasilnya adalah ${r}.`
      : `Satuan: ${xs} + ${ys} = ${s}, tulis ${s % 10} dan simpan 1. Puluhan: ${xp} + ${yp} + 1 = ${xp + yp + 1}. Jadi hasilnya ${r}.`;
  }
  return `Jumlahkan dari kanan: satuan dulu, lalu puluhan, lalu ratusan. Kalau lebih dari 9, simpan 1. Hasilnya ${r}.`;
}

function explainSub(x, y) {
  const r = x - y;
  if (x <= 20) return `${x} dikurangi ${y} hasilnya adalah ${r}.`;
  if (y <= 10) return `Mulai dari ${x}, lalu mundur ${y} langkah. Sampai di ${r}. Jadi ${x} – ${y} = ${r}.`;
  const [, xp, xs] = digits(x), [, yp, ys] = digits(y);
  if (x < 100) {
    return xs >= ys
      ? `Satuan: ${xs} – ${ys} = ${xs - ys}. Puluhan: ${xp} – ${yp} = ${xp - yp}. Jadi hasilnya adalah ${r}.`
      : `Satuan ${xs} kurang dari ${ys}, jadi pinjam 1 puluhan: ${xs + 10} – ${ys} = ${xs + 10 - ys}. Puluhan: ${xp - 1} – ${yp} = ${xp - 1 - yp}. Hasilnya ${r}.`;
  }
  return `Kurangi dari kanan: satuan dulu, lalu puluhan, lalu ratusan. Kalau tidak cukup, pinjam 1 dari kiri. Hasilnya ${r}.`;
}

const add = ([x, y]) => ({ t: "Hitung hasilnya.", pre: `${x} + ${y} =`, a: String(x + y), e: explainAdd(x, y) });
const sub = ([x, y]) => ({ t: "Hitung hasilnya.", pre: `${x} – ${y} =`, a: String(x - y), e: explainSub(x, y) });
const next = (n) => ({ t: "Lanjutkan urutan bilangan.", pre: `${n - 2}, ${n - 1},`, a: String(n), e: `Bilangan bertambah 1 setiap kali. Sesudah ${n - 1} adalah ${n}.` });
const between = (n) => ({ t: "Bilangan berapa yang hilang?", pre: `${n - 1},`, post: `, ${n + 1}`, a: String(n), e: `Bilangan bertambah 1 setiap kali. Di antara ${n - 1} dan ${n + 1} ada ${n}.` });

/* Semua pasangan [x, y] yang memenuhi syarat */
const pairs = (xs, ys, ok = () => true) => xs.flatMap((x) => ys.filter((y) => ok(x, y)).map((y) => [x, y]));

const block = (name, make, candidates) => ({ name, questions: take(name, candidates).map(make) });
const plus = (name, ys, max) => block(name, add, pairs(range(1, max), ys));
const plusTo = (name, lo, hi) => block(name, add, pairs(range(2, hi), range(2, 10), (x, y) => x + y > lo && x + y <= hi));
const minus = (name, ys, max) => block(name, sub, pairs(range(2, max), ys, (x, y) => x > y));
const minusFrom = (name, lo, hi) => block(name, sub, pairs(range(lo, hi), range(2, 10), (x, y) => x - y >= 1));

const noCarry = (x, y) => (x % 10) + (y % 10) < 10;
const noBorrow = (x, y) => x % 10 >= y % 10;

export const MTK_DEV = [
  {
    id: "mtk-k1", title: "Berhitung Lancar 1: Bilangan dan Tambah 1–3", short: "Berhitung 1", icon: "🌱", target: 120,
    hint: "Urutan bilangan sampai 120, lalu menambah 1, 2, dan 3.",
    blocks: [
      block("Urutan sampai 50", next, range(12, 50)),
      block("Urutan sampai 100", (n) => (n % 2 ? next(n) : between(n)), range(52, 99)),
      block("Urutan sampai 120", (n) => (n % 2 ? next(n) : between(n)), range(98, 119)),
      plus("Tambah 1 sampai 12 + 1", [1], 12),
      plus("Tambah 1 sampai 30 + 1", [1], 30),
      block("Tambah 1 sampai 100 + 1", add, pairs(range(31, 100), [1])),
      plus("Tambah 2 sampai 14 + 2", [2], 14),
      block("Tambah 2 sampai 32 + 2", add, pairs(range(13, 32), [2])),
      plus("Tambah 3 sampai 14 + 3", [3], 14),
      block("Tambah 3 sampai 21 + 3", add, pairs(range(10, 21), [3])),
      plus("Campuran tambah 1, 2, 3", [1, 2, 3], 20),
    ],
  },
  {
    id: "mtk-k2", title: "Berhitung Lancar 2: Tambah 4–10", short: "Berhitung 2", icon: "🌿", target: 120,
    hint: "Menambah 4, 5, 6, sampai 10, satu per satu.",
    blocks: [
      plus("Tambah 4 sampai 12 + 4", [4], 12),
      block("Tambah 4 sampai 16 + 4", add, pairs(range(5, 16), [4])),
      plus("Tambah 5 sampai 15 + 5", [5], 15),
      plus("Campuran tambah sampai 5", [1, 2, 3, 4, 5], 12),
      plus("Tambah 6 sampai 14 + 6", [6], 14),
      plus("Tambah 7 sampai 13 + 7", [7], 13),
      plus("Campuran tambah sampai 7", [4, 5, 6, 7], 12),
      plus("Tambah 8 sampai 12 + 8", [8], 12),
      plus("Tambah 9 sampai 12 + 9", [9], 12),
      plus("Tambah 10 sampai 15 + 10", [10], 15),
      plus("Campuran tambah sampai 10 (1)", [6, 7, 8, 9, 10], 9),
      plus("Campuran tambah sampai 10 (2)", [2, 3, 4, 5, 6, 7, 8, 9, 10], 12),
    ],
  },
  {
    id: "mtk-k3", title: "Berhitung Lancar 3: Penjumlahan dan Pengurangan", short: "Berhitung 3", icon: "🌳", target: 150,
    hint: "Penjumlahan sampai 28, lalu pengurangan dari bilangan sampai 20.",
    blocks: [
      plusTo("Penjumlahan, hasil sampai 12", 8, 12),
      plusTo("Penjumlahan, hasil sampai 15", 12, 15),
      plusTo("Penjumlahan, hasil sampai 18", 15, 18),
      plusTo("Penjumlahan, hasil sampai 20", 17, 20),
      plusTo("Penjumlahan, hasil sampai 28", 20, 28),
      plusTo("Rangkuman penjumlahan", 9, 28),
      minus("Kurang 1", [1], 20),
      minus("Kurang 2", [2], 20),
      minus("Kurang 3", [3], 20),
      minus("Campuran kurang sampai 3", [1, 2, 3], 15),
      minus("Campuran kurang sampai 5", [4, 5], 15),
      minusFrom("Pengurangan dari bilangan sampai 10", 5, 10),
      minusFrom("Pengurangan dari bilangan sampai 12", 11, 12),
      minusFrom("Pengurangan dari bilangan sampai 14", 13, 14),
      minusFrom("Pengurangan dari bilangan sampai 16", 15, 16),
      minusFrom("Pengurangan dari bilangan sampai 20", 17, 20),
      minusFrom("Rangkuman pengurangan", 8, 20),
    ],
  },
  {
    id: "mtk-k4", title: "Berhitung Lancar 4: Dua dan Tiga Angka", short: "Berhitung 4", icon: "🚀", target: 240,
    hint: "Penjumlahan dan pengurangan bilangan besar. Hitung dari satuan dulu.",
    blocks: [
      block("Puluhan ditambah satuan", add, pairs(range(21, 89), range(2, 9), noCarry)),
      block("Puluhan ditambah satuan, menyimpan", add, pairs(range(15, 89), range(4, 9), (x, y) => !noCarry(x, y))),
      block("Dua angka + dua angka", add, pairs(range(11, 68), range(11, 45), (x, y) => noCarry(x, y) && x + y < 100)),
      block("Dua angka + dua angka, menyimpan", add, pairs(range(15, 68), range(13, 29), (x, y) => !noCarry(x, y) && x + y < 100)),
      block("Tiga angka + dua angka", add, pairs(range(110, 480).filter((n) => n % 7 === 0), range(12, 59).filter((n) => n % 3 === 0))),
      block("Tiga angka + tiga angka", add, pairs(range(120, 520).filter((n) => n % 13 === 0), range(115, 430).filter((n) => n % 17 === 0))),
      block("Puluhan dikurangi satuan", sub, pairs(range(24, 99), range(2, 9), noBorrow)),
      block("Dua angka – dua angka", sub, pairs(range(35, 99), range(11, 58), (x, y) => noBorrow(x, y) && x - y > 10)),
      block("Dua angka – dua angka, meminjam", sub, pairs(range(31, 95), range(13, 59), (x, y) => !noBorrow(x, y) && x - y > 3)),
      block("Tiga angka – dua angka", sub, pairs(range(120, 480).filter((n) => n % 11 === 0), range(12, 79).filter((n) => n % 4 === 0))),
      block("Tiga angka – tiga angka", sub, pairs(range(400, 990).filter((n) => n % 13 === 0), range(110, 380).filter((n) => n % 17 === 0))),
    ],
  },
];
