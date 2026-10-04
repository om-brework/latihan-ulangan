import { useEffect, useMemo, useRef, useState } from "react";
import { PER_SECTION, SECTION_INFO, buildPool } from "./data/bank.js";
import { pick, shuffle } from "./lib/random.js";
import { answerValue, isCorrect, toNilai } from "./lib/grade.js";
import Question from "./components/Question.jsx";
import ResultCard from "./components/ResultCard.jsx";

const POOL = buildPool();
const POOL_SIZE = Object.values(POOL).reduce((n, qs) => n + qs.length, 0);

/* Susun satu set ulangan: PER_SECTION soal acak per materi */
function drawQuiz() {
  return SECTION_INFO.map((sec) => ({
    ...sec,
    questions: pick(POOL[sec.id], PER_SECTION).map((src, i) => ({
      id: `${sec.id}${i + 1}`,
      no: i + 1,
      sec: sec.id,
      src,
      opts: src.o ? (src.keep ? src.o : shuffle(src.o)) : null,
    })),
  }));
}

export default function App() {
  const [quiz, setQuiz] = useState(drawQuiz);
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
    setQuiz(drawQuiz());
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
        <p className="mascots" aria-hidden="true">🐯🦎🌧️🍫⭐</p>
        <p className="date">Ulangan Senin, 5 Oktober 2026</p>
        <h1>
          <span>Latihan</span> <span>Ulangan</span> <span>Bahasa</span> <span>Indonesia</span>
        </h1>
        <p className="note">
          {total} soal acak dari bank {POOL_SIZE} soal, {PER_SECTION} soal tiap materi. Jawab semuanya, lalu tekan{" "}
          <b>Periksa jawaban</b>. Tekan <b>Soal baru</b> atau muat ulang halaman untuk soal yang berbeda. Bagian A
          sebaiknya dibacakan oleh ayah atau ibu.
        </p>
      </header>

      {score && <ResultCard ref={resultRef} score={score} total={total} sections={quiz} />}

      <form id="quiz" noValidate onSubmit={(e) => e.preventDefault()}>
        {quiz.map((sec) => (
          <section className="sheet" key={sec.id} style={{ "--c": sec.c, "--cd": sec.cd }}>
            <div className="sheet-head">
              <span className="letter" aria-hidden="true">{sec.icon}</span>
              <div>
                <h2>{sec.id}. {sec.title}</h2>
                <p>{sec.hint}</p>
              </div>
            </div>
            <ol className="qs">
              {sec.questions.map((q) => (
                <Question
                  key={q.id + q.src.t + (q.src.c ?? "")}
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
