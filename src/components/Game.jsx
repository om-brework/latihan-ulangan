/* Satu level sebagai permainan: soal tampil satu per satu (carousel), langsung dinilai, lalu bintang di akhir. */
import { useRef, useState } from "react";
import { answerValue, isCorrect } from "../lib/grade.js";
import { PASS_SCORE, levelStars } from "../data/catalog.js";
import { buildAttempt } from "../lib/progress.js";
import { useSession } from "../lib/session.jsx";
import Question from "./Question.jsx";
import Explain from "./Explain.jsx";

const CHEERS = ["Benar! 🎉", "Hebat! ⭐", "Mantap! 👍", "Pintar! 🌟", "Keren! 🚀"];

function Stars({ n }) {
  return (
    <div className="big-stars" aria-label={`${n} dari 3 bintang`}>
      {[0, 1, 2].map((i) => <span key={i} className={i < n ? "on" : "off"} style={{ animationDelay: `${i * 0.18}s` }}>⭐</span>)}
    </div>
  );
}

export default function Game({ route }) {
  const session = useSession();
  const [sec, setSec] = useState(route.draw);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(null);
  const [explaining, setExplaining] = useState(false);
  const drag = useRef(null);

  const qs = sec.questions;
  const total = qs.length;
  const q = qs[idx];
  const isChecked = Boolean(checked[q.id]);
  const hasAnswer = answerValue(q, answers[q.id]) !== null;
  const ok = isChecked && isCorrect(q, answers[q.id]);
  const allChecked = qs.every((x) => checked[x.id]);
  const rightCount = qs.filter((x) => checked[x.id] && isCorrect(x, answers[x.id])).length;
  const style = { "--c": route.c, "--cd": route.cd };

  function finish() {
    const attempt = buildAttempt(route, [sec], answers);
    setDone({ ...attempt, stars: levelStars(attempt.nilai), saved: null });
    session.saveAttempt(attempt).then((saved) => setDone((d) => d && { ...d, saved }));
  }

  function primary() {
    if (!isChecked) {
      if (hasAnswer) setChecked((c) => ({ ...c, [q.id]: true }));
      return;
    }
    if (idx < total - 1) setIdx(idx + 1);
    else if (allChecked) finish();
  }

  const goPrev = () => idx > 0 && setIdx(idx - 1);
  const goNext = () => isChecked && idx < total - 1 && setIdx(idx + 1);

  function restart() {
    setSec(route.draw());
    setIdx(0);
    setAnswers({});
    setChecked({});
    setDone(null);
  }

  // Geser dengan jari: kiri = soal berikutnya (kalau sudah diperiksa), kanan = soal sebelumnya
  const onDown = (e) => { drag.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    dx < 0 ? goNext() : goPrev();
  };

  if (done) {
    const passed = done.nilai >= PASS_SCORE;
    return (
      <div className="game" style={style}>
        <div className="finish">
          <p className="date">{route.eyebrow}</p>
          <h1 className="small">{route.title}</h1>
          <Stars n={done.stars} />
          <p className="finish-score">{done.right} dari {done.total} benar</p>
          <p className="finish-msg">
            {done.stars === 3 ? "Sempurna! Semua benar. 🎉"
              : passed ? (route.next ? "Level selesai! Level berikutnya terbuka." : "Level selesai! Hebat.")
              : `Belum dapat bintang. Butuh ${Math.ceil((PASS_SCORE / 100) * done.total)} jawaban benar. Ayo coba lagi!`}
          </p>
          {done.saved === "saved" && <p className="notice good">Tersimpan untuk {session.active?.icon} {session.active?.name}.</p>}
          {done.saved === "no-child" && <p className="notice">Nilai tidak masuk riwayat. <a href="#/orangtua">Buat profil anak</a> supaya tercatat.</p>}
          {done.saved === "failed" && <p className="notice bad">Nilai gagal disimpan. {session.error}</p>}
          <div className="finish-actions">
            {passed && route.next && <a className="btn main" href={route.next}>Level berikutnya →</a>}
            <button type="button" className={passed && route.next ? "ghost" : "main"} onClick={restart}>🔁 Main lagi</button>
            <a className="btn plain" href={route.back}>{route.chapter ? "Pilih level" : "Kembali"}</a>
          </div>
        </div>
      </div>
    );
  }

  const answered = isChecked ? answerValue(q, answers[q.id]) : null;

  return (
    <form className="game" style={style} noValidate onSubmit={(e) => { e.preventDefault(); primary(); }}>
      <header className="game-top">
        <a className="game-close" href={route.back} aria-label="Keluar dari level">✕</a>
        <div className="pipbar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Object.keys(checked).length} aria-label="Kemajuan level">
          {qs.map((x, i) => (
            <i key={x.id} className={`${checked[x.id] ? (isCorrect(x, answers[x.id]) ? "ok" : "no") : ""}${i === idx ? " cur" : ""}`} />
          ))}
        </div>
        <span className="game-count">⭐ {rightCount}</span>
      </header>
      <p className="game-title">{route.heading}{route.chapter ? ` · ${route.chapter.short}` : ""} · Soal {idx + 1} dari {total}</p>

      <div className="viewport" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }}>
        <div className="track" style={{ transform: `translateX(${-idx * 100}%)` }}>
          {qs.map((x, i) => (
            <div className="slide" key={x.id} aria-hidden={i !== idx} inert={i !== idx ? "" : undefined}>
              <ol className="qs solo">
                <Question
                  q={x}
                  marks={sec.marks}
                  value={answers[x.id]}
                  checked={Boolean(checked[x.id])}
                  onChange={(v) => !checked[x.id] && setAnswers((a) => ({ ...a, [x.id]: v }))}
                />
              </ol>
            </div>
          ))}
        </div>
      </div>

      <footer className={`game-bottom${isChecked ? (ok ? " ok" : " no") : ""}`}>
        <p className="verdict" aria-live="polite">
          {!isChecked ? (hasAnswer ? "Sudah yakin? Tekan Periksa." : "Pilih atau tulis jawabanmu.")
            : ok ? CHEERS[idx % CHEERS.length]
            : <>Belum tepat{answered === null ? "" : `, jawabanmu: ${answered}`}. Yang benar: <b>{q.src.a}</b></>}
        </p>
        <div className="btns">
          <button type="button" className="ghost nav" onClick={goPrev} disabled={idx === 0} aria-label="Soal sebelumnya">←</button>
          {isChecked && <button type="button" className={`ghost explain-btn${ok ? "" : " nudge"}`} onClick={() => setExplaining(true)}>💡 Pembahasan</button>}
          <button type="submit" className="main" disabled={!isChecked && !hasAnswer}>
            {!isChecked ? "Periksa" : idx < total - 1 ? "Lanjut →" : "Selesai 🏁"}
          </button>
        </div>
      </footer>
      {explaining && <Explain key={q.id} q={q} onClose={() => setExplaining(false)} />}
    </form>
  );
}
