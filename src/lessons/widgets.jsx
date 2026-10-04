/* Alat peraga interaktif untuk halaman Belajar Matematika */
import { useState } from "react";

export const NAMA = [
  "nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
  "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas",
  "delapan belas", "sembilan belas", "dua puluh",
];

const range = (n) => Array.from({ length: Math.max(0, n) }, (_, i) => i);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ---------- Bagian kecil yang dipakai ulang ---------- */

function Stepper({ label, value, min, max, onChange }) {
  return (
    <div className="stepper">
      {label && <span className="stepper-label">{label}</span>}
      <button type="button" className="round" onClick={() => onChange(clamp(value - 1, min, max))} disabled={value <= min} aria-label={`Kurangi ${label ?? ""}`}>−</button>
      <b className="stepper-value">{value}</b>
      <button type="button" className="round" onClick={() => onChange(clamp(value + 1, min, max))} disabled={value >= max} aria-label={`Tambah ${label ?? ""}`}>+</button>
    </div>
  );
}

function Items({ n, emoji }) {
  return (
    <span className="items">
      {range(n).map((i) => <span key={i}>{emoji}</span>)}
    </span>
  );
}

function Dots({ counts }) {
  /* counts: [[jumlah, kelas], ...] */
  return (
    <span className="dots">
      {counts.flatMap(([n, cls], g) => range(n).map((i) => <i key={`${g}-${i}`} className={`dot ${cls}`} />))}
    </span>
  );
}

function TenFrame({ a = 0, b = 0, crossed = 0 }) {
  /* a kotak merah, lalu b kotak biru; `crossed` kotak terakhir dicoret */
  return (
    <span className="tenframe">
      {range(10).map((i) => {
        const cls = i < a ? "red" : i < a + b ? "blue" : "";
        const x = i < a + b && i >= a + b - crossed;
        return <i key={i} className={`cell ${cls}${x ? " crossed" : ""}`} />;
      })}
    </span>
  );
}

function Say({ children, sub }) {
  return (
    <div className="say" aria-live="polite">
      <strong>{children}</strong>
      {sub && <span>{sub}</span>}
    </div>
  );
}

/* ---------- Bab 1 ---------- */

export function Counter() {
  const [n, setN] = useState(3);
  return (
    <div className="stage">
      <div className="pile">{n === 0 ? <span className="empty">Tidak ada apel</span> : <Items n={n} emoji="🍎" />}</div>
      <Say sub={`dibaca: ${NAMA[n]}`}>{n}</Say>
      <Stepper label="Apel" value={n} min={0} max={10} onChange={setN} />
    </div>
  );
}

export function Compare({ max = 10, numbers = false }) {
  const [a, setA] = useState(numbers ? 13 : 5);
  const [b, setB] = useState(numbers ? 11 : 3);
  const verdict = numbers
    ? a > b ? `${a} lebih dari ${b}` : a < b ? `${a} kurang dari ${b}` : `${a} sama dengan ${b}`
    : a > b ? "Kucing lebih banyak" : a < b ? "Kucing lebih sedikit" : "Sama banyak";
  const sub = numbers
    ? a === b ? "Kedua bilangan sama besar." : `Bilangan yang lebih besar adalah ${Math.max(a, b)}.`
    : a === b ? `Kucing ${a}, ikan ${b}.` : `Kucing ${a}, ikan ${b}. Selisihnya ${Math.abs(a - b)}.`;
  return (
    <div className="stage">
      <div className="rowgroup">
        <div className="pile left">{numbers ? <Dots counts={[[a, "red"]]} /> : <Items n={a} emoji="🐱" />}</div>
        <Stepper label={numbers ? "Merah" : "Kucing"} value={a} min={0} max={max} onChange={setA} />
      </div>
      <div className="rowgroup">
        <div className="pile left">{numbers ? <Dots counts={[[b, "blue"]]} /> : <Items n={b} emoji="🐟" />}</div>
        <Stepper label={numbers ? "Biru" : "Ikan"} value={b} min={0} max={max} onChange={setB} />
      </div>
      <Say sub={sub}>{verdict}</Say>
    </div>
  );
}

function Line({ max, at, from, visited = [] }) {
  return (
    <div className="numline" style={{ "--cols": 11 }}>
      {range(max + 1).map((i) => (
        <span key={i} style={i === 11 ? { gridColumnStart: 2 } : undefined} className={`tick${i === at ? " at" : ""}${i === from ? " from" : ""}${visited.includes(i) ? " seen" : ""}`}>
          <span className="frog" aria-hidden="true">{i === at ? "🐸" : ""}</span>
          <b>{i}</b>
        </span>
      ))}
    </div>
  );
}

export function Hopper({ max = 10, start = 4 }) {
  const [pos, setPos] = useState(start);
  const [last, setLast] = useState(null);
  const move = (d) => {
    const next = clamp(pos + d, 0, max);
    if (next !== pos) { setLast([pos, d]); setPos(next); }
  };
  return (
    <div className="stage">
      <Line max={max} at={pos} />
      <Say sub={last ? `${last[1] > 0 ? "Maju" : "Mundur"} 1 dari ${last[0]} menjadi ${pos}.` : "Tekan Maju atau Mundur."}>{pos}</Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => move(-1)} disabled={pos <= 0}>← Mundur</button>
        <button type="button" className="chunk" onClick={() => move(1)} disabled={pos >= max}>Maju →</button>
      </div>
    </div>
  );
}

export function Bond({ fixed, plus = false }) {
  const [total, setTotal] = useState(fixed ?? 5);
  const [left, setLeft] = useState(2);
  const l = clamp(left, 0, total);
  const r = total - l;
  return (
    <div className="stage">
      {!fixed && <Stepper label="Semua" value={total} min={2} max={10} onChange={setTotal} />}
      <div className="pile"><Dots counts={[[l, "red big"], [r, "blue big"]]} /></div>
      <input className="slider" type="range" min={0} max={total} value={l} onChange={(e) => setLeft(Number(e.target.value))} aria-label="Geser untuk membagi" />
      <Say sub={`${l} merah dan ${r} biru`}>{plus ? `${l} + ${r} = ${total}` : `${total} = ${l} dan ${r}`}</Say>
    </div>
  );
}

/* ---------- Bab 2 ---------- */

export function Adder({ max = 10 }) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const bb = clamp(b, 0, max - a);
  return (
    <div className="stage">
      <div className="pile"><Items n={a} emoji="🍎" /><span className="op">+</span><Items n={bb} emoji="🍏" /></div>
      <div className="steppers">
        <Stepper label="Merah" value={a} min={0} max={max} onChange={(v) => { setA(v); setB(clamp(b, 0, max - v)); }} />
        <Stepper label="Hijau" value={bb} min={0} max={max - a} onChange={setB} />
      </div>
      <Say sub={`${a} ditambah ${bb} hasilnya adalah ${a + bb}.`}>{a} + {bb} = {a + bb}</Say>
    </div>
  );
}

export function HopCalc({ op = "+", max = 10, a0 = 3, b0 = 4 }) {
  const [a, setA] = useState(a0);
  const [b, setB] = useState(b0);
  const [hops, setHops] = useState(0);
  const dir = op === "+" ? 1 : -1;
  const bMax = op === "+" ? max - a : a;
  const bb = clamp(b, 1, Math.max(1, bMax));
  const cur = a + dir * hops;
  const done = hops >= bb;
  const visited = range(hops + 1).map((i) => a + dir * i);
  const sign = op === "+" ? "+" : "–";
  return (
    <div className="stage">
      <Line max={max} at={cur} from={a} visited={visited} />
      <div className="steppers">
        <Stepper label="Mulai" value={a} min={op === "+" ? 0 : 1} max={op === "+" ? max - 1 : max} onChange={(v) => { setA(v); setHops(0); }} />
        <Stepper label={op === "+" ? "Maju" : "Mundur"} value={bb} min={1} max={Math.max(1, bMax)} onChange={(v) => { setB(v); setHops(0); }} />
      </div>
      <Say sub={done ? `Katak mulai dari ${a}, ${op === "+" ? "maju" : "mundur"} ${bb} lompatan, sampai di ${cur}.` : `Lompatan ke-${hops} dari ${bb}. Katak ada di ${cur}.`}>
        {a} {sign} {bb} = {done ? cur : "?"}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setHops(0)} disabled={hops === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setHops(hops + 1)} disabled={done}>🐸 Lompat</button>
      </div>
    </div>
  );
}

export function Doubles() {
  const [n, setN] = useState(3);
  return (
    <div className="stage">
      <div className="pile col">
        <Items n={n} emoji="🧦" />
        <Items n={n} emoji="🧦" />
      </div>
      <Stepper label="Tiap baris" value={n} min={1} max={5} onChange={setN} />
      <Say sub={`${n} ditambah ${n} hasilnya adalah ${2 * n}.`}>{n} + {n} = {2 * n}</Say>
    </div>
  );
}

/* ---------- Bab 3 ---------- */

export function TakeAway() {
  const [a, setA] = useState(7);
  const [gone, setGone] = useState(() => new Set());
  const b = gone.size;
  const toggle = (i) => {
    const next = new Set(gone);
    next.has(i) ? next.delete(i) : next.add(i);
    setGone(next);
  };
  return (
    <div className="stage">
      <div className="pile">
        {range(a).map((i) => (
          <button type="button" key={i} className={`item-btn${gone.has(i) ? " gone" : ""}`} onClick={() => toggle(i)} aria-label={gone.has(i) ? "Kembalikan kue" : "Makan kue"}>🍪</button>
        ))}
      </div>
      <Stepper label="Kue" value={a} min={1} max={10} onChange={(v) => { setA(v); setGone(new Set()); }} />
      <Say sub={b === 0 ? "Ketuk kue untuk memakannya." : `${a} dikurangi ${b} hasilnya adalah ${a - b}.`}>{a} – {b} = {a - b}</Say>
    </div>
  );
}

export function FactFamily() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = a + b;
  return (
    <div className="stage">
      <div className="pile"><Dots counts={[[a, "red big"], [b, "blue big"]]} /></div>
      <div className="steppers">
        <Stepper label="Merah" value={a} min={1} max={5} onChange={setA} />
        <Stepper label="Biru" value={b} min={1} max={5} onChange={setB} />
      </div>
      <div className="family">
        <span>{a} + {b} = {c}</span>
        <span>{b} + {a} = {c}</span>
        <span>{c} – {a} = {b}</span>
        <span>{c} – {b} = {a}</span>
      </div>
      <Say sub={`Tiga bilangan yang sama: ${a}, ${b}, dan ${c}.`}>Tambah dan kurang berteman</Say>
    </div>
  );
}

/* ---------- Bab 4 ---------- */

const C = { merah: "#F2543D", biru: "#2E8BE6", kuning: "#F5B700" };

function Shape({ kind, color = C.biru, size = 64 }) {
  const p = { fill: color, stroke: "#23304A", strokeWidth: 3, strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      {kind === "lengkung" && <circle cx="32" cy="32" r="26" {...p} />}
      {kind === "lonjong" && <ellipse cx="32" cy="32" rx="28" ry="18" {...p} />}
      {kind === "segitiga" && <polygon points="32,6 58,56 6,56" {...p} />}
      {kind === "segitiga2" && <polygon points="6,8 58,56 6,56" {...p} />}
      {kind === "segiempat" && <rect x="8" y="8" width="48" height="48" {...p} />}
      {kind === "panjang" && <rect x="4" y="18" width="56" height="28" {...p} />}
    </svg>
  );
}

const SHAPE_INFO = {
  lengkung: {
    nama: "Bentuk lengkung", kinds: ["lengkung", "lonjong"], color: C.merah,
    ciri: "Sisinya melengkung. Tidak ada sisi yang lurus.",
    contoh: "🪙 uang koin, 🕐 jam dinding, 🍪 biskuit bundar",
  },
  segitiga: {
    nama: "Segitiga", kinds: ["segitiga", "segitiga2"], color: C.kuning,
    ciri: "Punya 3 sisi yang lurus.",
    contoh: "📐 penggaris segitiga, 🍕 potongan piza, ⛵ layar perahu",
  },
  segiempat: {
    nama: "Segi empat", kinds: ["segiempat", "panjang"], color: C.biru,
    ciri: "Punya 4 sisi yang lurus.",
    contoh: "📕 buku, 🚪 pintu, 🪟 jendela",
  },
};

export function ShapeExplorer() {
  const [k, setK] = useState("lengkung");
  const info = SHAPE_INFO[k];
  return (
    <div className="stage">
      <div className="tabs">
        {Object.entries(SHAPE_INFO).map(([id, s]) => (
          <button type="button" key={id} className={`tab${id === k ? " on" : ""}`} onClick={() => setK(id)}>{s.nama}</button>
        ))}
      </div>
      <div className="pile">{info.kinds.map((kind) => <Shape key={kind} kind={kind} color={info.color} size={96} />)}</div>
      <Say sub={`Contoh benda: ${info.contoh}.`}>{info.ciri}</Say>
    </div>
  );
}

const SHAPES = [
  ["lengkung", "merah", "besar"], ["segitiga", "biru", "kecil"], ["segiempat", "kuning", "besar"],
  ["segitiga", "merah", "besar"], ["lengkung", "biru", "kecil"], ["segiempat", "merah", "kecil"],
  ["lengkung", "kuning", "kecil"], ["segiempat", "biru", "besar"], ["segitiga", "kuning", "besar"],
].map(([bentuk, warna, ukuran], id) => ({ id, bentuk, warna, ukuran }));

const GROUP_LABEL = {
  campur: { semua: "Belum dikelompokkan" },
  bentuk: { lengkung: "Bentuk lengkung", segitiga: "Segitiga", segiempat: "Segi empat" },
  warna: { merah: "Merah", biru: "Biru", kuning: "Kuning" },
  ukuran: { besar: "Besar", kecil: "Kecil" },
};

export function GroupBy() {
  const [by, setBy] = useState("campur");
  const groups = Object.entries(GROUP_LABEL[by]).map(([key, label]) => [label, SHAPES.filter((s) => by === "campur" || s[by] === key)]);
  return (
    <div className="stage">
      <div className="tabs">
        {[["campur", "Campur"], ["bentuk", "Bentuk"], ["warna", "Warna"], ["ukuran", "Ukuran"]].map(([id, label]) => (
          <button type="button" key={id} className={`tab${id === by ? " on" : ""}`} onClick={() => setBy(id)}>{label}</button>
        ))}
      </div>
      <div className="groups">
        {groups.map(([label, list]) => (
          <div className="group-box" key={label}>
            <b>{label}{by !== "campur" && `: ${list.length}`}</b>
            <span className="shape-row">
              {list.map((s) => <Shape key={s.id} kind={s.bentuk} color={C[s.warna]} size={s.ukuran === "besar" ? 52 : 32} />)}
            </span>
          </div>
        ))}
      </div>
      <Say sub="Benda yang sama bisa dikelompokkan dengan cara yang berbeda.">
        {by === "campur" ? "Pilih cara mengelompokkan" : `Dikelompokkan menurut ${by}`}
      </Say>
    </div>
  );
}

export function ComposeShapes() {
  const [puzzle, setPuzzle] = useState("segitiga");
  const [joined, setJoined] = useState(false);
  const gap = joined ? 0 : 14;
  const p = { stroke: "#23304A", strokeWidth: 3, strokeLinejoin: "round" };
  return (
    <div className="stage">
      <div className="tabs">
        <button type="button" className={`tab${puzzle === "segitiga" ? " on" : ""}`} onClick={() => { setPuzzle("segitiga"); setJoined(false); }}>2 segitiga</button>
        <button type="button" className={`tab${puzzle === "segiempat" ? " on" : ""}`} onClick={() => { setPuzzle("segiempat"); setJoined(false); }}>2 segi empat</button>
      </div>
      <svg className="compose" viewBox="0 0 220 120" role="img" aria-label={joined ? "Bangun yang sudah disusun" : "Dua bangun yang terpisah"}>
        {puzzle === "segitiga" ? (
          <>
            <polygon points="60,20 60,100 140,100" fill={C.kuning} {...p} style={{ transform: `translate(${-gap}px, ${gap / 2}px)` }} />
            <polygon points="60,20 140,20 140,100" fill={C.merah} {...p} style={{ transform: `translate(${gap}px, ${-gap / 2}px)` }} />
          </>
        ) : (
          <>
            <rect x="40" y="25" width="70" height="70" fill={C.biru} {...p} style={{ transform: `translate(${-gap}px, 0)` }} />
            <rect x="110" y="25" width="70" height="70" fill={C.kuning} {...p} style={{ transform: `translate(${gap}px, 0)` }} />
          </>
        )}
      </svg>
      <Say sub={joined ? "Kalau diurai, bangun itu kembali menjadi dua bangun kecil." : "Tekan Susun untuk menggabungkannya."}>
        {joined
          ? puzzle === "segitiga" ? "2 segitiga menjadi 1 segi empat" : "2 segi empat menjadi 1 segi empat yang lebih panjang"
          : puzzle === "segitiga" ? "Ada 2 segitiga" : "Ada 2 segi empat"}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setJoined(false)} disabled={!joined}>✂️ Urai</button>
        <button type="button" className="chunk go" onClick={() => setJoined(true)} disabled={joined}>🧩 Susun</button>
      </div>
    </div>
  );
}

/* ---------- Bab 5 ---------- */

export function Teen() {
  const [n, setN] = useState(14);
  const ones = n - 10;
  const tens = n === 20 ? 2 : 1;
  return (
    <div className="stage">
      <div className="frames">
        <TenFrame a={10} />
        <TenFrame b={ones} />
      </div>
      <Stepper label="Bilangan" value={n} min={11} max={20} onChange={setN} />
      <Say sub={`dibaca: ${NAMA[n]}. ${tens} puluhan dan ${n === 20 ? 0 : ones} satuan.`}>{n} = 10 + {ones}</Say>
    </div>
  );
}

/* ---------- Bab 6 ---------- */

export function Difference() {
  const [a, setA] = useState(8);
  const [b, setB] = useState(5);
  const lo = Math.min(a, b);
  const row = (n, emoji) => (
    <span className="match-row">
      {range(n).map((i) => <span key={i} className={i < lo ? "paired" : "extra"}>{emoji}</span>)}
    </span>
  );
  return (
    <div className="stage">
      <div className="pile col left">
        {row(a, "🍩")}
        {row(b, "🧁")}
      </div>
      <div className="steppers">
        <Stepper label="Donat" value={a} min={0} max={10} onChange={setA} />
        <Stepper label="Kue" value={b} min={0} max={10} onChange={setB} />
      </div>
      <Say sub={a === b ? "Semua punya pasangan. Selisihnya 0." : `${Math.max(a, b)} – ${lo} = ${Math.abs(a - b)}. Selisihnya ${Math.abs(a - b)}.`}>
        {a > b ? `Donat lebih banyak ${a - b} dari kue` : a < b ? `Donat lebih sedikit ${b - a} dari kue` : "Donat dan kue sama banyak"}
      </Say>
    </div>
  );
}

export function MakeTen() {
  const [a, setA] = useState(8);
  const [b, setB] = useState(5);
  const [step, setStep] = useState(0);
  const bMin = 11 - a;
  const bb = clamp(b, bMin, 9);
  const k = 10 - a;
  const r = bb - k;
  const moved = step >= 1 ? k : 0;
  const text = [
    [`${a} + ${bb} = ?`, `Kotak merah ada ${a}. Bola biru ada ${bb}.`],
    [`${a} + ${k} = 10`, `Pindahkan ${k} bola biru ke kotak supaya penuh 10. Bola biru tersisa ${r}.`],
    [`${a} + ${bb} = ${a + bb}`, `10 ditambah ${r} hasilnya adalah ${a + bb}.`],
  ][step];
  return (
    <div className="stage">
      <div className="frames">
        <TenFrame a={a} b={moved} />
        <span className="pile left"><Dots counts={[[bb - moved, "blue big"]]} /></span>
      </div>
      <div className="steppers">
        <Stepper label="Merah" value={a} min={6} max={9} onChange={(v) => { setA(v); setStep(0); }} />
        <Stepper label="Biru" value={bb} min={bMin} max={9} onChange={(v) => { setB(v); setStep(0); }} />
      </div>
      <Say sub={text[1]}>{text[0]}</Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setStep(0)} disabled={step === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setStep(step + 1)} disabled={step === 2}>Berikutnya →</button>
      </div>
    </div>
  );
}

export function TeenOp() {
  const [op, setOp] = useState("+");
  const [u, setU] = useState(3);
  const [v, setV] = useState(4);
  const plus = op === "+";
  const uu = plus ? clamp(u, 1, 8) : clamp(u, 1, 9);
  const vv = plus ? clamp(v, 1, 9 - uu) : clamp(v, 1, uu);
  const res = plus ? uu + vv : uu - vv;
  const sign = plus ? "+" : "–";
  return (
    <div className="stage">
      <div className="tabs">
        <button type="button" className={`tab${plus ? " on" : ""}`} onClick={() => setOp("+")}>Tambah</button>
        <button type="button" className={`tab${!plus ? " on" : ""}`} onClick={() => setOp("-")}>Kurang</button>
      </div>
      <div className="frames">
        <TenFrame a={10} />
        {plus ? <TenFrame a={uu} b={vv} /> : <TenFrame a={uu} crossed={vv} />}
      </div>
      <div className="steppers">
        <Stepper label="Satuan" value={uu} min={1} max={plus ? 8 : 9} onChange={setU} />
        <Stepper label={plus ? "Ditambah" : "Dikurangi"} value={vv} min={1} max={plus ? 9 - uu : uu} onChange={setV} />
      </div>
      <Say sub={`Puluhannya tetap 10. Satuannya ${uu} ${sign} ${vv} = ${res}.`}>{10 + uu} {sign} {vv} = {10 + res}</Say>
    </div>
  );
}

/* ---------- Bab 7 ---------- */

export function LengthCompare() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(5);
  const [shift, setShift] = useState(false);
  const bar = (n, color, offset) => (
    <div className="bar-track">
      <div className="bar" style={{ width: `${n * 8}%`, marginLeft: offset ? "18%" : 0, background: color }}>✏️</div>
    </div>
  );
  return (
    <div className="stage">
      <div className="bars">
        {bar(a, C.merah, false)}
        {bar(b, C.biru, shift)}
      </div>
      <div className="steppers">
        <Stepper label="Merah" value={a} min={2} max={10} onChange={setA} />
        <Stepper label="Biru" value={b} min={2} max={10} onChange={setB} />
      </div>
      <Say sub={shift ? "Ujungnya tidak rata, jadi sulit dibandingkan. Ratakan dulu ujungnya." : "Ujung kiri kedua pensil sudah rata."}>
        {a > b ? "Pensil merah lebih panjang" : a < b ? "Pensil merah lebih pendek" : "Kedua pensil sama panjang"}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setShift(!shift)}>{shift ? "Ratakan ujungnya" : "Geser pensil biru"}</button>
      </div>
    </div>
  );
}

const UNITS = {
  koin: { emoji: "🪙", size: 1, nama: "koin" },
  klip: { emoji: "📎", size: 2, nama: "klip kertas" },
  jengkal: { emoji: "🖐️", size: 4, nama: "jengkal" },
};

export function Measure({ chooseUnit = false }) {
  const [len, setLen] = useState(chooseUnit ? 12 : 10);
  const [unit, setUnit] = useState(chooseUnit ? "koin" : "klip");
  const u = UNITS[unit];
  const count = len / u.size;
  const cell = 100 / 12;
  return (
    <div className="stage">
      {chooseUnit && (
        <div className="tabs">
          {Object.entries(UNITS).map(([id, x]) => (
            <button type="button" key={id} className={`tab${id === unit ? " on" : ""}`} onClick={() => setUnit(id)}>{x.emoji} {x.nama}</button>
          ))}
        </div>
      )}
      <div className="bars">
        <div className="bar-track"><div className="bar ribbon" style={{ width: `${len * cell}%` }}>🎀 pita</div></div>
        <div className="unit-row">
          {range(count).map((i) => <span key={i} className="unit" style={{ width: `${u.size * cell}%` }}>{u.emoji}</span>)}
        </div>
      </div>
      {!chooseUnit && <Stepper label="Panjang pita" value={len / 2} min={1} max={6} onChange={(v) => setLen(v * 2)} />}
      <Say sub={chooseUnit ? "Pitanya sama. Alat ukur yang lebih besar, hitungannya lebih sedikit." : "Alat ukur disusun rapat dari ujung ke ujung, tanpa celah."}>
        Panjang pita {count} {u.nama}
      </Say>
    </div>
  );
}

/* ---------- Bab 8 ---------- */

const FRUITS = [["🍎", "apel"], ["🍌", "pisang"], ["🍇", "anggur"], ["🍊", "jeruk"]];

export function DataChart({ start = [3, 5, 2, 4], view = "tabel" }) {
  const [counts, setCounts] = useState(start);
  const total = counts.reduce((s, n) => s + n, 0);
  const add = (i) => setCounts(counts.map((n, k) => (k === i ? Math.min(8, n + 1) : n)));
  const names = (val) => FRUITS.filter((_, i) => counts[i] === val).map((f) => f[1]).join(" dan ");
  const hi = Math.max(...counts), lo = Math.min(...counts);
  return (
    <div className="stage">
      <div className="actions wrap">
        {FRUITS.map(([e, nama], i) => (
          <button type="button" key={nama} className="chunk fruit" onClick={() => add(i)} aria-label={`Tambah satu anak yang suka ${nama}`}>{e} +1</button>
        ))}
      </div>
      {view === "tabel" ? (
        <table className="data">
          <thead><tr><th>Buah</th><th>Banyak anak</th></tr></thead>
          <tbody>
            {FRUITS.map(([e, nama], i) => <tr key={nama}><td>{e} {nama}</td><td>{counts[i]}</td></tr>)}
          </tbody>
        </table>
      ) : (
        <div className="picto">
          {FRUITS.map(([e, nama], i) => (
            <div className="picto-row" key={nama}>
              <b>{nama}</b>
              <span>{counts[i] === 0 ? "–" : range(counts[i]).map((k) => <span key={k}>{e}</span>)}</span>
            </div>
          ))}
        </div>
      )}
      <Say sub={total === 0 ? "Ketuk buah untuk menambah data." : `Paling sedikit: ${names(lo)} (${lo}). Semua anak: ${total}.`}>
        {total === 0 ? "Belum ada data" : hi === lo ? "Semua buah sama banyak" : `Paling banyak: ${names(hi)} (${hi})`}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setCounts([0, 0, 0, 0])} disabled={total === 0}>↺ Kosongkan</button>
      </div>
    </div>
  );
}
