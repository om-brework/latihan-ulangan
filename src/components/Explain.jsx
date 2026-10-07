/* Pembahasan satu soal: tiga langkah (baca soal, cari jawaban dengan alat peraga, kesimpulan). */
import { useMemo, useState } from "react";
import { AJAIB, closingText, explainKind } from "../lib/explain.js";
import { KATA } from "../data/bank.js";

const range = (n) => Array.from({ length: Math.max(0, n) }, (_, i) => i);

function Say({ children, sub }) {
  return (
    <div className="say" aria-live="polite">
      <strong>{children}</strong>
      {sub && <span>{sub}</span>}
    </div>
  );
}

/* Kotak 10 per baris: merah, lalu biru; `gone` kotak merah terakhir dicoret */
function Cells({ red = 0, blue = 0, gone = 0 }) {
  const total = red + blue;
  return (
    <span className="cells20">
      {range(Math.max(10, Math.ceil(total / 10) * 10)).map((i) => (
        <i key={i} className={`cell ${i < red ? "red" : i < total ? "blue pop" : ""}${i < red && i >= red - gone ? " crossed" : ""}`} />
      ))}
    </span>
  );
}

function CalcDemo({ a, b, op }) {
  const [k, setK] = useState(0);
  const plus = op === "+";
  const now = plus ? a + k : a - k;
  const done = k >= b;
  const trail = range(k).map((i) => (plus ? a + i + 1 : a - i - 1)).join(", ");
  return (
    <div className="stage">
      <div className="pile"><Cells red={a} blue={plus ? k : 0} gone={plus ? 0 : k} /></div>
      <Say sub={k === 0 ? `Mulai dengan ${a} kotak merah.` : `Hitung ${plus ? "maju" : "mundur"}: ${trail}`}>
        {done ? `${a} ${plus ? "+" : "–"} ${b} = ${now}` : `${plus ? "Tambah" : "Ambil"} ${b - k} lagi`}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setK(0)} disabled={k === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setK(k + 1)} disabled={done}>{plus ? "➕ Tambah 1" : "➖ Ambil 1"}</button>
      </div>
    </div>
  );
}

function ChainDemo({ steps }) {
  const [i, setI] = useState(0);
  return (
    <>
      <p className="counter">Hitungan {i + 1} dari 2: kerjakan dari kiri, satu per satu.</p>
      <CalcDemo key={i} {...steps[i]} />
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setI(0)} disabled={i === 0}>← Hitungan pertama</button>
        <button type="button" className="chunk go" onClick={() => setI(1)} disabled={i === 1}>Hitungan kedua →</button>
      </div>
    </>
  );
}

function InverseDemo({ a, b, op, asked }) {
  return (
    <>
      <p className="counter">Kita bekerja mundur: kebalikan dari {asked === "+" ? "ditambah" : "dikurangi"} adalah {op === "+" ? "ditambah" : "dikurangi"}.</p>
      <CalcDemo a={a} b={b} op={op} />
    </>
  );
}

function MissingDemo({ a, c, op, b }) {
  const [k, setK] = useState(0);
  const plus = op === "+";
  const now = plus ? a + k : a - k;
  const done = now === c;
  return (
    <div className="stage">
      <div className="pile"><Cells red={a} blue={plus ? k : 0} gone={plus ? 0 : k} /></div>
      <Say sub={done ? `Kamu ${plus ? "menambah" : "mengambil"} ${b} kali.` : `Sekarang ada ${now}. Kita mau jadi ${c}.`}>
        {done ? `${a} ${plus ? "+" : "–"} ${b} = ${c}` : `${a} ${plus ? "+" : "–"} ? = ${c}`}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setK(0)} disabled={k === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setK(k + 1)} disabled={done}>{plus ? "➕ Tambah 1" : "➖ Ambil 1"}</button>
      </div>
    </div>
  );
}

function CountDemo({ emoji, n }) {
  const [order, setOrder] = useState([]);
  const done = order.length === n;
  return (
    <div className="stage">
      <div className="pile count-pile">
        {range(n).map((i) => {
          const at = order.indexOf(i);
          return (
            <button type="button" key={i} className={`count-btn${at >= 0 ? " counted" : ""}`} onClick={() => at < 0 && setOrder([...order, i])} aria-label={at >= 0 ? `Sudah dihitung, nomor ${at + 1}` : "Hitung benda ini"}>
              <span>{emoji}</span>{at >= 0 && <b>{at + 1}</b>}
            </button>
          );
        })}
      </div>
      <Say sub={done ? "Bilangan terakhir yang kamu sebut adalah banyaknya." : "Ketuk bendanya satu per satu sambil menghitung."}>
        {done ? `Ada ${n}` : order.length === 0 ? "Ayo hitung!" : `${order.length}…`}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setOrder([])} disabled={order.length === 0}>↺ Ulang</button>
      </div>
    </div>
  );
}

function SeqDemo({ items, at, d }) {
  const [step, setStep] = useState(0);
  const word = d > 0 ? `bertambah ${d}` : `berkurang ${-d}`;
  return (
    <div className="stage">
      <div className="pile seq">
        {items.map((v, i) => (
          <span key={i} className="seq-item">
            {i > 0 && <i className={`seq-jump${step >= 1 ? " show" : ""}`}>{d > 0 ? `+${d}` : d}</i>}
            <b className={`tile${i === at ? (step >= 2 ? " result" : " blank") : ""}`}>{i === at && step < 2 ? "?" : v}</b>
          </span>
        ))}
      </div>
      <Say sub={step === 0 ? "Lihat dua bilangan yang berdekatan." : `Setiap langkah, bilangannya ${word}.`}>
        {step === 0 ? "Bagaimana polanya?" : step === 1 ? `Polanya ${word}` : `Bilangan yang hilang: ${items[at]}`}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setStep(0)} disabled={step === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setStep(step + 1)} disabled={step >= 2}>{step === 0 ? "🔍 Lihat polanya" : "Isi yang kosong"}</button>
      </div>
    </div>
  );
}

function TilesDemo({ before, after, answer, word }) {
  const [step, setStep] = useState(0);
  return (
    <div className="stage">
      <div className={`join${step === 2 ? " joined" : ""}`}>
        {before.map((s) => <b className="tile" key={`b${s}`}>{s}</b>)}
        {step === 0
          ? <button type="button" className="tile blank" onClick={() => setStep(1)} aria-label="Isi suku kata yang kosong">?</button>
          : <b className="tile result pop">{answer}</b>}
        {after.map((s) => <b className="tile" key={`a${s}`}>{s}</b>)}
      </div>
      <Say sub={step === 0 ? "Ketuk kotak yang kosong." : step === 1 ? `Suku kata yang hilang adalah ${answer}.` : `Dibaca: ${word}`}>
        {step === 2 ? word : [...before, step === 0 ? "…" : answer, ...after].join(" - ")}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setStep(0)} disabled={step === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setStep(2)} disabled={step !== 1}>🧩 Gabung</button>
      </div>
    </div>
  );
}

function JoinDemo({ parts, word }) {
  const [order, setOrder] = useState(parts);
  const [joined, setJoined] = useState(false);
  const right = order.join("") === word;
  return (
    <div className="stage">
      <div className={`join${joined ? " joined" : ""}`}>
        {order.map((s) => <b className="tile" key={s + order.indexOf(s)}>{s}</b>)}
      </div>
      <Say sub={joined ? `Dibaca: ${word}` : right ? "Urutannya sudah pas. Sekarang gabungkan." : "Coba baca. Belum jadi kata, tukar tempatnya."}>
        {joined ? word : order.join(" + ")}
      </Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => { setOrder([order[1], order[0]]); setJoined(false); }}>🔄 Tukar tempat</button>
        <button type="button" className="chunk go" onClick={() => setJoined(true)} disabled={!right || joined}>🧩 Gabung</button>
      </div>
    </div>
  );
}

function MarksDemo({ q, info }) {
  const [pick, setPick] = useState(null);
  const a = q.src.a;
  const head = info.word ? info.sentence.slice(0, info.word.length) : "";
  return (
    <div className="stage">
      <div className="pile sentence">
        <b>{info.word ? <><mark>{head}</mark>{info.sentence.slice(head.length)}</> : info.sentence} <span className="mark-slot">{pick === a ? a : "…"}</span></b>
      </div>
      <Say sub={info.rule}>
        {info.word ? `Diawali kata tanya “${head}”` : a === "?" ? "Kalimat ini bertanya" : a === "!" ? "Ini bukan pertanyaan" : "Kalimat ini memberi tahu"}
      </Say>
      <div className="actions">
        {q.opts.map((o) => (
          <button type="button" key={o} className={`chunk mark${pick === o ? (o === a ? " right" : " wrong shake") : ""}`} onClick={() => setPick(o)} aria-label={o === "?" ? "tanda tanya" : o === "!" ? "tanda seru" : "tanda titik"}>{o}</button>
        ))}
      </div>
      {pick !== null && pick !== a && <p className="counter">Belum tepat. Baca aturannya sekali lagi.</p>}
    </div>
  );
}

function AjaibDemo({ q }) {
  const [seen, setSeen] = useState([]);
  const a = q.src.a;
  return (
    <div className="stage">
      <div className="ajaib">
        {KATA.map((k) => {
          const open = seen.includes(k);
          return (
            <button type="button" key={k} className={`ajaib-card${open ? (k === a ? " right" : " open") : ""}`} onClick={() => !open && setSeen([...seen, k])}>
              <b>{k}</b>
              <span>{open ? AJAIB[k] : "ketuk"}</span>
            </button>
          );
        })}
      </div>
      <Say sub="Ketuk tiap kata untuk melihat kapan memakainya.">
        {seen.includes(a) ? `Yang cocok: ${a}` : "Kata mana yang cocok?"}
      </Say>
    </div>
  );
}

function ChoiceDemo({ q }) {
  const [seen, setSeen] = useState([]);
  const a = q.src.a;
  return (
    <div className="stage">
      <div className="elim">
        {q.opts.map((o) => {
          const open = seen.includes(o);
          return (
            <button type="button" key={o} className={`elim-card${open ? (o === a ? " right" : " wrong") : ""}`} onClick={() => !open && setSeen([...seen, o])}>
              <span className="elim-mark" aria-hidden="true">{open ? (o === a ? "✓" : "✕") : "?"}</span>
              <b>{o}</b>
            </button>
          );
        })}
      </div>
      <Say sub="Ketuk tiap pilihan untuk memeriksanya.">
        {seen.includes(a) ? "Ini jawaban yang tepat" : seen.length ? "Yang itu belum tepat" : "Kita periksa satu per satu"}
      </Say>
    </div>
  );
}

function FillDemo({ q }) {
  const a = String(q.src.a);
  const [n, setN] = useState(0);
  return (
    <div className="stage">
      <div className="join">
        {a.split("").map((ch, i) => <b key={i} className={`tile${i < n ? " result pop" : " blank"}`}>{i < n ? ch : "?"}</b>)}
      </div>
      <Say sub={n >= a.length ? "Itu jawabannya." : "Buka satu per satu sambil menebak."}>{n >= a.length ? a : "Apa jawabannya?"}</Say>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setN(0)} disabled={n === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setN(n + 1)} disabled={n >= a.length}>{/^\d+$/.test(a) ? "Buka angka" : "Buka satu huruf"}</button>
      </div>
    </div>
  );
}

const ASK = {
  calc: (i) => (i.op === "+" ? "Tanda + berarti ditambah. Kita menggabungkan." : "Tanda – berarti dikurangi. Kita mengambil."),
  missing: () => "Ada bilangan yang belum diketahui. Kita cari dengan menghitung.",
  chain: () => "Ada dua hitungan. Kita kerjakan dari kiri, satu per satu.",
  inverse: () => "Bilangan pertama belum diketahui. Kita cari dengan bekerja mundur.",
  count: () => "Kita diminta menghitung banyak benda.",
  seq: () => "Ada bilangan yang hilang dalam urutan.",
  tiles: () => "Ada suku kata yang hilang. Kita cari supaya menjadi kata.",
  join: () => "Suku katanya perlu disusun supaya menjadi kata.",
  marks: () => "Kita pilih tanda baca di akhir kalimat.",
  ajaib: () => "Kita pilih kata ajaib yang cocok.",
  choice: () => "Kita pilih satu jawaban yang paling tepat.",
  fill: () => "Kita tulis jawabannya di kotak.",
};

function Demo({ q, info }) {
  switch (info.kind) {
    case "calc": return <CalcDemo {...info} />;
    case "missing": return <MissingDemo {...info} />;
    case "chain": return <ChainDemo steps={info.steps} />;
    case "inverse": return <InverseDemo {...info} />;
    case "count": return <CountDemo {...info} />;
    case "seq": return <SeqDemo {...info} />;
    case "tiles": return <TilesDemo before={info.before} after={info.after} answer={q.src.a} word={info.word} />;
    case "join": return <JoinDemo parts={info.parts} word={info.word} />;
    case "marks": return <MarksDemo q={q} info={info} />;
    case "ajaib": return <AjaibDemo q={q} />;
    case "choice": return <ChoiceDemo q={q} />;
    default: return <FillDemo q={q} />;
  }
}

const STEPS = ["Baca soalnya", "Cari jawabannya", "Jadi jawabannya"];

export default function Explain({ q, onClose }) {
  const info = useMemo(() => explainKind(q), [q]);
  const [step, setStep] = useState(0);
  const { src } = q;
  const blank = src.pre || src.post ? `${src.pre ?? ""} ___ ${src.post ?? ""}`.trim() : null;

  return (
    <div className="explain" role="dialog" aria-modal="true" aria-label="Pembahasan soal">
      <header className="explain-top">
        <b>💡 Pembahasan</b>
        <span className="pips" aria-hidden="true">{STEPS.map((s, i) => <i key={s} className={i === step ? "on" : i < step ? "done" : ""} />)}</span>
        <button type="button" className="game-close" onClick={onClose} aria-label="Tutup pembahasan">✕</button>
      </header>

      <div className="explain-body">
        <p className="explain-step">Langkah {step + 1} dari 3 · {STEPS[step]}</p>
        {step === 0 && (
          <div className="stage">
            <div className="pile explain-q">
              <b>{src.t}</b>
              {src.c && src.c.split(" | ").map((line) => <span key={line}>{line}</span>)}
              {blank && <span className="explain-blank">{blank}</span>}
            </div>
            <Say sub="Baca pelan-pelan sampai selesai.">{ASK[info.kind](info)}</Say>
          </div>
        )}
        {step === 1 && <Demo q={q} info={info} />}
        {step === 2 && (
          <div className="stage">
            <div className="pile answer-big pop"><b>{src.a}</b></div>
            <Say>{closingText(q, info)}</Say>
          </div>
        )}
      </div>

      <footer className="explain-bottom">
        <button type="button" className="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>← Kembali</button>
        {step < 2
          ? <button type="button" className="main" onClick={() => setStep(step + 1)}>Lanjut →</button>
          : <button type="button" className="main" onClick={onClose}>Mengerti 👍</button>}
      </footer>
    </div>
  );
}
