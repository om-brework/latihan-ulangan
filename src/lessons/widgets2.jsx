/* Alat peraga untuk Belajar Bahasa Indonesia dan Pendidikan Pancasila */
import { useState } from "react";
import { Say } from "./widgets.jsx";

const VOWELS = ["a", "i", "u", "e", "o"];
const shuffled = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // jangan sampai urutan acaknya kebetulan sudah benar
  return a.length > 1 && a.every((x, i) => x === list[i]) ? [...a.slice(1), a[0]] : a;
};

/* Huruf + vokal = suku kata, dengan contoh kata. examples: { a: { syl: ["ba","tu"], emoji: "🪨" }, ... } */
export function SyllableBuilder({ letter, examples }) {
  const [v, setV] = useState("a");
  const ex = examples[v];
  return (
    <div className="stage">
      <div className="equation">
        <b className="tile">{letter}</b><span>+</span><b className="tile vowel">{v}</b><span>=</span><b className="tile result" key={v}>{letter + v}</b>
      </div>
      <div className="tabs">
        {VOWELS.map((x) => (
          <button type="button" key={x} className={`tab big${x === v ? " on" : ""}`} onClick={() => setV(x)}>{x}</button>
        ))}
      </div>
      <Say sub={`${ex.emoji} dieja ${ex.syl.join(" - ")}`}>
        {ex.syl.map((s, i) => <span key={i} className={i === ex.at ? "hl" : undefined}>{s}</span>)}
      </Say>
    </div>
  );
}

/* Menggabungkan suku kata menjadi kata. words: [{ syl: ["bo","la"], emoji: "⚽" }] */
export function WordJoin({ words }) {
  const [i, setI] = useState(0);
  const [joined, setJoined] = useState(false);
  const w = words[i];
  return (
    <div className="stage">
      <div className="pile"><span className="word-emoji">{w.emoji}</span></div>
      <div className={`join${joined ? " joined" : ""}`}>
        {w.syl.map((s, k) => <b className="tile" key={k}>{s}</b>)}
      </div>
      <Say sub={joined ? `Dibaca: ${w.syl.join("")}` : "Baca tiap suku kata, lalu gabungkan."}>
        {joined ? w.syl.join("") : w.syl.join(" + ")}
      </Say>
      <div className="actions">
        <button type="button" className="chunk go" onClick={() => setJoined(true)} disabled={joined}>🧩 Gabung</button>
        <button type="button" className="chunk" onClick={() => { setI((i + 1) % words.length); setJoined(false); }}>Kata lain →</button>
      </div>
    </div>
  );
}

/* Pilih satu, lihat penjelasannya. items: [{ icon, label, title, text, example }] */
export function Explorer({ items }) {
  const [i, setI] = useState(0);
  const it = items[i];
  return (
    <div className="stage">
      <div className="tabs">
        {items.map((x, k) => (
          <button type="button" key={x.label} className={`tab${k === i ? " on" : ""}`} onClick={() => setI(k)}>{x.icon} {x.label}</button>
        ))}
      </div>
      <div className="pile explorer" key={i}>
        <span className="word-emoji">{it.icon}</span>
        <b>{it.title}</b>
      </div>
      <Say sub={it.example}>{it.text}</Say>
    </div>
  );
}

/* Memilah: tiap kartu dimasukkan ke salah satu kelompok. items: [{ text, emoji, group, why }] */
export function SortInto({ groups, items }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const done = i >= items.length;
  const it = items[i];

  if (done) {
    return (
      <div className="stage">
        <Say sub="Tekan Ulangi untuk mencoba lagi.">Selesai! {right} dari {items.length} benar ⭐</Say>
        <div className="actions">
          <button type="button" className="chunk go" onClick={() => { setI(0); setPicked(null); setRight(0); }}>↺ Ulangi</button>
        </div>
      </div>
    );
  }
  const ok = picked === it.group;
  return (
    <div className="stage">
      <p className="counter">Kartu {i + 1} dari {items.length}</p>
      <div className="pile sort-card" key={i}>
        {it.emoji && <span className="word-emoji">{it.emoji}</span>}
        <b>{it.text}</b>
      </div>
      <div className="actions multi">
        {groups.map((g) => (
          <button
            type="button"
            key={g}
            className={`chunk group${picked ? (g === it.group ? " right" : g === picked ? " wrong" : "") : ""}`}
            disabled={picked !== null}
            onClick={() => { setPicked(g); if (g === it.group) setRight(right + 1); }}
          >{g}</button>
        ))}
      </div>
      {picked !== null && (
        <>
          <Say sub={it.why}>{ok ? "Benar! 🎉" : `Belum tepat. Ini termasuk: ${it.group}`}</Say>
          <div className="actions">
            <button type="button" className="chunk go" onClick={() => { setI(i + 1); setPicked(null); }}>{i + 1 < items.length ? "Kartu berikutnya →" : "Lihat hasil"}</button>
          </div>
        </>
      )}
    </div>
  );
}

/* Mengurutkan dengan mengetuk sesuai urutan. items ditulis dalam urutan yang benar. */
export function OrderTap({ items, inline = false, doneText }) {
  const [order, setOrder] = useState(() => shuffled(items));
  const [placed, setPlaced] = useState(0);
  const [miss, setMiss] = useState(null);
  const done = placed === items.length;
  const tap = (x) => {
    if (x === items[placed]) { setPlaced(placed + 1); setMiss(null); } else setMiss(x);
  };
  return (
    <div className="stage">
      <div className={`pile left order-slots${inline ? " inline" : ""}`}>
        {placed === 0 && <span className="empty">{inline ? "Ketuk kata sesuai urutannya." : "Ketuk yang dilakukan pertama."}</span>}
        {items.slice(0, placed).map((x, k) => (
          <span className="slot" key={x}>{!inline && <i>{k + 1}</i>}{x}</span>
        ))}
      </div>
      <div className="actions multi">
        {order.filter((x) => !items.slice(0, placed).includes(x)).map((x) => (
          <button type="button" key={x} className={`chunk${miss === x ? " wrong shake" : ""}`} onClick={() => tap(x)}>{x}</button>
        ))}
      </div>
      <Say sub={done ? "Urutannya sudah benar." : miss ? "Belum giliran yang itu. Coba yang lain." : `Sudah ${placed} dari ${items.length}.`}>
        {done ? (doneText ?? (inline ? items.join(" ") : "Hebat! 🎉")) : inline ? "Susun menjadi kalimat" : "Urutkan dari yang pertama"}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => { setOrder(shuffled(items)); setPlaced(0); setMiss(null); }} disabled={placed === 0}>↺ Ulangi</button>
      </div>
    </div>
  );
}

/* Huruf kapital dan huruf kecil. letters: [["B", "Boni"], ...] */
export function LetterCase({ letters }) {
  const [i, setI] = useState(0);
  const [L, name] = letters[i];
  return (
    <div className="stage">
      <div className="tabs">
        {letters.map(([x], k) => (
          <button type="button" key={x} className={`tab big${k === i ? " on" : ""}`} onClick={() => setI(k)}>{x}</button>
        ))}
      </div>
      <div className="equation" key={i}>
        <b className="tile result">{L}</b><b className="tile vowel">{L.toLowerCase()}</b>
      </div>
      <Say sub={`Nama orang diawali huruf kapital: ${name}`}>Huruf kapital {L}, huruf kecil {L.toLowerCase()}</Say>
    </div>
  );
}

const SPOTS = {
  atas: { cell: 2, text: "di atas kotak" },
  bawah: { cell: 8, text: "di bawah kotak" },
  kiri: { cell: 4, text: "di sebelah kiri kotak" },
  kanan: { cell: 6, text: "di sebelah kanan kotak" },
  dalam: { cell: 5, text: "di dalam kotak" },
  luar: { cell: 9, text: "di luar kotak" },
};

/* Kata letak: pindahkan kucing ke atas, bawah, kiri, kanan, dalam, atau luar kotak */
export function Position() {
  const [pos, setPos] = useState("atas");
  return (
    <div className="stage">
      <div className="spot-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className={`spot${n === 5 ? " box" : ""}`}>{SPOTS[pos].cell === n ? <span className="cat" key={pos}>🐱</span> : n === 5 ? "📦" : ""}</span>
        ))}
      </div>
      <div className="tabs">
        {Object.keys(SPOTS).map((k) => (
          <button type="button" key={k} className={`tab${k === pos ? " on" : ""}`} onClick={() => setPos(k)}>{k}</button>
        ))}
      </div>
      <Say sub={pos === "luar" ? "Di luar berarti tidak di dalam kotak." : "Ketuk kata letak yang lain."}>Kucing ada {SPOTS[pos].text}</Say>
    </div>
  );
}

const FLAG_COLORS = { merah: "#E0282E", putih: "#FFFFFF", biru: "#2E8BE6", kuning: "#F5B700" };

/* Mewarnai bendera Merah Putih */
export function FlagBuilder() {
  const [top, setTop] = useState(null);
  const [bottom, setBottom] = useState(null);
  const ok = top === "merah" && bottom === "putih";
  const row = (label, value, set) => (
    <div className="flag-pick">
      <span className="stepper-label">{label}</span>
      {Object.keys(FLAG_COLORS).map((c) => (
        <button type="button" key={c} className={`swatch${value === c ? " on" : ""}`} style={{ background: FLAG_COLORS[c] }} aria-label={`${label} ${c}`} aria-pressed={value === c} onClick={() => set(c)} />
      ))}
    </div>
  );
  return (
    <div className="stage">
      <div className="flag" role="img" aria-label="Bendera yang sedang diwarnai">
        <span style={{ background: top ? FLAG_COLORS[top] : "#E5EDF5" }} />
        <span style={{ background: bottom ? FLAG_COLORS[bottom] : "#E5EDF5" }} />
      </div>
      {row("Atas", top, setTop)}
      {row("Bawah", bottom, setBottom)}
      <Say sub={ok ? "Merah berarti berani. Putih berarti suci." : "Pilih warna untuk bagian atas dan bawah."}>
        {ok ? "Benar! Merah di atas, putih di bawah 🇮🇩"
          : top === "putih" && bottom === "merah" ? "Terbalik. Merah harus di atas."
          : top && bottom ? "Belum tepat. Bendera kita Merah Putih."
          : "Warnai bendera Indonesia"}
      </Say>
    </div>
  );
}
