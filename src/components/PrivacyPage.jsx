/* Kebijakan privasi dalam bahasa sederhana. Isi kontak di PENGELOLA sebelum dibuka untuk umum. */
const PENGELOLA = { nama: "Pengelola aplikasi", kontak: "" };

export default function PrivacyPage() {
  return (
    <div className="wrap parent">
      <header className="head">
        <a className="back" href="#/">← Kembali</a>
        <p className="date">Untuk orang tua</p>
        <h1 className="small">Kebijakan privasi</h1>
        <p className="note">Aplikasi ini dipakai anak-anak, jadi data yang disimpan dibuat sesedikit mungkin.</p>
      </header>

      <section className="panel prose">
        <h3>Data yang disimpan</h3>
        <ul>
          <li><b>Orang tua yang login:</b> alamat email dan nama akun Google, dipakai hanya untuk login.</li>
          <li><b>Profil anak:</b> nama panggilan dan gambar yang dipilih. Tidak ada nama lengkap, tanggal lahir, sekolah, alamat, atau foto.</li>
          <li><b>Riwayat latihan:</b> waktu latihan, materi, nilai, soal yang dijawab salah, dan jawaban yang diberikan.</li>
        </ul>

        <h3>Di mana data disimpan</h3>
        <ul>
          <li><b>Tanpa login:</b> hanya di browser perangkat itu. Data tidak dikirim ke server dan hilang kalau data browser dihapus.</li>
          <li><b>Dengan login:</b> di Google Firebase (Authentication dan Cloud Firestore). Tiap orang tua hanya bisa membuka data miliknya sendiri.</li>
        </ul>

        <h3>Untuk apa data dipakai</h3>
        <p>Hanya untuk menampilkan perkembangan belajar anak kepada orang tuanya. Data tidak dijual, tidak dipakai untuk iklan, dan tidak dibagikan kepada pihak lain.</p>

        <h3>Menghapus data</h3>
        <p>Di halaman <a href="#/orangtua">Perkembangan anak</a>, orang tua bisa menghapus profil seorang anak beserta riwayatnya, atau menghapus akun beserta semua datanya. Penghapusan bersifat permanen.</p>

        <h3>Anak-anak</h3>
        <p>Anak tidak membuat akun dan tidak memasukkan data pribadi. Profil anak dibuat oleh orang tua atau walinya.</p>

        <h3>Kontak</h3>
        <p>{PENGELOLA.nama}{PENGELOLA.kontak ? `: ${PENGELOLA.kontak}` : "."}</p>
      </section>
    </div>
  );
}
