# Latihan Ulangan Bahasa Indonesia

Latihan interaktif untuk ulangan Bahasa Indonesia kelas 1 SD. Setiap halaman dibuka (atau tombol **Soal baru** ditekan), aplikasi mengambil 30 soal acak dari bank 300 soal, 6 soal per materi, lalu menghitung nilai otomatis.

Materi: instruksi lisan, tanda tanya dan tanda seru, empat kata ajaib, suku kata ha-hi-hu-he-ho, suku kata ca-ci-cu-ce-co.

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan
npm test         # validasi bank soal
npm run build    # hasil build di folder dist/
```

## Deploy ke Vercel

Import repo ini di Vercel. Framework **Vite** terdeteksi otomatis (build `npm run build`, output `dist`), tidak perlu pengaturan tambahan.

## Struktur

- `src/data/bank.js`: bank soal. Tambah atau ubah soal di sini, lalu jalankan `npm test`.
- `src/lib/random.js`: pengacakan dan pengambilan soal.
- `src/lib/grade.js`: penilaian jawaban.
- `src/App.jsx`, `src/components/`: tampilan.
