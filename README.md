# Latihan Ulangan Kelas 1

Latihan interaktif untuk anak kelas 1 SD. Di halaman depan anak memilih pelajaran, lalu memilih bab; aplikasi mengambil soal secara acak dari bank soal dan menghitung nilai otomatis.

## Isi bank soal (1.180 soal)

| Pelajaran | Bab | Soal | File |
|---|---|---|---|
| Bahasa Indonesia | 8 | 320 | `src/data/mapel/bi.json` |
| Matematika | 8 | 320 | `src/data/mapel/mtk.json` |
| Pendidikan Pancasila | 4 | 240 | `src/data/mapel/pp.json` |
| Ulangan Bahasa Indonesia 5 Oktober 2026 | 5 materi | 300 | `src/data/bank.js` |

Bank soal per bab disusun dari buku siswa Kurikulum Merdeka kelas I. Tiap bab menampilkan 20 soal acak; "Campuran semua bab" sekitar 30 soal.

## Mode Belajar (Matematika)

Tiap bab Matematika punya tombol **Belajar**: 2 sampai 4 langkah penjelasan konsep dengan alat peraga interaktif (membilang, garis bilangan, pasangan bilangan, kotak sepuluh, bentuk, mengukur, tabel dan diagram gambar), lalu lanjut ke latihan soal. Materinya ada di `src/lessons/mtk.jsx`, alat peraganya di `src/lessons/widgets.jsx`.

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan
npm test         # validasi semua bank soal dan penyusunan kuis
npm run build    # hasil build di folder dist/
```

## Deploy ke Vercel

Import repo ini di Vercel. Framework **Vite** terdeteksi otomatis (build `npm run build`, output `dist`). Navigasi memakai alamat `#/mapel/bab`, jadi tidak perlu aturan rewrite.

## Menambah atau mengubah soal

Sunting file JSON di `src/data/mapel/`, lalu jalankan `npm test`.

```jsonc
// Pilihan ganda (urutan pilihan diacak, kecuali "keep": true)
{ "t": "Lambang negara Indonesia adalah …", "o": ["Garuda Pancasila", "Merah Putih", "Indonesia Raya"], "a": "Garuda Pancasila" }
// Isian: kunci satu kata huruf kecil atau angka
{ "t": "Hitung hasilnya.", "pre": "3 + 4 =", "a": "7" }
{ "t": "Lengkapi katanya.", "c": "Air yang turun dari langit", "post": "– jan", "a": "hu" }
```

Field opsional: `c` (petunjuk; ` | ` memisahkan baris), `pre`/`post` (teks sebelum/sesudah kotak isian), `wide` (kotak isian lebar), `g` (soal dengan `g` yang sama tidak muncul bersamaan).

## Struktur

- `src/data/catalog.js`: daftar pelajaran dan bab, penyusun kuis, dan alamat halaman.
- `src/lib/random.js`, `src/lib/grade.js`: pengacakan dan penilaian.
- `src/App.jsx`: halaman depan dan pemilihan bab. `src/components/`: kuis, soal, kartu nilai.
- `scripts/`: validator bank soal.
