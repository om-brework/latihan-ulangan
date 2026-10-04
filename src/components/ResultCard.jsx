import { forwardRef } from "react";
import { messageFor, starsFor } from "../lib/grade.js";

const ResultCard = forwardRef(function ResultCard({ score, total, sections }, ref) {
  const stars = starsFor(score.nilai);
  return (
    <section className="result" ref={ref} aria-live="polite">
      <div className="nilai">
        <small>Nilai</small>
        <span>{score.nilai}</span>
      </div>
      <div className="result-text">
        <div className="stars" aria-label={`${stars} dari 5 bintang`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={i < stars ? undefined : "off"}>⭐</span>
          ))}
        </div>
        <strong>{messageFor(score.nilai)}</strong>
        <p>{score.right} dari {total} soal benar</p>
        <ul className="per">
          {sections.map((s) => (
            <li key={s.id}>{s.id} · {score.per[s.id][0]}/{score.per[s.id][1]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default ResultCard;
