/* Materi Belajar Matematika kelas 1, satu daftar langkah per bab.
   Tiap langkah: judul, penjelasan singkat, alat peraga, dan tantangan "Coba". */
import {
  Adder, Bond, Compare, ComposeShapes, Counter, DataChart, Difference, Doubles, FactFamily, GroupBy,
  HopCalc, Hopper, LengthCompare, MakeTen, Measure, ShapeExplorer, TakeAway, Teen, TeenOp,
} from "./widgets.jsx";

export const LESSONS = {
  "mtk-1": [
    {
      title: "Membilang benda",
      text: ["Membilang artinya menghitung banyak benda satu per satu.", "Setiap bilangan punya lambang dan nama. Kalau tidak ada benda sama sekali, bilangannya 0 (nol)."],
      widget: <Counter />,
      coba: "Buat 7 apel. Lalu ambil semuanya sampai tinggal 0.",
    },
    {
      title: "Lebih banyak, lebih sedikit, sama banyak",
      text: ["Pasangkan satu kucing dengan satu ikan.", "Kalau ada kucing yang tidak dapat ikan, kucing lebih banyak. Kalau semua pas, keduanya sama banyak."],
      widget: <Compare />,
      coba: "Buat kucing dan ikan sama banyak.",
    },
    {
      title: "Menghitung maju dan mundur",
      text: ["Menghitung maju: bilangannya bertambah 1. Menghitung mundur: bilangannya berkurang 1."],
      widget: <Hopper max={10} start={4} />,
      coba: "Bawa katak ke 10, lalu hitung mundur sampai 0.",
    },
    {
      title: "Pasangan bilangan",
      text: ["Satu bilangan bisa dipecah menjadi dua bagian. Dua bagian itu disebut pasangan bilangan.", "Geser untuk mengubah banyak bola merah dan biru."],
      widget: <Bond />,
      coba: "Temukan semua pasangan bilangan untuk 6.",
    },
  ],
  "mtk-2": [
    {
      title: "Menjumlahkan berarti menggabungkan",
      text: ["Apel merah dan apel hijau digabung, lalu dihitung semuanya.", "Tanda + dibaca “ditambah”. Tanda = menunjukkan hasilnya."],
      widget: <Adder />,
      coba: "Buat 2 + 5. Berapa hasilnya?",
    },
    {
      title: "Menjumlahkan dengan menghitung maju",
      text: ["Mulai dari bilangan pertama, lalu melompat maju sebanyak bilangan kedua.", "Tempat katak berhenti adalah hasilnya."],
      widget: <HopCalc op="+" max={10} a0={3} b0={4} />,
      coba: "Mulai dari 6, maju 3 lompatan.",
    },
    {
      title: "Menjumlahkan dua bilangan yang sama",
      text: ["Kaus kaki selalu berpasangan. Baris atas dan baris bawah sama banyak."],
      widget: <Doubles />,
      coba: "Berapa 4 + 4? Berapa 5 + 5?",
    },
    {
      title: "Pasangan yang hasilnya 10",
      text: ["Ada banyak pasangan bilangan yang jumlahnya 10. Hafalkan, karena sering dipakai."],
      widget: <Bond fixed={10} plus />,
      coba: "Kalau merah 7, biru berapa supaya jadi 10?",
    },
  ],
  "mtk-3": [
    {
      title: "Mengurangi berarti mengambil",
      text: ["Ada kue di piring. Sebagian dimakan. Sisanya dihitung.", "Tanda – dibaca “dikurangi”."],
      widget: <TakeAway />,
      coba: "Ada 8 kue. Makan 3. Sisa berapa?",
    },
    {
      title: "Mengurangi dengan menghitung mundur",
      text: ["Mulai dari bilangan pertama, lalu melompat mundur sebanyak bilangan kedua."],
      widget: <HopCalc op="-" max={10} a0={9} b0={4} />,
      coba: "Mulai dari 10, mundur 6 lompatan.",
    },
    {
      title: "Penjumlahan dan pengurangan berteman",
      text: ["Dari tiga bilangan yang sama, kita bisa membuat kalimat penjumlahan dan pengurangan.", "Kalau tahu 3 + 4 = 7, kamu juga tahu 7 – 4 = 3."],
      widget: <FactFamily />,
      coba: "Buat merah 2 dan biru 5. Baca keempat kalimatnya.",
    },
  ],
  "mtk-4": [
    {
      title: "Tiga kelompok bentuk",
      text: ["Benda di sekitar kita punya bentuk. Ada bentuk lengkung, segitiga, dan segi empat.", "Ketuk nama bentuk untuk melihat cirinya."],
      widget: <ShapeExplorer />,
      coba: "Cari satu benda di rumah untuk tiap bentuk.",
    },
    {
      title: "Mengelompokkan benda",
      text: ["Benda bisa dikelompokkan menurut bentuk, warna, atau ukurannya."],
      widget: <GroupBy />,
      coba: "Kelompokkan menurut warna. Ada berapa yang merah?",
    },
    {
      title: "Menyusun dan mengurai bangun",
      text: ["Dua bangun bisa disusun menjadi bangun baru. Bangun juga bisa diurai menjadi bangun yang lebih kecil."],
      widget: <ComposeShapes />,
      coba: "Susun 2 segitiga. Jadi bentuk apa?",
    },
  ],
  "mtk-5": [
    {
      title: "Sepuluh dan sisanya",
      text: ["Bilangan 11 sampai 20 dibuat dari 1 kotak penuh berisi 10, ditambah beberapa satuan.", "Kotak penuh disebut puluhan. Sisanya disebut satuan."],
      widget: <Teen />,
      coba: "Buat 17. Berapa satuannya?",
    },
    {
      title: "Menghitung maju dan mundur sampai 20",
      text: ["Setelah 10 ada 11, 12, 13, dan seterusnya sampai 20."],
      widget: <Hopper max={20} start={9} />,
      coba: "Mulai dari 9, hitung maju sampai 15.",
    },
    {
      title: "Membandingkan bilangan",
      text: ["Bilangan yang bendanya lebih banyak adalah bilangan yang lebih besar.", "Kita katakan “lebih dari” atau “kurang dari”."],
      widget: <Compare max={20} numbers />,
      coba: "Buat merah 12 dan biru 16. Mana yang lebih besar?",
    },
  ],
  "mtk-6": [
    {
      title: "Lebih dari, kurang dari, dan selisih",
      text: ["Pasangkan donat dengan kue satu per satu. Yang tidak punya pasangan adalah selisihnya.", "Selisih dihitung dengan pengurangan."],
      widget: <Difference />,
      coba: "Buat selisihnya 4.",
    },
    {
      title: "Menjumlahkan dengan membuat 10 dulu",
      text: ["Kalau hasilnya lebih dari 10, penuhkan dulu kotak sampai 10. Sisanya ditambahkan sesudah itu."],
      widget: <MakeTen />,
      coba: "Kerjakan 9 + 4 langkah demi langkah.",
    },
    {
      title: "Belasan ditambah dan dikurangi",
      text: ["Bilangan belasan punya 1 puluhan. Cukup hitung satuannya saja, puluhannya tetap."],
      widget: <TeenOp />,
      coba: "Hitung 15 + 3, lalu 18 – 6.",
    },
  ],
  "mtk-7": [
    {
      title: "Lebih panjang dan lebih pendek",
      text: ["Untuk membandingkan panjang, ratakan dulu salah satu ujungnya. Lalu lihat ujung yang lain."],
      widget: <LengthCompare />,
      coba: "Geser pensil biru. Masih mudah dibandingkan?",
    },
    {
      title: "Mengukur dengan benda",
      text: ["Panjang benda bisa diukur dengan benda lain, misalnya klip kertas.", "Hitung berapa klip yang berjajar dari ujung ke ujung."],
      widget: <Measure />,
      coba: "Buat pita yang panjangnya 4 klip.",
    },
    {
      title: "Alat ukur berbeda, hasil berbeda",
      text: ["Pita yang sama bisa diukur dengan koin, klip kertas, atau jengkal. Hasil hitungannya berbeda."],
      widget: <Measure chooseUnit />,
      coba: "Ukur dengan koin, lalu dengan jengkal. Mana yang hitungannya lebih sedikit?",
    },
  ],
  "mtk-8": [
    {
      title: "Mengumpulkan data dalam tabel",
      text: ["Teman-teman memilih buah kesukaan. Jawaban mereka dicatat di tabel.", "Tabel punya baris dan kolom, sehingga data mudah dibaca."],
      widget: <DataChart view="tabel" />,
      coba: "Tambah anak yang suka anggur sampai menjadi yang paling banyak.",
    },
    {
      title: "Diagram gambar",
      text: ["Data yang sama bisa ditunjukkan dengan gambar. Satu gambar mewakili satu anak.", "Baris yang paling panjang adalah yang paling banyak."],
      widget: <DataChart view="diagram" />,
      coba: "Buah apa yang paling sedikit dipilih? Berapa selisihnya dengan yang paling banyak?",
    },
  ],
};
