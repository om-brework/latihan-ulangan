# Latihan Ulangan Kelas 1

Permainan belajar untuk anak kelas 1 SD. Anak memilih pelajaran dan bab, lalu menyelesaikan level satu per satu. Soal tampil satu per layar (carousel), langsung dinilai, dan tiap soal punya pembahasan langkah demi langkah.

## Isi (1.730 soal dalam 173 level)

| Pelajaran | Bab | Level | Soal | File |
|---|---|---|---|---|
| Bahasa Indonesia | 8 | 32 | 320 | `src/data/mapel/bi.json` |
| Matematika | 8 | 48 | 480 | `src/data/mapel/mtk.json` |
| Pendidikan Pancasila | 4 | 24 | 240 | `src/data/mapel/pp.json` |
| Bahasa Inggris | 13 | 39 | 390 | `src/data/mapel/en.json` |
| Paket ulangan Bahasa Indonesia | 5 materi | 30 | 300 | `src/data/bank.js` |

Bank soal per bab disusun dari buku siswa Kurikulum Merdeka kelas I.

## Bahasa Inggris

- 13 unit mengikuti judul unit buku *My Next Words Grade 1*. Kosakata dan ungkapan tiap unit ada di `src/lessons/en-data.js`; daftar itu disusun dari judul unit dan Capaian Pembelajaran Fase A, belum dicocokkan dengan isi buku.
- Sesuai Capaian Pembelajaran Fase A, fokusnya menyimak dan memirsa: semua soal pilihan ganda, tanpa mengetik atau mengeja.
- Soal dengan field `say` adalah soal menyimak. Teksnya diucapkan dengan fitur baca-teks perangkat (`src/lib/speak.js`); di perangkat tanpa fitur itu, teksnya ditampilkan sebagai tulisan.

## Level dan bintang

- Tiap bab dibagi menjadi level berisi sekitar 10 soal, mengikuti urutan bank soal (`makeLevels` di `src/data/catalog.js`).
- Nilai 60 memberi 1 bintang, 80 memberi 2, dan 100 memberi 3. Minimal 1 bintang membuka level berikutnya.
- **Level tantangan:** bab yang punya field `challenge` (sekarang semua bab Matematika, 20 soal per bab) mendapat level tambahan sesudah level biasa, berisi soal penalaran: dua langkah, bilangan yang hilang, pola, teka-teki bilangan, dan perbandingan bertingkat. Bilangannya tetap dalam batas bab.
- "Tantangan campuran" (15 soal acak dari semua bab) selalu terbuka.
- Nilai terbaik tiap level disimpan di perangkat dan, kalau ada profil anak, di riwayatnya.

## Pembahasan soal

Sesudah soal diperiksa, tombol **Pembahasan** membuka tiga langkah: baca soal, cari jawaban dengan alat peraga, lalu kesimpulan.

- Jenis pembahasan dikenali otomatis dari bentuk soal (`src/lib/explain.js`): hitungan tambah/kurang, bilangan yang hilang, membilang benda, urutan bilangan, melengkapi dan menyusun suku kata, tanda baca, kata ajaib, pilihan ganda, dan isian.
- Kalimat kesimpulan diambil dari field `e` di tiap soal.

## Mode Belajar

Tiap bab di ketiga pelajaran punya tombol **Belajar dulu**: 2 sampai 4 langkah penjelasan konsep dengan alat peraga interaktif. Materinya ada di `src/lessons/mtk.jsx`, `bi.jsx`, dan `pp.jsx`; alat peraganya di `widgets.jsx` dan `widgets2.jsx`.

## Profil anak dan riwayat (Firebase)

Orang tua bisa membuat profil anak (nama panggilan + gambar). Tiap kali **Periksa jawaban** ditekan, nilai dan soal yang salah disimpan untuk anak yang sedang dipilih. Halaman `#/orangtua` menampilkan materi yang perlu dilatih lagi, soal yang sering salah, dan riwayat latihan.

- **Tanpa login** (atau tanpa konfigurasi Firebase): data disimpan di browser perangkat itu saja.
- **Login dengan Google**: data disimpan di Firestore di bawah `users/{uid}/children/{childId}/attempts/{attemptId}`. `firestore.rules` memastikan tiap orang tua hanya bisa membaca dan menulis datanya sendiri.

Data di perangkat tidak dipindahkan otomatis ke akun saat login.

### Menyiapkan Firebase

1. Buat proyek di [Firebase Console](https://console.firebase.google.com), lalu tambahkan **Web app**.
2. **Authentication > Sign-in method**: aktifkan **Google**.
3. **Authentication > Settings > Authorized domains**: tambahkan domain Vercel (dan domain sendiri kalau ada).
4. **Firestore Database**: buat database (mode production), lalu tempel isi `firestore.rules` di tab **Rules** dan Publish. Atau lewat CLI: `npx firebase-tools deploy --only firestore:rules --project <project-id>`.
5. Isi empat variabel konfigurasi. Untuk produksi nilainya ada di `.env.production` (ikut di-commit, dipakai saat `npm run build`); untuk lokal salin `.env.example` menjadi `.env.local`.

Nilai konfigurasi web Firebase bukan rahasia; yang melindungi data adalah `firestore.rules`.

`npm run test:cloud` menjalankan penyimpanan dan aturan keamanan terhadap emulator Firebase (butuh Java dan `firebase-tools`).

Sebelum dibuka untuk umum, isi kontak pengelola di `src/components/PrivacyPage.jsx`.

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

Sunting file JSON di `src/data/mapel/`, lalu jalankan `npm test`. Menambah atau mengurutkan ulang soal mengubah isi level.

```jsonc
// Pilihan ganda (urutan pilihan diacak, kecuali "keep": true)
{ "t": "Lambang negara Indonesia adalah …", "o": ["Garuda Pancasila", "Merah Putih", "Indonesia Raya"], "a": "Garuda Pancasila", "e": "Garuda Pancasila adalah lambang negara Indonesia." }
// Isian: kunci satu kata huruf kecil atau angka
{ "t": "Hitung hasilnya.", "pre": "3 + 4 =", "a": "7", "e": "Mulai dari 3, lalu hitung maju 4 kali: 4, 5, 6, 7." }
```

Field opsional: `say` (teks Inggris yang diucapkan pada soal menyimak), `c` (petunjuk; ` | ` memisahkan baris), `pre`/`post` (teks sebelum/sesudah kotak isian), `wide` (kotak isian lebar), `g` (soal dengan `g` yang sama disebar ke level berbeda), `e` (penjelasan untuk pembahasan).

## Struktur

- `src/data/catalog.js`: daftar pelajaran, bab, level, bintang, dan alamat halaman.
- `src/components/Game.jsx`: permainan satu level (carousel). `Explain.jsx`: pembahasan soal. `Question.jsx`: tampilan satu soal.
- `src/components/Lesson.jsx` dan `src/lessons/`: mode Belajar.
- `src/components/ParentPage.jsx`, `src/lib/session.jsx`, `src/lib/store.js`: profil anak, riwayat, dan login.
- `src/lib/explain.js`, `progress.js`, `grade.js`, `random.js`: logika tanpa tampilan (diuji oleh `npm test`).
- `scripts/`: validator bank soal dan uji.
