import { Fragment, useEffect, useState } from "react";
import { LEVEL_SIZE, MIXED_SIZE, PASS_SCORE, SPECIAL, SUBJECTS, ALL_SUBJECTS, chapterProgress, resolveRoute } from "./data/catalog.js";
import Game from "./components/Game.jsx";
import Lesson from "./components/Lesson.jsx";
import { LESSONS } from "./lessons/index.js";
import ParentPage from "./components/ParentPage.jsx";
import PrivacyPage from "./components/PrivacyPage.jsx";
import { useSession } from "./lib/session.jsx";

const TOTAL = ALL_SUBJECTS.reduce((n, s) => n + s.total, 0);

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

function ProfileBar() {
  const s = useSession();
  if (!s.ready || !s.kidsLoaded) return null;
  return (
    <section className="profile-bar">
      {s.kids.length === 0 ? (
        <p>Mau menyimpan nilai dan melihat perkembangan anak? <a href="#/orangtua">Buat profil anak</a></p>
      ) : (
        <>
          <b>Siapa yang main?</b>
          <div className="kid-list">
            {s.kids.map((k) => (
              <button type="button" key={k.id} className={`kid${s.active?.id === k.id ? " on" : ""}`} aria-pressed={s.active?.id === k.id} onClick={() => s.chooseChild(k.id)}>
                <span aria-hidden="true">{k.icon}</span> {k.name}
              </button>
            ))}
          </div>
        </>
      )}
      <a className="parent-link" href="#/orangtua">👨‍👩‍👧 Orang tua: lihat perkembangan</a>
    </section>
  );
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

function subjectStars(subject, bests) {
  let stars = 0, max = 0;
  for (const ch of subject.chapters) {
    const p = chapterProgress(subject, ch, bests);
    stars += p.stars;
    max += p.maxStars;
  }
  return `⭐ ${stars} dari ${max}`;
}

function Home() {
  const s = useSession();
  return (
    <div className="wrap">
      <header className="head">
        <p className="mascots" aria-hidden="true">🐯🦎🌧️🍫⭐</p>
        <p className="date">Kelas 1 SD</p>
        <h1>
          <span>Ayo</span> <span>Main</span> <span>dan Belajar!</span>
        </h1>
        <p className="note">Pilih pelajaran, pilih bab, lalu selesaikan levelnya satu per satu. Kumpulkan bintang dari {TOTAL} soal.</p>
      </header>

      <ProfileBar />

      <section className="group">
        <h2 className="group-title">Pilih pelajaran</h2>
        {SUBJECTS.map((sub) => (
          <Card
            key={sub.id}
            href={`#/${sub.id}`}
            icon={sub.icon}
            title={sub.title}
            text={`${sub.blurb}.`}
            meta={`${sub.chapters.length} bab · ${subjectStars(sub, s.bests)}`}
            c={sub.c}
            cd={sub.cd}
          />
        ))}
      </section>

      <section className="group">
        <h2 className="group-title">Paket ulangan</h2>
        <Card
          href={`#/${SPECIAL.id}`}
          icon={SPECIAL.icon}
          title={SPECIAL.title}
          text={`${SPECIAL.blurb}.`}
          meta={`${SPECIAL.chapters.length} materi · ${subjectStars(SPECIAL, s.bests)}`}
          c={SPECIAL.c}
          cd={SPECIAL.cd}
        />
      </section>

      <p className="foot"><a href="#/privasi">Kebijakan privasi</a></p>
    </div>
  );
}

function SubjectPage({ subject }) {
  const s = useSession();
  return (
    <div className="wrap">
      <header className="head">
        <a className="back" href="#/">← Pilih pelajaran lain</a>
        <p className="mascots" aria-hidden="true">{subject.icon}</p>
        <h1 className="small">{subject.title}</h1>
        <p className="note">Pilih bab. Tiap bab punya beberapa level berisi sekitar {LEVEL_SIZE} soal.</p>
      </header>

      <section className="group">
        {subject.chapters.map((ch) => {
          const p = chapterProgress(subject, ch, s.bests);
          return (
            <Card
              key={ch.id}
              href={`#/${subject.id}/${ch.id}`}
              icon={ch.icon}
              title={ch.title}
              text={ch.hint}
              meta={`Level ${p.cleared} dari ${p.levels.length} selesai · ⭐ ${p.stars}/${p.maxStars}`}
              c={ch.c}
              cd={ch.cd}
            />
          );
        })}
        <Card
          href={`#/${subject.id}/semua`}
          icon="🎲"
          title="Tantangan campuran"
          text={`${MIXED_SIZE} soal acak dari semua bab.`}
          meta="Selalu terbuka"
          c="#FFD23F"
          cd="#E0A800"
        />
      </section>
    </div>
  );
}

function ChapterPage({ subject, chapter }) {
  const s = useSession();
  const p = chapterProgress(subject, chapter, s.bests);
  const current = p.levels.find((l) => l.open && l.stars === 0) ?? null;
  return (
    <div className="wrap" style={{ "--c": chapter.c, "--cd": chapter.cd }}>
      <header className="head">
        <a className="back" href={`#/${subject.id}`}>← Pilih bab lain</a>
        <p className="date">{subject.title}</p>
        <h1 className="small">{chapter.icon} {chapter.title}</h1>
        <p className="note">{chapter.hint}</p>
        <p className="star-total">⭐ {p.stars} dari {p.maxStars} bintang</p>
        {LESSONS[chapter.id] && <a className="btn ghost" href={`#/${subject.id}/${chapter.id}/belajar`}>📘 Belajar dulu</a>}
      </header>

      <ol className="level-map">
        {p.levels.map((lv) => {
          const inner = (
            <>
              <span className="level-num">{lv.open ? (lv.hard ? "🔥" : lv.n) : "🔒"}</span>
              <span className="level-name">Level {lv.n}</span>
              <span className="level-stars" aria-label={lv.open ? `${lv.stars} dari 3 bintang` : "Terkunci"}>
                {[0, 1, 2].map((i) => <span key={i} className={i < lv.stars ? "on" : "off"}>⭐</span>)}
              </span>
            </>
          );
          return (
            <Fragment key={lv.n}>
              {lv.hard && !p.levels[lv.n - 2]?.hard && (
                <li className="level-sep"><b>🔥 Level tantangan</b><span>Soal yang lebih sulit untuk mengasah logika.</span></li>
              )}
              <li>
                {lv.open
                  ? <a className={`level${lv.hard ? " hard" : ""}${current?.n === lv.n ? " now" : ""}${lv.stars ? " cleared" : ""}`} href={lv.key}>{inner}</a>
                  : <span className={`level locked${lv.hard ? " hard" : ""}`} aria-disabled="true">{inner}</span>}
              </li>
            </Fragment>
          );
        })}
      </ol>
      <p className="level-hint">Dapatkan minimal 1 bintang (nilai {PASS_SCORE}) untuk membuka level berikutnya.</p>
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const s = useSession();
  const route = resolveRoute(hash);
  if (route.page === "parent") return <ParentPage />;
  if (route.page === "privacy") return <PrivacyPage />;
  if (route.page === "lesson" && LESSONS[route.chapter.id]) {
    return <Lesson key={hash} subject={route.subject} chapter={route.chapter} steps={LESSONS[route.chapter.id]} />;
  }
  if (route.page === "game") {
    // Level yang masih terkunci dikembalikan ke peta level
    const locked = route.prev && (s.bests[route.prev] ?? 0) < PASS_SCORE;
    if (!locked) return <Game key={hash} route={route} />;
    return <ChapterPage subject={route.subject} chapter={route.chapter} />;
  }
  if (route.page === "chapter" || route.page === "lesson") return <ChapterPage subject={route.subject} chapter={route.chapter} />;
  if (route.page === "subject") return <SubjectPage subject={route.subject} />;
  return <Home />;
}
