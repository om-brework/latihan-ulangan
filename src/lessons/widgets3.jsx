/* Alat peraga untuk Belajar Bahasa Inggris: kartu kosakata, ungkapan, dan permainan dengar-pilih */
import { useState } from "react";
import { Say } from "./widgets.jsx";
import { canSpeak, speak } from "../lib/speak.js";

/* Kartu kosakata: ketuk untuk mendengar dan melihat artinya. items: [[gambar, kata, arti]] */
export function VocabCards({ items }) {
  const [i, setI] = useState(null);
  const pick = (k) => { setI(k); speak(items[k][1]); };
  return (
    <div className="stage">
      <div className="vocab-grid">
        {items.map(([emoji, word], k) => (
          <button type="button" key={word} className={`vocab${k === i ? " on" : ""}`} onClick={() => pick(k)}>
            <span aria-hidden="true">{emoji}</span>
            <b>{word}</b>
          </button>
        ))}
      </div>
      <Say sub={i === null ? (canSpeak() ? "Dengarkan, lalu tirukan dengan suara keras." : "Baca katanya dengan suara keras.") : `artinya: ${items[i][2]}`}>
        {i === null ? "Ketuk sebuah gambar" : `${items[i][0]} ${items[i][1]}`}
      </Say>
    </div>
  );
}

/* Ungkapan: ketuk untuk mendengar dan melihat artinya. items: [[ungkapan, arti]] */
export function PhraseCards({ items }) {
  const [i, setI] = useState(null);
  const pick = (k) => { setI(k); speak(items[k][0]); };
  return (
    <div className="stage">
      <div className="phrases">
        {items.map(([en], k) => (
          <button type="button" key={en} className={`phrase${k === i ? " on" : ""}`} onClick={() => pick(k)}>
            <span aria-hidden="true">{canSpeak() ? "🔊" : "💬"}</span>
            <b>{en}</b>
          </button>
        ))}
      </div>
      <Say sub={i === null ? "Dengarkan, lalu tirukan." : "Tirukan dengan suara keras."}>
        {i === null ? "Ketuk sebuah kalimat" : `Artinya: ${items[i][1]}`}
      </Say>
    </div>
  );
}

function makeRound(items, byMeaning, avoid) {
  const label = (it) => (byMeaning ? it[2] : it[0]);
  let target;
  do { target = items[Math.floor(Math.random() * items.length)]; } while (items.length > 1 && target === avoid);
  // pilihan lain tidak boleh berlabel sama dengan jawaban (misalnya dua kata dengan gambar yang sama)
  const pool = items.filter((it) => it !== target && label(it) !== label(target));
  const others = [];
  while (others.length < 2 && pool.length) {
    const [it] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    if (!others.some((o) => label(o) === label(it))) others.push(it);
  }
  const options = [target, ...others].sort(() => Math.random() - 0.5);
  return { target, options };
}

/* Dengar lalu pilih. byMeaning: pilihan berupa arti (untuk unit yang gambarnya mirip) */
export function ListenPick({ items, byMeaning = false }) {
  const [round, setRound] = useState(() => makeRound(items, byMeaning, null));
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const { target, options } = round;
  const ok = picked === target;
  const next = () => {
    const r = makeRound(items, byMeaning, target);
    setRound(r);
    setPicked(null);
    speak(r.target[1]);
  };
  return (
    <div className="stage">
      <p className="counter">Benar: {right} ⭐</p>
      <div className="actions">
        {canSpeak()
          ? <button type="button" className="chunk go listen-big" onClick={() => speak(target[1])}>🔊 Dengarkan</button>
          : <b className="tile">{target[1]}</b>}
      </div>
      <div className={`vocab-grid${byMeaning ? " text" : ""}`}>
        {options.map((it) => (
          <button
            type="button"
            key={it[1]}
            className={`vocab${picked === it ? (it === target ? " right" : " wrong shake") : ""}`}
            disabled={ok}
            onClick={() => { setPicked(it); if (it === target && !ok) setRight(right + 1); }}
          >
            {byMeaning ? <b>{it[2]}</b> : <span aria-hidden="true">{it[0]}</span>}
          </button>
        ))}
      </div>
      <Say sub={ok ? `${target[1]} artinya ${target[2]}.` : picked ? "Belum tepat. Dengarkan sekali lagi." : (byMeaning ? "Pilih arti kata yang kamu dengar." : "Pilih gambar dari kata yang kamu dengar.")}>
        {ok ? `Benar! ${target[0]} ${target[1]}` : "Kata apa itu?"}
      </Say>
      <div className="actions">
        <button type="button" className="chunk go" onClick={next} disabled={!ok}>Kata berikutnya →</button>
      </div>
    </div>
  );
}
