/* Materi Belajar Pendidikan Pancasila kelas 1, satu daftar langkah per bab */
import { Explorer, FlagBuilder, OrderTap, SortInto } from "./widgets2.jsx";

export const PP_LESSONS = {
  "pp-1": [
    {
      title: "Berkenalan dengan teman",
      text: ["Di sekolah kita bertemu teman baru. Berkenalan membuat kita saling mengenal."],
      widget: <OrderTap items={["Ucapkan salam", "Sebutkan namamu", "Tanyakan nama temanmu"]} doneText="Sekarang kalian berteman! 🤝" />,
      coba: "Berkenalanlah dengan satu orang hari ini.",
    },
    {
      title: "Merawat diri",
      text: ["Tubuh kita adalah pemberian Tuhan. Kita merawatnya supaya bersih dan sehat."],
      widget: <Explorer items={[
        { icon: "🚿", label: "mandi", title: "Mandi", text: "Dua kali sehari, pagi dan sore", example: "Badan jadi bersih dan segar." },
        { icon: "🪥", label: "gosok gigi", title: "Menggosok gigi", text: "Sesudah makan pagi dan sebelum tidur", example: "Gigi jadi kuat dan tidak berlubang." },
        { icon: "💅", label: "kuku", title: "Memotong kuku", text: "Saat kuku sudah panjang", example: "Kuku panjang menjadi tempat kuman." },
        { icon: "👕", label: "seragam", title: "Berseragam rapi", text: "Baju dimasukkan dan dikancingkan", example: "Rapi membuat kita siap belajar." },
      ]} />,
      coba: "Apa yang kamu lakukan sendiri tadi pagi?",
    },
    {
      title: "Bermain bersama teman",
      text: ["Setiap permainan punya aturan. Aturan membuat permainan adil dan menyenangkan."],
      widget: <SortInto groups={["Baik", "Tidak baik"]} items={[
        { text: "Bergantian saat bermain lompat tali", emoji: "🪢", group: "Baik", why: "Semua teman mendapat giliran." },
        { text: "Marah saat kalah", emoji: "😠", group: "Tidak baik", why: "Kalah itu biasa. Kita menerimanya dengan lapang dada." },
        { text: "Jujur saat bermain petak umpet", emoji: "🙈", group: "Baik", why: "Permainan jadi adil kalau semua jujur." },
        { text: "Mengubah aturan supaya menang", emoji: "🃏", group: "Tidak baik", why: "Itu curang dan merugikan teman." },
        { text: "Menolong teman yang jatuh", emoji: "🩹", group: "Baik", why: "Menolong adalah sikap peduli." },
      ]} />,
      coba: "Permainan apa yang kamu suka? Apa aturannya?",
    },
    {
      title: "Teman kita berbeda-beda",
      text: ["Teman kita ada yang laki-laki dan perempuan. Ada yang berasal dari daerah lain.", "Kita menghormati semua teman."],
      widget: <SortInto groups={["Menghormati", "Tidak menghormati"]} items={[
        { text: "Bermain dengan teman dari daerah lain", emoji: "🧒", group: "Menghormati", why: "Asal daerah berbeda tidak menghalangi pertemanan." },
        { text: "Menertawakan logat bicara teman", emoji: "😆", group: "Tidak menghormati", why: "Setiap daerah punya cara bicara sendiri." },
        { text: "Memanggil teman dengan namanya", emoji: "👋", group: "Menghormati", why: "Nama adalah identitas yang harus dihargai." },
        { text: "Memilih teman hanya yang sama", emoji: "🙅", group: "Tidak menghormati", why: "Kita berteman dengan semua, bukan hanya yang sama." },
      ]} />,
      coba: "Dari daerah mana teman-teman sekelasmu berasal?",
    },
  ],
  "pp-2": [
    {
      title: "Aturan di rumah",
      text: ["Aturan dibuat supaya rumah tertib dan semua merasa nyaman. Semua anggota keluarga mematuhinya."],
      widget: <Explorer items={[
        { icon: "⏰", label: "bangun pagi", title: "Bangun pagi", text: "Supaya tidak terlambat ke sekolah", example: "Bangun, lalu merapikan tempat tidur." },
        { icon: "🍽️", label: "makan", title: "Makan dengan tertib", text: "Duduk tenang dan menghabiskan makanan", example: "Berdoa sebelum dan sesudah makan." },
        { icon: "🙋", label: "izin", title: "Minta izin", text: "Sebelum pergi bermain", example: "“Bu, aku main ke rumah Dita, ya.”" },
        { icon: "🧸", label: "merapikan", title: "Merapikan mainan", text: "Sesudah selesai bermain", example: "Rumah jadi rapi dan mainan tidak hilang." },
        { icon: "🌙", label: "tidur", title: "Tidur tepat waktu", text: "Supaya badan segar besok pagi", example: "Jangan begadang menonton televisi." },
      ]} />,
      coba: "Aturan apa saja yang ada di rumahmu?",
    },
    {
      title: "Patuh atau melanggar",
      text: ["Mematuhi aturan membuat semua senang. Melanggar aturan bisa merugikan diri sendiri dan orang lain."],
      widget: <SortInto groups={["Patuh", "Melanggar"]} items={[
        { text: "Menyimpan sepatu di rak", emoji: "👟", group: "Patuh", why: "Sepatu mudah dicari dan rumah rapi." },
        { text: "Makan sambil berlari-lari", emoji: "🏃", group: "Melanggar", why: "Aturan makan adalah duduk dengan tenang." },
        { text: "Pulang bermain tepat waktu", emoji: "🕔", group: "Patuh", why: "Orang tua tidak khawatir." },
        { text: "Pergi bermain tanpa izin", emoji: "🚪", group: "Melanggar", why: "Orang tua tidak tahu kita ada di mana." },
        { text: "Mematikan lampu kamar saat pagi", emoji: "💡", group: "Patuh", why: "Listrik jadi hemat." },
      ]} />,
      coba: "Aturan mana yang paling sulit kamu patuhi? Kenapa?",
    },
    {
      title: "Kegiatan pagi yang tertib",
      text: ["Kegiatan pagi dilakukan berurutan supaya tidak terburu-buru."],
      widget: <OrderTap items={["Bangun tidur", "Merapikan tempat tidur", "Mandi", "Sarapan", "Berangkat ke sekolah"]} doneText="Pagi yang tertib! ☀️" />,
      coba: "Jam berapa kamu bangun pagi?",
    },
    {
      title: "Menjaga kebersihan rumah",
      text: ["Rumah yang bersih membuat kita sehat. Semua anggota keluarga ikut menjaganya."],
      widget: <Explorer items={[
        { icon: "🧹", label: "sapu", title: "Sapu", text: "Untuk menyapu lantai", example: "Debu dan kotoran dikumpulkan." },
        { icon: "🪣", label: "pel", title: "Kain pel dan ember", text: "Untuk mengepel lantai", example: "Dipakai sesudah lantai disapu." },
        { icon: "🪶", label: "kemoceng", title: "Kemoceng", text: "Untuk membersihkan debu di meja dan lemari", example: "Debu dibersihkan sebelum menyapu." },
        { icon: "🗑️", label: "tempat sampah", title: "Tempat sampah", text: "Untuk membuang sampah", example: "Sampah tidak boleh dibuang sembarangan." },
      ]} />,
      coba: "Pekerjaan rumah apa yang bisa kamu bantu?",
    },
  ],
  "pp-3": [
    {
      title: "Bendera Merah Putih",
      text: ["Bendera negara kita bernama Sang Merah Putih. Warnai benderanya dengan benar."],
      widget: <FlagBuilder />,
      coba: "Di mana kamu pernah melihat bendera Merah Putih?",
    },
    {
      title: "Lima sila Pancasila",
      text: ["Pancasila adalah dasar negara Indonesia. Panca berarti lima, sila berarti dasar.", "Tiap sila punya simbol. Ketuk simbolnya."],
      widget: <Explorer items={[
        { icon: "⭐", label: "sila 1", title: "Bintang", text: "Ketuhanan Yang Maha Esa", example: "Contoh: berdoa sebelum belajar." },
        { icon: "⛓️", label: "sila 2", title: "Rantai", text: "Kemanusiaan yang adil dan beradab", example: "Contoh: menolong teman yang kesusahan." },
        { icon: "🌳", label: "sila 3", title: "Pohon beringin", text: "Persatuan Indonesia", example: "Contoh: rukun dengan teman dari suku lain." },
        { icon: "🐃", label: "sila 4", title: "Kepala banteng", text: "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan", example: "Contoh: bermusyawarah memilih ketua kelas." },
        { icon: "🌾", label: "sila 5", title: "Padi dan kapas", text: "Keadilan sosial bagi seluruh rakyat Indonesia", example: "Contoh: membagi kue sama rata." },
      ]} />,
      coba: "Sebutkan simbol sila pertama sampai kelima.",
    },
    {
      title: "Lambang, lagu, dan semboyan",
      text: ["Indonesia punya lambang negara, lagu kebangsaan, dan semboyan."],
      widget: <Explorer items={[
        { icon: "🦅", label: "lambang", title: "Garuda Pancasila", text: "Lambang negara Indonesia", example: "Di dadanya ada perisai dengan lima simbol sila." },
        { icon: "🎵", label: "lagu", title: "Indonesia Raya", text: "Lagu kebangsaan Indonesia", example: "Diciptakan oleh W.R. Supratman." },
        { icon: "🎗️", label: "semboyan", title: "Bhinneka Tunggal Ika", text: "Berbeda-beda tetapi tetap satu", example: "Tertulis pada pita yang dicengkeram Garuda." },
        { icon: "🧵", label: "penjahit", title: "Ibu Fatmawati", text: "Menjahit bendera pusaka Merah Putih", example: "Bendera itu dikibarkan saat proklamasi." },
      ]} />,
      coba: "Nyanyikan lagu Indonesia Raya.",
    },
    {
      title: "Sikap saat upacara bendera",
      text: ["Upacara bendera diadakan setiap hari Senin. Kita mengikutinya dengan khidmat."],
      widget: <SortInto groups={["Benar", "Salah"]} items={[
        { text: "Berdiri tegak saat bendera dinaikkan", emoji: "🧍", group: "Benar", why: "Berdiri tegak menunjukkan rasa hormat." },
        { text: "Mengobrol dengan teman", emoji: "💬", group: "Salah", why: "Upacara diikuti dengan tenang." },
        { text: "Hormat kepada bendera dengan tangan kanan", emoji: "🫡", group: "Benar", why: "Itu cara menghormati bendera Merah Putih." },
        { text: "Bercanda saat menyanyikan Indonesia Raya", emoji: "🤪", group: "Salah", why: "Lagu kebangsaan dinyanyikan dengan sungguh-sungguh." },
      ]} />,
      coba: "Peragakan sikap hormat kepada bendera.",
    },
  ],
  "pp-4": [
    {
      title: "Bagian-bagian rumah",
      text: ["Rumah punya beberapa ruangan. Tiap ruangan punya kegunaan."],
      widget: <Explorer items={[
        { icon: "🛋️", label: "ruang tamu", title: "Ruang tamu", text: "Untuk menerima tamu", example: "Tamu dipersilakan duduk di sini." },
        { icon: "🛏️", label: "kamar tidur", title: "Kamar tidur", text: "Untuk tidur dan beristirahat", example: "Dirapikan setiap bangun tidur." },
        { icon: "🍳", label: "dapur", title: "Dapur", text: "Untuk memasak", example: "Hati-hati dengan api dan pisau." },
        { icon: "🚿", label: "kamar mandi", title: "Kamar mandi", text: "Untuk mandi dan membersihkan badan", example: "Lantainya licin, jangan berlari." },
        { icon: "🪴", label: "halaman", title: "Halaman", text: "Untuk bermain dan menanam tanaman", example: "Disapu supaya bersih." },
      ]} />,
      coba: "Ruangan apa yang paling kamu suka di rumah?",
    },
    {
      title: "Gotong royong",
      text: ["Gotong royong artinya bekerja bersama-sama supaya pekerjaan cepat selesai dan terasa ringan."],
      widget: <SortInto groups={["Gotong royong", "Bukan"]} items={[
        { text: "Warga bersama-sama membersihkan selokan", emoji: "🧹", group: "Gotong royong", why: "Banyak orang mengerjakan satu pekerjaan bersama." },
        { text: "Bermain gawai sendirian saat kerja bakti", emoji: "📱", group: "Bukan", why: "Ia tidak ikut membantu pekerjaan bersama." },
        { text: "Satu kelas membersihkan ruang kelas", emoji: "🏫", group: "Gotong royong", why: "Semua murid bekerja sama." },
        { text: "Keluarga menata rumah bersama-sama", emoji: "🏠", group: "Gotong royong", why: "Semua anggota keluarga ikut bekerja." },
        { text: "Menyuruh teman mengerjakan semuanya", emoji: "👉", group: "Bukan", why: "Gotong royong berarti semua ikut bekerja." },
      ]} />,
      coba: "Kegiatan gotong royong apa yang ada di lingkunganmu?",
    },
    {
      title: "Rumah adat di Indonesia",
      text: ["Indonesia punya banyak pulau dan suku. Tiap daerah punya rumah adat."],
      widget: <Explorer items={[
        { icon: "🛖", label: "Honai", title: "Honai", text: "Rumah adat dari Papua", example: "Bentuknya bulat dengan atap jerami." },
        { icon: "🏯", label: "Gadang", title: "Rumah Gadang", text: "Rumah adat dari Sumatra Barat", example: "Atapnya runcing seperti tanduk kerbau." },
        { icon: "🏠", label: "Joglo", title: "Joglo", text: "Rumah adat dari Jawa Tengah", example: "Atapnya tinggi di bagian tengah." },
        { icon: "⛵", label: "Tongkonan", title: "Tongkonan", text: "Rumah adat dari Sulawesi Selatan", example: "Atapnya melengkung seperti perahu." },
      ]} />,
      coba: "Apa nama rumah adat di daerahmu?",
    },
    {
      title: "Menjaga lingkungan sekolah",
      text: ["Sekolah adalah lingkungan kita juga. Kita menjaganya bersama-sama."],
      widget: <SortInto groups={["Menjaga", "Merusak"]} items={[
        { text: "Membuang sampah di tempat sampah", emoji: "🗑️", group: "Menjaga", why: "Sekolah jadi bersih dan sehat." },
        { text: "Mencoret-coret meja", emoji: "✏️", group: "Merusak", why: "Meja dipakai bersama dan harus dijaga." },
        { text: "Menyiram tanaman di taman sekolah", emoji: "🌱", group: "Menjaga", why: "Tanaman membuat sekolah sejuk." },
        { text: "Memetik bunga di taman sekolah", emoji: "🌸", group: "Merusak", why: "Bunga ditanam untuk dinikmati bersama." },
        { text: "Piket kelas sesuai jadwal", emoji: "🧽", group: "Menjaga", why: "Kelas bersih karena semua bergiliran piket." },
      ]} />,
      coba: "Hari apa jadwal piketmu?",
    },
  ],
};
