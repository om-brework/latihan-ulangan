import { useState } from "react";

export default function Lesson({ subject, chapter, steps }) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;
  const go = (n) => {
    setI(n);
    window.scrollTo(0, 0);
  };

  return (
    <div className="wrap">
      <header className="head">
        <a className="back" href={`#/${subject.id}/${chapter.id}`}>← Kembali ke level</a>
        <p className="date">{subject.title} · Belajar</p>
        <h1 className="small">{chapter.icon} {chapter.title}</h1>
      </header>

      <section className="sheet lesson" style={{ "--c": chapter.c, "--cd": chapter.cd }}>
        <div className="sheet-head">
          <span className="letter" aria-hidden="true">{i + 1}</span>
          <div>
            <h2>{step.title}</h2>
            <p>Langkah {i + 1} dari {steps.length}</p>
          </div>
        </div>
        <div className="lesson-body">
          {step.text.map((t) => <p className="lesson-text" key={t}>{t}</p>)}
          {/* key: alat peraga dimulai dari awal di tiap langkah */}
          <div key={i}>{step.widget}</div>
          <p className="coba"><b>Coba:</b> {step.coba}</p>
        </div>
      </section>

      <div className="bar">
        <p>
          <span className="pips" aria-hidden="true">
            {steps.map((s, k) => <i key={s.title} className={k === i ? "on" : k < i ? "done" : ""} />)}
          </span>
        </p>
        <div className="btns">
          <button type="button" className="ghost" onClick={() => go(i - 1)} disabled={i === 0}>← Kembali</button>
          {last ? (
            <a className="btn main" href={`#/${subject.id}/${chapter.id}`}>🎮 Main level</a>
          ) : (
            <button type="button" className="main" onClick={() => go(i + 1)}>Lanjut →</button>
          )}
        </div>
      </div>
    </div>
  );
}
