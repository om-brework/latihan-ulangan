/* Bank soal: 300 soal, 60 per materi. Tambah soal di sini; `g` = kelompok soal yang tidak boleh muncul bersamaan. */
var PER_SECTION = 6;
var KATA = ["maaf","tolong","terima kasih","permisi"];
var MARK = ["?","!"];
var SECTION_INFO = [
  {id:"A", icon:"👂", c:"#FF8A3D", cd:"#C2500A", title:"Instruksi lisan", hint:"Dengarkan soal yang dibacakan, lalu pilih jawabannya."},
  {id:"B", icon:"❓", c:"#FF5FA2", cd:"#C2256B", title:"Tanda tanya dan tanda seru", hint:"Pilih tanda yang tepat di akhir kalimat.", marks:true},
  {id:"C", icon:"✨", c:"#2DBE7E", cd:"#12804F", title:"Empat kata ajaib", hint:"Maaf, tolong, terima kasih, permisi."},
  {id:"D", icon:"🐯", c:"#9B6BFF", cd:"#6236D6", title:"Suku kata ha hi hu he ho", hint:"Ketik atau pilih suku kata dan kata yang tepat."},
  {id:"E", icon:"🦎", c:"#29A8F2", cd:"#0E6FB0", title:"Suku kata ca ci cu ce co", hint:"Ketik atau pilih suku kata dan kata yang tepat."}
];

function buildPool(){
  var P = {A:[],B:[],C:[],D:[],E:[]};
  var L = "“", R = "”", DOTS = "…", DASH = "–";

  /* ---------- A. Instruksi lisan ---------- */
  var twoStep = [
    ["Bu guru","Ambil pensil, lalu tulis namamu.","mengambil pensil","menulis nama","menutup buku"],
    ["Ibu","Cuci tangan, lalu makan.","mencuci tangan","makan","tidur"],
    ["Ayah","Pakai sepatu, lalu berangkat ke sekolah.","memakai sepatu","berangkat ke sekolah","menonton televisi"],
    ["Bu guru","Buka buku, lalu baca dengan suara keras.","membuka buku","membaca","menggambar"],
    ["Ibu","Mandi dulu, lalu pakai seragam.","mandi","memakai seragam","bermain bola"],
    ["Pak guru","Berdiri, lalu beri salam.","berdiri","memberi salam","tiduran"],
    ["Kakak","Rapikan mainan, lalu sapu lantai.","merapikan mainan","menyapu lantai","mencuci piring"],
    ["Bu guru","Angkat tangan, lalu jawab pertanyaan.","mengangkat tangan","menjawab pertanyaan","keluar kelas"],
    ["Ibu","Gosok gigi, lalu tidur.","menggosok gigi","tidur","makan permen"],
    ["Ayah","Tutup pintu, lalu matikan lampu.","menutup pintu","mematikan lampu","membuka jendela"],
    ["Bu guru","Kumpulkan buku, lalu kembali ke tempat duduk.","mengumpulkan buku","kembali ke tempat duduk","pulang ke rumah"],
    ["Nenek","Siram bunga, lalu beri makan ayam.","menyiram bunga","memberi makan ayam","memetik bunga"],
    ["Pak guru","Berbaris yang rapi, lalu masuk kelas.","berbaris","masuk kelas","berlari"],
    ["Ibu","Lepas sepatu, lalu simpan di rak.","melepas sepatu","menyimpan sepatu di rak","mencuci sepatu"],
    ["Bu guru","Warnai gambar, lalu gunting gambarnya.","mewarnai gambar","menggunting gambar","menempel gambar"],
    ["Ayah","Habiskan makananmu, lalu cuci piringnya.","menghabiskan makanan","mencuci piring","minum susu"],
    ["Bu guru","Ambil buku tulis, lalu salin tulisan di papan tulis.","mengambil buku tulis","menyalin tulisan","menghapus papan tulis"],
    ["Kakak","Isi botol minum, lalu masukkan ke dalam tas.","mengisi botol minum","memasukkan botol ke tas","mencuci botol"],
    ["Pak guru","Duduk yang rapi, lalu berdoa.","duduk rapi","berdoa","bernyanyi"],
    ["Ibu","Lipat selimut, lalu rapikan bantal.","melipat selimut","merapikan bantal","mencuci selimut"]
  ];
  twoStep.forEach(function(s,i){
    var base = s[0]+" berkata, "+L+s[1]+R+" ";
    var urut = "Kata " + L + "lalu" + R + " berarti sesudah itu. Jadi " + s[2] + " dulu, baru " + s[3] + ".";
    P.A.push({t:base+"Apa yang dilakukan lebih dulu?", o:[s[2],s[3],s[4]], a:s[2], g:"i"+i, e:urut});
    P.A.push({t:base+"Apa yang dilakukan sesudah itu?", o:[s[2],s[3],s[4]], a:s[3], g:"i"+i, e:urut});
  });
  var detail = [
    ["Pak guru","Buka buku halaman lima.","Halaman berapa yang dibuka?",["lima","tiga","sepuluh"]],
    ["Bu guru","Tepuk tangan dua kali.","Berapa kali kamu tepuk tangan?",["dua kali","satu kali","tiga kali"]],
    ["Bu guru","Ambil pensil warna merah.","Pensil warna apa yang diambil?",["merah","biru","hijau"]],
    ["Bu guru","Tulis namamu di pojok kanan atas.","Di mana nama ditulis?",["pojok kanan atas","pojok kiri bawah","di tengah"]],
    ["Pak guru","Kumpulkan tugas di meja guru.","Di mana tugas dikumpulkan?",["di meja guru","di dalam tas","di lemari"]],
    ["Pak guru","Lompat tiga kali.","Berapa kali kamu melompat?",["tiga kali","dua kali","lima kali"]],
    ["Bu guru","Simpan tasmu di bawah meja.","Di mana tas disimpan?",["di bawah meja","di atas meja","di luar kelas"]],
    ["Bu guru","Gambarlah sebuah rumah.","Apa yang harus digambar?",["rumah","mobil","pohon"]],
    ["Bu guru","Besok bawa buku gambar.","Apa yang harus dibawa besok?",["buku gambar","bola","payung"]],
    ["Pak guru","Angkat tangan kiri.","Tangan mana yang diangkat?",["tangan kiri","tangan kanan","kedua tangan"]],
    ["Ibu","Buang sampah di tempat sampah.","Di mana sampah dibuang?",["di tempat sampah","di kolong meja","di halaman"]],
    ["Bu guru","Ambil empat buah krayon.","Berapa krayon yang diambil?",["empat","dua","enam"]],
    ["Pak guru","Besok pakai baju olahraga.","Baju apa yang dipakai besok?",["baju olahraga","baju batik","baju pramuka"]],
    ["Bu guru","Bacalah dengan suara pelan.","Bagaimana cara membacanya?",["dengan suara pelan","dengan suara keras","sambil berteriak"]]
  ];
  detail.forEach(function(d,i){
    P.A.push({t:d[0]+" berkata, "+L+d[1]+R+" "+d[2], o:d[3], a:d[3][0], g:"d"+i, e:"Dengarkan kata pentingnya. Instruksinya: "+L+d[1]+R});
  });
  [
    ["Saat guru memberi instruksi, kita harus "+DOTS,["mendengarkan","mengobrol","bermain"]],
    ["Jika belum mengerti instruksi guru, kita sebaiknya "+DOTS,["bertanya dengan sopan","diam saja","menangis"]],
    ["Instruksi yang lebih dari satu sebaiknya dilakukan secara "+DOTS,["berurutan","terbalik","sesuka hati"]],
    ["Saat mendengarkan instruksi, mata melihat ke arah "+DOTS,["orang yang berbicara","luar jendela","mainan"]],
    [L+"Ayo berbaris!"+R+" adalah kalimat "+DOTS,["perintah","tanya","cerita"]],
    ["Ibu berkata, "+L+"Tolong ambilkan sapu."+R+" Yang kamu lakukan adalah "+DOTS,["mengambil sapu","mengambil ember","pergi bermain"]]
  ].forEach(function(s,i){
    var why = [
      "Kita mendengarkan dulu supaya tahu apa yang harus dilakukan.",
      "Bertanya dengan sopan membuat kita tidak salah mengerjakan.",
      "Instruksi dilakukan satu per satu sesuai urutannya supaya hasilnya benar.",
      "Melihat orang yang berbicara membantu kita memperhatikan instruksinya.",
      L+"Ayo berbaris!"+R+" menyuruh kita melakukan sesuatu, jadi itu kalimat perintah.",
      "Ibu meminta sapu, jadi yang diambil adalah sapu."
    ];
    P.A.push({t:s[0], o:s[1], a:s[1][0], g:"s"+i, e:why[i]});
  });

  /* ---------- B. Tanda tanya dan tanda seru ---------- */
  var tanya = ["Siapa namamu","Di mana rumahmu","Kapan kamu pergi ke sekolah","Apa warna kesukaanmu","Berapa umurmu",
    "Mengapa kamu menangis","Bagaimana kabarmu","Siapa nama gurumu","Di mana kamu menyimpan tasmu","Kapan kamu bangun tidur",
    "Apa yang sedang kamu baca","Berapa jumlah pensilmu","Mengapa kamu terlambat","Bagaimana cara mencuci tangan","Apakah kamu sudah makan",
    "Siapa yang membawa bola","Ke mana ayah pergi","Dari mana kamu datang","Apakah ini bukumu","Jam berapa kamu tidur",
    "Apa nama hewan itu","Siapa teman sebangkumu","Kapan ulang tahunmu","Di mana ibu membeli sayur","Apakah kamu suka cokelat",
    "Berapa harga buku ini","Mengapa langit mendung","Apa cita-citamu","Bolehkah aku meminjam pensilmu","Sudahkah kamu mandi"];
  var seru = ["Awas, ada lubang","Tolong tutup pintu itu","Wah, bagus sekali gambarmu","Hore, aku juara","Aduh, kakiku sakit",
    "Ayo, kita berangkat","Jangan berlari di kelas","Buang sampah pada tempatnya","Wah, indah sekali bunga itu","Awas, lantainya licin",
    "Tolong, ambilkan bukuku","Cepat, masuk ke kelas","Hebat, kamu pintar sekali","Jangan ribut","Duduk yang rapi",
    "Hati-hati di jalan","Selamat ulang tahun, Cici","Wah, tinggi sekali pohon itu","Aduh, panas sekali","Ayo, cuci tanganmu",
    "Diam, adik sedang tidur","Hore, besok libur","Awas, ada mobil","Rapikan mainanmu","Jangan buang sampah sembarangan",
    "Wah, enak sekali kue ini","Astaga, bukuku tertinggal","Angkat tanganmu","Semangat, kamu pasti bisa","Stop, jangan menyeberang dulu"];
  tanya.forEach(function(s,i){ P.B.push({t:s+" "+DOTS, o:MARK, a:"?", keep:true, g:"t"+i}); });
  seru.forEach(function(s,i){ P.B.push({t:s+" "+DOTS, o:MARK, a:"!", keep:true, g:"s"+i}); });

  /* ---------- C. Empat kata ajaib ---------- */
  var KB = " Kamu berkata "+DOTS;
  var ajaib = {
    "terima kasih":[
      "Cici diberi kue oleh nenek. Cici berkata "+DOTS,
      "Hadi dipinjami pensil oleh Cinta. Hadi berkata "+DOTS,
      "Bu guru memuji gambar Caca. Caca berkata "+DOTS,
      "Ayah membelikan Heru sepatu baru. Heru berkata "+DOTS,
      "Teman membantu membawakan tasmu."+KB,
      "Ibu menyiapkan sarapan untukmu."+KB,
      "Kakak mengajarimu membaca."+KB,
      "Hana mendapat hadiah dari paman. Hana berkata "+DOTS,
      "Teman mengambilkan bukumu yang jatuh."+KB,
      "Pak satpam membantumu menyeberang jalan."+KB,
      "Teman mengucapkan selamat ulang tahun kepadamu."+KB,
      "Bibi mengantarmu ke sekolah."+KB,
      "Teman membagi bekalnya denganmu."+KB,
      "Dokter selesai memeriksamu."+KB],
    "maaf":[
      "Hadi tidak sengaja menginjak kaki teman. Hadi berkata "+DOTS,
      "Caca datang terlambat ke sekolah. Kepada bu guru, Caca berkata "+DOTS,
      "Kamu menumpahkan minuman teman."+KB,
      "Heru menjatuhkan buku Cici. Heru berkata "+DOTS,
      "Kamu lupa membawa buku tugas. Kepada guru, kamu berkata "+DOTS,
      "Kamu tidak sengaja menabrak teman saat berlari."+KB,
      "Hana merusakkan mainan adik. Hana berkata "+DOTS,
      "Kamu memecahkan gelas di rumah. Kepada ibu, kamu berkata "+DOTS,
      "Kamu menghilangkan penghapus teman."+KB,
      "Kamu berbicara terlalu keras sampai adik terbangun."+KB,
      "Coki tidak sengaja mencoret buku teman. Coki berkata "+DOTS,
      "Kamu lupa janji bermain dengan teman."+KB,
      "Kamu salah mengambil tas teman."+KB,
      "Kamu membuat teman menangis."+KB],
    "tolong":[
      "Caca ingin meminjam penghapus. Caca berkata, "+L+DOTS+" pinjami aku penghapusmu."+R,
      "Kamu ingin ibu mengambilkan minum. Kamu berkata, "+L+"Bu, "+DOTS+" ambilkan minum."+R,
      "Kamu tidak bisa membuka botol. Kamu berkata, "+L+"Ayah, "+DOTS+" bukakan botol ini."+R,
      "Bu guru ingin Hadi menghapus papan tulis. Bu guru berkata, "+L+"Hadi, "+DOTS+" hapus papan tulis."+R,
      "Kamu ingin kakak mengikat tali sepatumu. Kamu berkata, "+L+"Kak, "+DOTS+" ikatkan tali sepatuku."+R,
      "Kamu ingin teman menggeser kursinya. Kamu berkata, "+L+DOTS+" geser kursimu sedikit."+R,
      "Kamu ingin ayah menyalakan lampu. Kamu berkata, "+L+"Ayah, "+DOTS+" nyalakan lampunya."+R,
      "Kamu ingin teman memegang bukumu sebentar. Kamu berkata, "+L+DOTS+" pegang bukuku sebentar."+R,
      "Kamu ingin ibu membacakan cerita. Kamu berkata, "+L+"Bu, "+DOTS+" bacakan cerita."+R,
      "Kamu ingin bu guru mengulang penjelasan. Kamu berkata, "+L+"Bu, "+DOTS+" ulangi sekali lagi."+R,
      "Kamu ingin kakak mengambil bola di atas lemari. Kamu berkata, "+L+"Kak, "+DOTS+" ambilkan bola itu."+R,
      "Kamu ingin teman menutup jendela. Kamu berkata, "+L+DOTS+" tutup jendelanya."+R,
      "Kamu ingin nenek membuatkan teh. Kamu berkata, "+L+"Nek, "+DOTS+" buatkan teh."+R,
      "Kamu ingin paman mengantarmu ke sekolah. Kamu berkata, "+L+"Paman, "+DOTS+" antarkan aku ke sekolah."+R],
    "permisi":[
      "Heru mau lewat di depan bu guru. Heru berkata "+DOTS,
      "Kamu ingin lewat di depan orang yang sedang duduk."+KB,
      "Kamu ingin masuk ke ruang guru. Sebelum masuk, kamu berkata "+DOTS,
      "Kamu ingin izin ke kamar kecil. Kamu berkata, "+L+DOTS+", Bu, saya izin ke kamar kecil."+R,
      "Kamu ingin lewat di antara dua orang yang sedang berbicara."+KB,
      "Kamu bertamu ke rumah teman. Di depan pintu, kamu berkata "+DOTS,
      "Kamu ingin lewat di lorong yang ramai orang."+KB,
      "Kamu mau lewat di depan kakek yang sedang membaca koran."+KB,
      "Kamu mengantar buku ke kelas lain. Sebelum masuk, kamu berkata "+DOTS,
      "Kamu ingin lewat, tetapi teman berdiri di pintu."+KB,
      "Kamu masuk ke warung dan penjualnya tidak terlihat. Kamu memanggil dengan berkata "+DOTS,
      "Kamu pamit pulang dari rumah teman. Kamu berkata, "+L+DOTS+", Tante, saya pulang dulu."+R,
      "Kamu ingin lewat di depan orang yang sedang menonton televisi."+KB,
      "Kamu ingin menuju tempat dudukmu melewati beberapa orang."+KB]
  };
  KATA.forEach(function(k){
    ajaib[k].forEach(function(s,i){ P.C.push({t:s, o:KATA, a:k, keep:true, g:k+i}); });
  });
  P.C.push({t:"Mana yang bukan kata ajaib?", o:["awas","tolong","maaf","permisi"], a:"awas", g:"m0", e:"Empat kata ajaib adalah maaf, tolong, terima kasih, dan permisi. Awas adalah kata peringatan."});
  P.C.push({t:"Mana yang termasuk kata ajaib?", o:["terima kasih","cepat","awas","ayo"], a:"terima kasih", g:"m1", e:"Empat kata ajaib adalah maaf, tolong, terima kasih, dan permisi."});
  P.C.push({t:"Kata ajaib yang diucapkan saat meminta bantuan adalah "+DOTS, o:KATA, a:"tolong", keep:true, g:"m2"});
  P.C.push({t:"Kata ajaib yang diucapkan saat berbuat salah adalah "+DOTS, o:KATA, a:"maaf", keep:true, g:"m3"});

  /* ---------- D & E. Suku kata ---------- */
  /* [kata, suku kata, petunjuk, posisi suku kata yang dikosongkan: 0 = awal, -1 = akhir] */
  var wordsD = [
    ["hati",["ha","ti"],"Bentuknya seperti ❤️",0],
    ["hari",["ha","ri"],"Senin adalah nama "+DOTS,0],
    ["harum",["ha","rum"],"Bau bunga melati",0],
    ["hadiah",["ha","di","ah"],"Kado saat ulang tahun",0],
    ["haus",["ha","us"],"Rasa ingin minum",0],
    ["hapus",["ha","pus"],"Menghilangkan tulisan di papan tulis",0],
    ["habis",["ha","bis"],"Tidak ada sisa lagi",0],
    ["halus",["ha","lus"],"Lawan kata kasar",0],
    ["harimau",["ha","ri","mau"],"Kucing besar yang belang dan buas",0],
    ["halaman",["ha","la","man"],"Tempat bermain di depan rumah",0],
    ["hitam",["hi","tam"],"Warna rambut kita",0],
    ["hidung",["hi","dung"],"Alat untuk mencium bau",0],
    ["hijau",["hi","jau"],"Warna daun",0],
    ["hilang",["hi","lang"],"Tidak dapat ditemukan lagi",0],
    ["hidup",["hi","dup"],"Lawan kata mati",0],
    ["hiu",["hi","u"],"Ikan besar di laut yang giginya tajam",0],
    ["hias",["hi","as"],"Membuat sesuatu menjadi lebih indah",0],
    ["hitung",["hi","tung"],"Satu, dua, tiga. Ayo kita "+DOTS,0],
    ["hujan",["hu","jan"],"Air yang turun dari langit",0],
    ["hutan",["hu","tan"],"Tempat yang banyak pohon dan hewan liar",0],
    ["huruf",["hu","ruf"],"A, B, dan C adalah "+DOTS,0],
    ["hebat",["he","bat"],"Kamu juara. Kamu memang "+DOTS+"!",0],
    ["hewan",["he","wan"],"Kucing, ayam, dan sapi adalah "+DOTS,0],
    ["hemat",["he","mat"],"Tidak boros",0],
    ["heran",["he","ran"],"Merasa aneh melihat sesuatu",0],
    ["hobi",["ho","bi"],"Hal yang suka kita lakukan, misalnya menggambar",0],
    ["hore",["ho","re"],"Seruan saat merasa gembira",0],
    ["hotel",["ho","tel"],"Tempat menginap saat berlibur",0],
    ["tahu",["ta","hu"],"Makanan dari kedelai, warnanya putih",-1],
    ["bahu",["ba","hu"],"Bagian tubuh di antara leher dan lengan",-1],
    ["paha",["pa","ha"],"Bagian kaki di atas lutut",-1],
    ["jahe",["ja","he"],"Rempah yang rasanya hangat",-1]
  ];
  var wordsE = [
    ["cabai",["ca","bai"],"Rasanya pedas",0],
    ["cacing",["ca","cing"],"Hewan kecil yang hidup di dalam tanah",0],
    ["cari",["ca","ri"],"Bukuku hilang. Ayo kita "+DOTS+" bersama",0],
    ["capung",["ca","pung"],"Serangga yang sayapnya tipis dan panjang",0],
    ["cabut",["ca","but"],"Menarik rumput sampai lepas dari tanah",0],
    ["cahaya",["ca","ha","ya"],"Sinar dari matahari atau lampu",0],
    ["cakar",["ca","kar"],"Kuku tajam milik kucing dan ayam",0],
    ["catur",["ca","tur"],"Permainan papan dengan kuda, benteng, dan raja",0],
    ["cabang",["ca","bang"],"Batang kecil pada pohon",0],
    ["cicak",["ci","cak"],"Hewan kecil yang merayap di dinding",0],
    ["cium",["ci","um"],"Menyentuh pipi dengan bibir tanda sayang",0],
    ["cicip",["ci","cip"],"Mencoba sedikit rasa makanan",0],
    ["ciri",["ci","ri"],"Tanda khusus pada sesuatu",0],
    ["cuci",["cu","ci"],"Membersihkan dengan air dan sabun",0],
    ["cucu",["cu","cu"],"Kamu adalah "+DOTS+" dari kakek dan nenek",0],
    ["cuka",["cu","ka"],"Cairan asam yang dituang ke kuah bakso",0],
    ["cukur",["cu","kur"],"Memotong rambut sampai pendek",0],
    ["cuaca",["cu","a","ca"],"Cerah, mendung, dan hujan adalah keadaan "+DOTS,0],
    ["cubit",["cu","bit"],"Menjepit kulit dengan jari",0],
    ["curi",["cu","ri"],"Mengambil barang orang lain tanpa izin",0],
    ["cumi",["cu","mi"],"Hewan laut yang punya tinta hitam",0],
    ["cepat",["ce","pat"],"Lawan kata lambat",0],
    ["cerita",["ce","ri","ta"],"Ibu membacakan "+DOTS+" sebelum tidur",0],
    ["ceria",["ce","ri","a"],"Senang dan gembira",0],
    ["celana",["ce","la","na"],"Pakaian untuk menutup kaki",0],
    ["cerah",["ce","rah"],"Langit tidak mendung, matahari bersinar",0],
    ["cemara",["ce","ma","ra"],"Pohon yang daunnya seperti jarum",0],
    ["ceri",["ce","ri"],"Buah kecil bulat berwarna merah",0],
    ["cokelat",["co","ke","lat"],"Makanan manis yang dibuat dari kakao",0],
    ["coba",["co","ba"],"Ayo "+DOTS+" sekali lagi, jangan menyerah",0],
    ["cocok",["co","cok"],"Pas dan sesuai",0],
    ["coret",["co","ret"],"Membuat garis di kertas dengan pensil",0],
    ["copot",["co","pot"],"Lepas dari tempatnya",0],
    ["kaca",["ka","ca"],"Jendela terbuat dari "+DOTS,-1],
    ["baca",["ba","ca"],"Kegiatan melihat dan mengeja tulisan di buku",-1],
    ["laci",["la","ci"],"Tempat menyimpan barang di dalam meja",-1],
    ["panci",["pan","ci"],"Alat dapur untuk merebus air",-1],
    ["kunci",["kun","ci"],"Alat untuk membuka pintu",-1]
  ];
  function syl(list, sec, awalan, susun, pilih){
    var map = {};
    list.forEach(function(w){
      map[w[0]] = w;
      var s = w[1], q = {t:"Lengkapi katanya.", c:w[2], g:w[0], e:"Kata " + w[0] + " dieja " + w[1].join(" - ") + "."};
      if(w[3] === 0){ q.a = s[0]; q.post = DASH+" "+s.slice(1).join(" "+DASH+" "); }
      else { q.a = s[s.length-1]; q.pre = s.slice(0,-1).join(" "+DASH+" ")+" "+DASH; }
      P[sec].push(q);
    });
    awalan.forEach(function(k){
      P[sec].push({t:"Kata "+L+k+R+" diawali suku kata "+DOTS, a:map[k][1][0], g:k, e:"Kata " + k + " dieja " + map[k][1].join(" - ") + ". Suku kata pertamanya " + map[k][1][0] + "."});
    });
    susun.forEach(function(k){
      var s = map[k][1];
      P[sec].push({t:"Susun suku kata menjadi kata.", pre:s[1]+" + "+s[0]+" =", wide:true, a:k, g:k, e:"Suku kata " + s[0] + " di depan, lalu " + s[1] + ": " + k + "."});
    });
    pilih.forEach(function(p,i){
      P[sec].push({t:p[0], o:p[1], a:p[1][0], g:"pilih"+i, e:"Kata " + p[1][0] + " dieja " + map[p[1][0]][1].join(" - ") + "."});
    });
  }
  function awal(x){ return "Mana kata yang diawali suku kata "+L+x+R+"?"; }
  syl(wordsD, "D",
    ["hidung","harimau","hujan","hewan","hotel","hari","hijau","huruf","hemat","hore","halaman","hitung","hadiah","hilang"],
    ["hutan","hujan","hati","hari","hitam","hebat","hobi","hewan"],
    [[awal("ha"),["hari","hijau","hutan"]],[awal("hi"),["hidung","hadiah","hewan"]],[awal("hu"),["hujan","hitam","hobi"]],
     [awal("he"),["hebat","hapus","huruf"]],[awal("ho"),["hotel","hemat","hilang"]],
     ["Mana kata yang diakhiri suku kata "+L+"hu"+R+"?",["tahu","hati","hore"]]]);
  syl(wordsE, "E",
    ["cabai","cicak","cuka","celana","cokelat","capung","cumi","cerita","coret","cahaya"],
    ["cacing","cicak","cuci","cepat","coba","cari","cuka"],
    [[awal("ca"),["cakar","cicip","cukur"]],[awal("ci"),["cicak","cocok","cerah"]],[awal("cu"),["cumi","catur","ceri"]],
     [awal("ce"),["celana","cabai","copot"]],[awal("co"),["coba","cubit","ciri"]]]);
  return P;
}

export { PER_SECTION, KATA, MARK, SECTION_INFO, buildPool };
