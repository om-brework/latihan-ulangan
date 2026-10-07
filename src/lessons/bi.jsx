/* Materi Belajar Bahasa Indonesia kelas 1, satu daftar langkah per bab */
import { Explorer, LetterCase, OrderTap, Position, SortInto, SyllableBuilder, WordJoin } from "./widgets2.jsx";

const ex = (syl, emoji, at = 0) => ({ syl, emoji, at });

export const BI_LESSONS = {
  "bi-1": [
    {
      title: "Bunyi keras dan bunyi pelan",
      text: ["Di sekitar kita ada banyak bunyi. Ada bunyi yang keras, ada bunyi yang pelan."],
      widget: <SortInto groups={["Keras", "Pelan"]} items={[
        { text: "Bunyi petir", emoji: "⛈️", group: "Keras", why: "Petir bunyinya menggelegar sampai terdengar dari jauh." },
        { text: "Bisikan teman", emoji: "🤫", group: "Pelan", why: "Berbisik artinya berbicara sangat pelan." },
        { text: "Bunyi drum", emoji: "🥁", group: "Keras", why: "Drum yang dipukul bunyinya keras." },
        { text: "Daun jatuh", emoji: "🍂", group: "Pelan", why: "Daun jatuh hampir tidak terdengar." },
        { text: "Klakson truk", emoji: "🚚", group: "Keras", why: "Klakson dibuat keras supaya orang lain mendengar." },
      ]} />,
      coba: "Dengarkan sekitarmu. Bunyi apa yang paling pelan?",
    },
    {
      title: "Huruf kapital dan huruf kecil",
      text: ["Setiap huruf punya dua bentuk: huruf kapital (besar) dan huruf kecil.", "Nama orang selalu diawali huruf kapital."],
      widget: <LetterCase letters={[["A", "Ani"], ["B", "Boni"], ["I", "Ika"], ["U", "Udin"], ["E", "Eko"], ["O", "Oki"]]} />,
      coba: "Tulis namamu. Huruf pertamanya huruf apa?",
    },
    {
      title: "Suku kata ba bi bu be bo",
      text: ["Huruf b digabung dengan a, i, u, e, o menjadi suku kata.", "Ketuk huruf vokal untuk melihat suku katanya."],
      widget: <SyllableBuilder letter="b" examples={{ a: ex(["ba", "tu"], "🪨"), i: ex(["bi", "ru"], "🔵"), u: ex(["bu", "ku"], "📕"), e: ex(["be", "bek"], "🦆"), o: ex(["bo", "la"], "⚽") }} />,
      coba: "Baca keras-keras: ba, bi, bu, be, bo.",
    },
    {
      title: "Menggabungkan suku kata",
      text: ["Dua suku kata digabung menjadi satu kata."],
      widget: <WordJoin words={[{ syl: ["bo", "la"], emoji: "⚽" }, { syl: ["ba", "tu"], emoji: "🪨" }, { syl: ["bu", "ku"], emoji: "📕" }, { syl: ["ba", "ju"], emoji: "👕" }, { syl: ["bi", "ru"], emoji: "🔵" }]} />,
      coba: "Gabungkan semua kata, lalu baca tanpa berhenti.",
    },
  ],
  "bi-2": [
    {
      title: "Tanda tanya dan tanda seru",
      text: ["Kalimat tanya diakhiri tanda tanya (?). Biasanya diawali kata tanya: siapa, apa, di mana, kapan.", "Seruan, ajakan, dan larangan diakhiri tanda seru (!)."],
      widget: <SortInto groups={["?", "!"]} items={[
        { text: "Siapa namamu …", group: "?", why: "Diawali kata tanya “Siapa”, jadi ini kalimat tanya." },
        { text: "Awas, ada lubang …", group: "!", why: "Ini peringatan. Peringatan memakai tanda seru." },
        { text: "Di mana bolaku …", group: "?", why: "“Di mana” dipakai untuk bertanya tempat." },
        { text: "Ayo, kita bermain …", group: "!", why: "Ini ajakan. Ajakan memakai tanda seru." },
        { text: "Jangan berlari di kelas …", group: "!", why: "Ini larangan. Larangan memakai tanda seru." },
        { text: "Kapan kamu pulang …", group: "?", why: "“Kapan” dipakai untuk bertanya waktu." },
      ]} />,
      coba: "Buat satu kalimat tanya untuk temanmu.",
    },
    {
      title: "Suku kata ha hi hu he ho",
      text: ["Huruf h digabung dengan a, i, u, e, o."],
      widget: <SyllableBuilder letter="h" examples={{ a: ex(["ha", "ti"], "❤️"), i: ex(["hi", "dung"], "👃"), u: ex(["hu", "jan"], "🌧️"), e: ex(["he", "wan"], "🐾"), o: ex(["ho", "tel"], "🏨") }} />,
      coba: "Sebutkan satu kata lain yang diawali ha.",
    },
    {
      title: "Suku kata ca ci cu ce co",
      text: ["Huruf c digabung dengan a, i, u, e, o."],
      widget: <SyllableBuilder letter="c" examples={{ a: ex(["ca", "bai"], "🌶️"), i: ex(["ci", "cak"], "🦎"), u: ex(["cu", "ci"], "🧼"), e: ex(["ce", "pat"], "🏃"), o: ex(["co", "ke", "lat"], "🍫") }} />,
      coba: "Baca keras-keras: ca, ci, cu, ce, co.",
    },
    {
      title: "Bermain dengan aman",
      text: ["Bermain itu menyenangkan. Kita harus memilih cara bermain yang aman."],
      widget: <SortInto groups={["Aman", "Berbahaya"]} items={[
        { text: "Bermain bola di lapangan", emoji: "⚽", group: "Aman", why: "Lapangan luas dan jauh dari kendaraan." },
        { text: "Bermain di tengah jalan raya", emoji: "🚗", group: "Berbahaya", why: "Di jalan raya banyak kendaraan lewat." },
        { text: "Memakai helm saat bersepeda", emoji: "🚲", group: "Aman", why: "Helm melindungi kepala kalau terjatuh." },
        { text: "Mendorong teman di tangga", emoji: "🪜", group: "Berbahaya", why: "Teman bisa jatuh dan terluka." },
        { text: "Bergantian naik ayunan", emoji: "🛝", group: "Aman", why: "Bergantian membuat semua bisa bermain dengan tertib." },
      ]} />,
      coba: "Di mana tempat bermain yang aman di dekat rumahmu?",
    },
  ],
  "bi-3": [
    {
      title: "Suku kata ka ki ku ke ko",
      text: ["Huruf k digabung dengan a, i, u, e, o."],
      widget: <SyllableBuilder letter="k" examples={{ a: ex(["ka", "tak"], "🐸"), i: ex(["ki", "jang"], "🦌"), u: ex(["ku", "da"], "🐴"), e: ex(["ke", "la", "pa"], "🥥"), o: ex(["ko", "tak"], "📦") }} />,
      coba: "Baca keras-keras: ka, ki, ku, ke, ko.",
    },
    {
      title: "Membaca kata",
      text: ["Gabungkan suku kata menjadi kata."],
      widget: <WordJoin words={[{ syl: ["ku", "da"], emoji: "🐴" }, { syl: ["ka", "tak"], emoji: "🐸" }, { syl: ["ku", "man"], emoji: "🦠" }, { syl: ["ko", "tak"], emoji: "📦" }, { syl: ["ke", "la", "pa"], emoji: "🥥" }]} />,
      coba: "Kata mana yang punya tiga suku kata?",
    },
    {
      title: "Mencuci tangan",
      text: ["Kuman sangat kecil dan bisa membuat kita sakit. Kuman menempel di tangan yang kotor.", "Cuci tangan dengan urutan yang benar."],
      widget: <OrderTap items={["Basahi tangan", "Pakai sabun", "Gosok sampai berbusa", "Bilas dengan air", "Keringkan"]} doneText="Tangan bersih! 🧼" />,
      coba: "Kapan saja kamu harus mencuci tangan?",
    },
    {
      title: "Menjaga kebersihan",
      text: ["Ada kebiasaan yang membuat kita sehat, ada yang membawa kuman."],
      widget: <SortInto groups={["Sehat", "Membawa kuman"]} items={[
        { text: "Mencuci tangan sebelum makan", emoji: "🧼", group: "Sehat", why: "Kuman di tangan hilang, jadi tidak ikut termakan." },
        { text: "Makan makanan yang jatuh ke tanah", emoji: "🍪", group: "Membawa kuman", why: "Makanan yang jatuh terkena kuman dari tanah." },
        { text: "Menutup mulut dengan lengan saat bersin", emoji: "🤧", group: "Sehat", why: "Kuman tidak menyebar ke orang lain." },
        { text: "Memakai masker saat batuk", emoji: "😷", group: "Sehat", why: "Masker menahan kuman supaya tidak menular." },
        { text: "Jajan makanan yang dihinggapi lalat", emoji: "🪰", group: "Membawa kuman", why: "Lalat membawa kuman ke makanan." },
      ]} />,
      coba: "Ceritakan cara kamu menjaga tubuh tetap bersih.",
    },
  ],
  "bi-4": [
    {
      title: "Suku kata la li lu le lo",
      text: ["Huruf l digabung dengan a, i, u, e, o."],
      widget: <SyllableBuilder letter="l" examples={{ a: ex(["la", "ri"], "🏃"), i: ex(["li", "dah"], "👅"), u: ex(["lu", "tut"], "🦵"), e: ex(["le", "le"], "🐟"), o: ex(["lo", "bak"], "🥕") }} />,
      coba: "Baca keras-keras: la, li, lu, le, lo.",
    },
    {
      title: "Membaca kata",
      text: ["Gabungkan suku kata menjadi kata."],
      widget: <WordJoin words={[{ syl: ["la", "ri"], emoji: "🏃" }, { syl: ["le", "le"], emoji: "🐟" }, { syl: ["la", "lat"], emoji: "🪰" }, { syl: ["le", "bah"], emoji: "🐝" }, { syl: ["lu", "tut"], emoji: "🦵" }]} />,
      coba: "Kata mana yang suku katanya sama dua kali?",
    },
    {
      title: "Pertama, lalu, akhirnya",
      text: ["Saat bercerita, kita memakai kata “pertama”, “lalu”, dan “akhirnya” supaya urutannya jelas."],
      widget: <OrderTap items={["Pertama, Lala bangun tidur.", "Lalu, Lala mandi.", "Akhirnya, Lala berangkat ke sekolah."]} doneText="Ceritanya urut! 📖" />,
      coba: "Ceritakan kegiatanmu tadi pagi dengan tiga kata itu.",
    },
    {
      title: "Mendorong dan menarik",
      text: ["Mendorong membuat benda menjauh dari kita. Menarik membuat benda mendekat ke kita."],
      widget: <SortInto groups={["Mendorong", "Menarik"]} items={[
        { text: "Menutup laci sampai masuk", emoji: "🗄️", group: "Mendorong", why: "Laci bergerak menjauh dari kita." },
        { text: "Membuka laci", emoji: "🗄️", group: "Menarik", why: "Laci bergerak mendekat ke kita." },
        { text: "Menggerakkan troli belanja ke depan", emoji: "🛒", group: "Mendorong", why: "Troli bergerak menjauh di depan kita." },
        { text: "Bermain tarik tambang", emoji: "🪢", group: "Menarik", why: "Tali ditarik ke arah kita." },
      ]} />,
      coba: "Cari satu benda di rumah yang bisa didorong.",
    },
  ],
  "bi-5": [
    {
      title: "Suku kata ma mi mu me mo",
      text: ["Huruf m digabung dengan a, i, u, e, o."],
      widget: <SyllableBuilder letter="m" examples={{ a: ex(["ma", "du"], "🍯"), i: ex(["bu", "mi"], "🌍", 1), u: ex(["mu", "lut"], "👄"), e: ex(["me", "ja"], "🪑"), o: ex(["mo", "bil"], "🚗") }} />,
      coba: "Baca keras-keras: ma, mi, mu, me, mo.",
    },
    {
      title: "Empat kata ajaib",
      text: ["Ada empat kata yang membuat orang senang mendengarnya. Ketuk tiap kata untuk tahu kapan memakainya."],
      widget: <Explorer items={[
        { icon: "🙏", label: "tolong", title: "Tolong", text: "Saat meminta bantuan", example: "“Tolong ambilkan buku itu.”" },
        { icon: "💝", label: "terima kasih", title: "Terima kasih", text: "Saat diberi atau dibantu", example: "“Terima kasih, Nek, kuenya enak.”" },
        { icon: "😔", label: "maaf", title: "Maaf", text: "Saat berbuat salah", example: "“Maaf, aku tidak sengaja.”" },
        { icon: "🚶", label: "permisi", title: "Permisi", text: "Saat mau lewat atau masuk", example: "“Permisi, Bu, saya mau lewat.”" },
      ]} />,
      coba: "Kata ajaib apa yang kamu ucapkan hari ini?",
    },
    {
      title: "Tanda titik",
      text: ["Kalimat yang memberi tahu sesuatu diakhiri tanda titik (.).", "Kalimat tanya diakhiri tanda tanya (?)."],
      widget: <SortInto groups={[".", "?"]} items={[
        { text: "Aku punya teman baru …", group: ".", why: "Kalimat ini memberi tahu, jadi diakhiri titik." },
        { text: "Siapa nama temanmu …", group: "?", why: "Diawali kata tanya “Siapa”." },
        { text: "Mobil itu berwarna merah …", group: ".", why: "Kalimat ini memberi tahu warna mobil." },
        { text: "Di mana rumahmu …", group: "?", why: "“Di mana” dipakai untuk bertanya tempat." },
        { text: "Ibu memasak di dapur …", group: ".", why: "Kalimat ini memberi tahu kegiatan ibu." },
      ]} />,
      coba: "Buat satu kalimat tentang temanmu. Akhiri dengan titik.",
    },
    {
      title: "Menyusun kata menjadi kalimat",
      text: ["Kalimat dimulai dari siapa yang melakukan, lalu apa yang dilakukan.", "Kata pertama dalam kalimat diawali huruf kapital."],
      widget: <OrderTap inline items={["Mimi", "makan", "melon", "manis."]} />,
      coba: "Susun: bermain – Aku – bola.",
    },
  ],
  "bi-6": [
    {
      title: "Suku kata ga gi gu ge go",
      text: ["Huruf g digabung dengan a, i, u, e, o."],
      widget: <SyllableBuilder letter="g" examples={{ a: ex(["ga", "jah"], "🐘"), i: ex(["gi", "gi"], "🦷"), u: ex(["gu", "la"], "🍬"), e: ex(["ge", "las"], "🥛"), o: ex(["go", "ri", "la"], "🦍") }} />,
      coba: "Baca keras-keras: ga, gi, gu, ge, go.",
    },
    {
      title: "Membaca kata",
      text: ["Gabungkan suku kata menjadi kata."],
      widget: <WordJoin words={[{ syl: ["ga", "jah"], emoji: "🐘" }, { syl: ["gi", "gi"], emoji: "🦷" }, { syl: ["gu", "ru"], emoji: "🧑‍🏫" }, { syl: ["gu", "la"], emoji: "🍬" }, { syl: ["gu", "ri", "ta"], emoji: "🐙" }]} />,
      coba: "Hewan apa yang namanya diawali gu?",
    },
    {
      title: "Menghargai teman yang berbeda",
      text: ["Setiap teman berbeda. Ada yang tinggi, ada yang pendek. Ada yang suka menggambar, ada yang suka berlari.", "Berbeda itu tidak apa-apa. Kita tetap berteman."],
      widget: <SortInto groups={["Baik", "Tidak baik"]} items={[
        { text: "Mengajak teman baru bermain", emoji: "🤝", group: "Baik", why: "Teman baru jadi merasa diterima." },
        { text: "Mengejek teman yang berkacamata", emoji: "👓", group: "Tidak baik", why: "Mengejek membuat teman sedih." },
        { text: "Membantu teman yang berkursi roda", emoji: "🧑‍🦽", group: "Baik", why: "Kita saling menolong." },
        { text: "Tidak mau bermain dengan teman yang berbeda", emoji: "🙅", group: "Tidak baik", why: "Semua teman boleh ikut bermain." },
        { text: "Mendengarkan cerita teman", emoji: "👂", group: "Baik", why: "Mendengarkan adalah cara menghargai teman." },
      ]} />,
      coba: "Apa yang berbeda antara kamu dan teman sebangkumu?",
    },
  ],
  "bi-7": [
    {
      title: "Kebutuhan dan keinginan",
      text: ["Kebutuhan adalah hal yang harus ada supaya kita sehat dan bisa belajar.", "Keinginan adalah hal yang kita mau, tetapi tidak harus ada."],
      widget: <SortInto groups={["Kebutuhan", "Keinginan"]} items={[
        { text: "Makan nasi", emoji: "🍚", group: "Kebutuhan", why: "Tubuh perlu makan supaya sehat." },
        { text: "Mainan baru", emoji: "🧸", group: "Keinginan", why: "Tanpa mainan baru, kita tetap sehat." },
        { text: "Air minum", emoji: "💧", group: "Kebutuhan", why: "Tubuh tidak bisa hidup tanpa air." },
        { text: "Permen", emoji: "🍭", group: "Keinginan", why: "Permen enak, tetapi tubuh tidak membutuhkannya." },
        { text: "Seragam sekolah", emoji: "👕", group: "Kebutuhan", why: "Seragam dipakai untuk bersekolah." },
      ]} />,
      coba: "Sebutkan satu keinginanmu. Bisakah ditabung dulu?",
    },
    {
      title: "Mengeja kata",
      text: ["Baca tiap suku kata, lalu gabungkan."],
      widget: <WordJoin words={[{ syl: ["su", "su"], emoji: "🥛" }, { syl: ["ro", "ti"], emoji: "🍞" }, { syl: ["sa", "pi"], emoji: "🐄" }, { syl: ["to", "pi"], emoji: "🧢" }, { syl: ["je", "ruk"], emoji: "🍊" }, { syl: ["pe", "pa", "ya"], emoji: "🥭" }]} />,
      coba: "Eja nama makanan kesukaanmu.",
    },
    {
      title: "Urutan abjad",
      text: ["Huruf punya urutan: a, b, c, d, e, dan seterusnya."],
      widget: <OrderTap inline items={["a", "b", "c", "d", "e", "f"]} doneText="a b c d e f" />,
      coba: "Huruf apa sesudah f?",
    },
    {
      title: "Uang dan menabung",
      text: ["Uang dipakai untuk membeli barang. Kalau belum cukup, kita bisa menabung."],
      widget: <Explorer items={[
        { icon: "🪙", label: "uang logam", title: "Uang logam", text: "Bentuknya bulat dan keras", example: "Disebut juga uang koin." },
        { icon: "💵", label: "uang kertas", title: "Uang kertas", text: "Bentuknya lembaran", example: "Disimpan rapi di dompet." },
        { icon: "🐷", label: "menabung", title: "Menabung", text: "Menyimpan uang sedikit demi sedikit", example: "Uang di celengan lama-lama menjadi banyak." },
      ]} />,
      coba: "Kamu ingin menabung untuk membeli apa?",
    },
  ],
  "bi-8": [
    {
      title: "Kata letak",
      text: ["Kata letak memberi tahu di mana sesuatu berada: atas, bawah, kiri, kanan, dalam, luar."],
      widget: <Position />,
      coba: "Di mana tasmu sekarang? Pakai kata letak.",
    },
    {
      title: "Lawan kata",
      text: ["Lawan kata adalah kata yang artinya berkebalikan."],
      widget: <Explorer items={[
        { icon: "⬆️", label: "atas", title: "atas ↔ bawah", text: "Lawan kata atas adalah bawah", example: "Burung di atas, ikan di bawah." },
        { icon: "⬅️", label: "kiri", title: "kiri ↔ kanan", text: "Lawan kata kiri adalah kanan", example: "Tangan kiri dan tangan kanan." },
        { icon: "📥", label: "dalam", title: "dalam ↔ luar", text: "Lawan kata dalam adalah luar", example: "Buku di dalam tas, sepatu di luar rumah." },
        { icon: "📣", label: "ramai", title: "ramai ↔ sepi", text: "Lawan kata ramai adalah sepi", example: "Pasar ramai, kamar tidur sepi." },
        { icon: "📏", label: "jauh", title: "jauh ↔ dekat", text: "Lawan kata jauh adalah dekat", example: "Bulan jauh, rumah teman dekat." },
      ]} />,
      coba: "Apa lawan kata besar?",
    },
    {
      title: "Petugas di sekitar kita",
      text: ["Di sekitar rumah ada petugas yang menolong kita. Mereka memakai seragam supaya mudah dikenali."],
      widget: <Explorer items={[
        { icon: "👮", label: "polisi", title: "Polisi", text: "Menjaga keamanan dan mengatur lalu lintas", example: "Minta tolong polisi kalau tersesat." },
        { icon: "🧑‍🚒", label: "pemadam", title: "Pemadam kebakaran", text: "Memadamkan api", example: "Datang dengan mobil merah." },
        { icon: "🧑‍⚕️", label: "dokter", title: "Dokter", text: "Memeriksa dan mengobati orang sakit", example: "Bekerja di rumah sakit atau puskesmas." },
        { icon: "💂", label: "satpam", title: "Satpam", text: "Menjaga keamanan sekolah atau gedung", example: "Berjaga di pos dekat gerbang." },
      ]} />,
      coba: "Petugas siapa yang pernah kamu temui?",
    },
    {
      title: "Menjaga diri",
      text: ["Kita harus bisa menjaga diri saat berada di luar rumah."],
      widget: <SortInto groups={["Aman", "Tidak aman"]} items={[
        { text: "Menghafal nama orang tua dan alamat rumah", emoji: "🏠", group: "Aman", why: "Kalau tersesat, petugas bisa membantu mengantarmu pulang." },
        { text: "Ikut orang yang tidak dikenal", emoji: "🚫", group: "Tidak aman", why: "Kita tidak tahu ke mana orang itu membawa kita." },
        { text: "Minta izin orang tua sebelum pergi", emoji: "🙋", group: "Aman", why: "Orang tua tahu kita ada di mana." },
        { text: "Menerima permen dari orang asing", emoji: "🍬", group: "Tidak aman", why: "Tolak dengan sopan, lalu beri tahu orang tua." },
      ]} />,
      coba: "Sebutkan nama lengkap ayah atau ibumu.",
    },
  ],
};
