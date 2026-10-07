/* Materi Belajar Bahasa Inggris kelas 1: tiga langkah per unit, disusun dari en-data.js */
import { EN_UNITS } from "./en-data.js";
import { ListenPick, PhraseCards, VocabCards } from "./widgets3.jsx";

/* Catatan singkat tentang ungkapan tiap unit */
const TIPS = {
  "en-1": "Sapaan berbeda sesuai waktu: pagi, siang, sore, dan malam.",
  "en-2": "“I am …” dipakai untuk memperkenalkan diri.",
  "en-3": "Kalau ditanya “What is your name?”, jawab dengan “My name is …”.",
  "en-4": "“How many?” dipakai untuk menanyakan jumlah.",
  "en-5": "Kalau bendanya lebih dari satu, katanya ditambah s: book menjadi books.",
  "en-6": "“What color is it?” dijawab dengan “It is …” lalu nama warnanya.",
  "en-7": "Kata big atau small diucapkan sebelum nama bentuknya: a big circle.",
  "en-8": "“Do you have …?” dijawab “Yes, I do.” atau “No, I don't.”",
  "en-9": "“This is a …” dipakai untuk menunjukkan sesuatu.",
  "en-10": "He dipakai untuk laki-laki. She dipakai untuk perempuan.",
  "en-11": "“This is my …” dipakai untuk memperkenalkan anggota keluarga.",
  "en-12": "Sesudah he atau she kita memakai has, bukan have.",
  "en-13": "“I like …” artinya aku suka. “I don't like …” artinya aku tidak suka.",
};

/* Unit yang gambarnya mirip atau sama: permainan dengar memakai arti, bukan gambar */
const BY_MEANING = new Set(["en-1", "en-3", "en-10", "en-13"]);

export const EN_LESSONS = Object.fromEntries(
  EN_UNITS.map((u) => [
    u.id,
    [
      {
        title: "Kata-kata baru",
        text: ["Ketuk gambar untuk mendengar katanya dalam bahasa Inggris.", "Tirukan dengan suara keras."],
        widget: <VocabCards items={u.vocab} />,
        coba: "Ketuk semua gambar. Bisakah kamu menyebutkannya tanpa melihat artinya?",
      },
      {
        title: "Ungkapan",
        text: [TIPS[u.id], "Ketuk kalimat untuk mendengarnya, lalu tirukan."],
        widget: <PhraseCards items={u.phrases} />,
        coba: "Ucapkan salah satu kalimat ini kepada ayah atau ibu.",
      },
      {
        title: "Dengar dan pilih",
        text: ["Dengarkan katanya, lalu pilih jawaban yang cocok."],
        widget: <ListenPick items={u.vocab} byMeaning={BY_MEANING.has(u.id)} />,
        coba: "Kumpulkan 5 bintang.",
      },
    ],
  ])
);
