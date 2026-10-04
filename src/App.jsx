import { useEffect, useState } from "react";
import { CHAPTER_QUIZ_SIZE, MIXED_QUIZ_SIZE, SPECIAL, SUBJECTS, resolveRoute } from "./data/catalog.js";
import Quiz from "./components/Quiz.jsx";
import Lesson from "./components/Lesson.jsx";
import { LESSONS } from "./lessons/mtk.jsx";

const TOTAL = SUBJECTS.reduce((n, s) => n + s.total, 0) + SPECIAL.total;

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function Card({ href, icon, title, text, meta, c, cd }) {
  return (
    <a className="card" href={href} style={{ "--c": c, "--cd": cd }}>
      <span className="card-icon" aria-hidden="true">{icon}</span>
      <span className="card-body">
        <strong>{title}</strong>
        {text && <span className="card-text">{text}</span>}
        <span className="card-meta">{meta}</span>
      </span>
      <span className="card-go" aria-hidden="true">▶</span>
    </a>
  );
}

function Home() {
  return (
    <div className="wrap">
      <header className="head">
        <p className="mascots" aria-hidden="true">🐯🦎🌧️🍫⭐</p>
        <p className="date">Kelas 1 SD</p>
        <h1>
          <span>Ayo</span> <span>Latihan</span> <span>Ulangan!</span>
        </h1>
        <p className="note">Pilih pelajaran, lalu pilih bab. Ada {TOTAL} soal, dan soalnya selalu diacak.</p>
      </header>

      <section className="group">
        <h2 className="group-title">Ulangan terdekat</h2>
        <Card
          href={`#/${SPECIAL.id}`}
          icon={SPECIAL.icon}
          title={SPECIAL.title}
          text={`${SPECIAL.date}. ${SPECIAL.blurb}.`}
          meta={`${SPECIAL.total} soal`}
          c="#FFD23F"
          cd="#E0A800"
        />
      </section>

      <section className="group">
        <h2 className="group-title">Pilih pelajaran</h2>
        {SUBJECTS.map((s) => (
          <Card
            key={s.id}
            href={`#/${s.id}`}
            icon={s.icon}
            title={s.title}
            text={`${s.blurb}.`}
            meta={`${s.chapters.length} bab · ${s.total} soal`}
            c={s.c}
            cd={s.cd}
          />
        ))}
      </section>
    </div>
  );
}

function SubjectPage({ subject }) {
  return (
    <div className="wrap">
      <header className="head">
        <a className="back" href="#/">← Pilih pelajaran lain</a>
        <p className="mascots" aria-hidden="true">{subject.icon}</p>
        <h1 className="small">{subject.title}</h1>
        <p className="note">
          {subject.chapters.some((ch) => LESSONS[ch.id])
            ? `Tekan Belajar untuk memahami konsepnya, lalu Latihan untuk ${CHAPTER_QUIZ_SIZE} soal acak.`
            : `Pilih bab yang mau dilatih. Tiap bab ${CHAPTER_QUIZ_SIZE} soal acak.`}
        </p>
      </header>

      <section className="group">
        <Card
          href={`#/${subject.id}/semua`}
          icon="🎲"
          title="Campuran semua bab"
          text={`Sekitar ${MIXED_QUIZ_SIZE} soal dari semua bab.`}
          meta={`${subject.total} soal`}
          c="#FFD23F"
          cd="#E0A800"
        />
        {subject.chapters.map((ch) =>
          LESSONS[ch.id] ? (
            <div className="card stack" key={ch.id} style={{ "--c": ch.c, "--cd": ch.cd }}>
              <span className="card-icon" aria-hidden="true">{ch.icon}</span>
              <span className="card-body">
                <strong>{ch.title}</strong>
                <span className="card-text">{ch.hint}</span>
                <span className="card-actions">
                  <a className="btn ghost" href={`#/${subject.id}/${ch.id}/belajar`}>📘 Belajar</a>
                  <a className="btn main" href={`#/${subject.id}/${ch.id}`}>✏️ Latihan</a>
                </span>
              </span>
            </div>
          ) : (
            <Card
              key={ch.id}
              href={`#/${subject.id}/${ch.id}`}
              icon={ch.icon}
              title={ch.title}
              text={ch.hint}
              meta={`${ch.questions.length} soal`}
              c={ch.c}
              cd={ch.cd}
            />
          )
        )}
      </section>
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const route = resolveRoute(hash);
  if (route.page === "quiz") return <Quiz key={hash} route={route} />;
  if (route.page === "lesson" && LESSONS[route.chapter.id]) {
    return <Lesson key={hash} subject={route.subject} chapter={route.chapter} steps={LESSONS[route.chapter.id]} />;
  }
  if (route.page === "lesson") return <SubjectPage subject={route.subject} />;
  if (route.page === "subject") return <SubjectPage subject={route.subject} />;
  return <Home />;
}
