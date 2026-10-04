import { useEffect, useMemo, useRef, useState } from "react";
import { answerValue, isCorrect, toNilai } from "../lib/grade.js";
import Question from "./Question.jsx";
import ResultCard from "./ResultCard.jsx";

export default function Quiz({ route }) {
  const [quiz, setQuiz] = useState(route.draw);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [warned, setWarned] = useState(false);
  const resultRef = useRef(null);

  const all = useMemo(() => quiz.flatMap((s) => s.questions), [quiz]);
  const total = all.length;
  const empty = all.filter((q) => answerValue(q, answers[q.id]) === null);

  const score = useMemo(() => {
    if (!checked) return null;
    const per = {};
    let right = 0;
    for (const q of all) {
      per[q.sec] ??= [0, 0];
      per[q.sec][1]++;
      if (isCorrect(q, answers[q.id])) {
        per[q.sec][0]++;
        right++;
      }
    }
    return { right, per, nilai: toNilai(right, total) };
  }, [checked, all, answers, total]);

  useEffect(() => {
    if (checked) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [checked]);

  function setAnswer(id, value) {
    if (checked) return;
    setAnswers((a) => ({ ...a, [id]: value }));
    setWarned(false);
  }

  function check() {
    if (checked) return;
    if (empty.length && !warned) {
      setWarned(true);
      document.getElementById(`row-${empty[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setChecked(true);
  }

  function fresh() {
    setQuiz(route.draw());
    setAnswers({});
    setChecked(false);
    setWarned(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progress = score
    ? `Nilai ${score.nilai} · ${score.right} dari ${total} benar`
    : warned
      ? `Masih ada ${empty.length} soal kosong. Tekan Periksa jawaban lagi untuk tetap memeriksa.`
      : `Terjawab ${total - empty.length} dari ${total}`;

  return (
    <div className="wrap">
      <header className="head">
        <a className="back" href={route.back}>← Pilih materi lain</a>
        <p className="date">{route.eyebrow}</p>
        <h1 className="small">{route.title}</h1>
        <p className="note">
          {total} soal acak dari {route.pool} soal. Jawab semuanya, lalu tekan <b>Periksa jawaban</b>. Tekan{" "}
          <b>Soal baru</b> untuk soal yang berbeda.
          {route.parentNote && " Bagian A sebaiknya dibacakan oleh ayah atau ibu."}
        </p>
      </header>

      {score && <ResultCard ref={resultRef} score={score} total={total} sections={quiz} />}

      <form id="quiz" noValidate onSubmit={(e) => e.preventDefault()}>
        {quiz.map((sec) => (
          <section className="sheet" key={sec.id} style={{ "--c": sec.c, "--cd": sec.cd }}>
            <div className="sheet-head">
              <span className="letter" aria-hidden="true">{sec.icon}</span>
              <div>
                <h2>{sec.label}</h2>
                <p>{sec.hint}</p>
              </div>
            </div>
            <ol className="qs">
              {sec.questions.map((q) => (
                <Question
                  key={[q.id, q.src.t, q.src.c, q.src.pre, q.src.post].join("|")}
                  q={q}
                  marks={sec.marks}
                  value={answers[q.id]}
                  checked={checked}
                  onChange={(v) => setAnswer(q.id, v)}
                />
              ))}
            </ol>
          </section>
        ))}
      </form>

      <div className="bar">
        <p className={warned && !checked ? "warn" : undefined}>{progress}</p>
        <div className="btns">
          <button type="button" className="ghost" onClick={fresh}>🎲 Soal baru</button>
          <button type="button" className="main" onClick={check}>✅ Periksa jawaban</button>
        </div>
      </div>
    </div>
  );
}
