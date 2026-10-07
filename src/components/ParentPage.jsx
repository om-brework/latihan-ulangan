/* Halaman orang tua: login, profil anak, dan perkembangan belajar */
import { useEffect, useMemo, useState } from "react";
import { useSession, messageFor } from "../lib/session.jsx";
import { questionText, summarize } from "../lib/progress.js";

export const CHILD_ICONS = ["🐯", "🐼", "🦊", "🐰", "🐸", "🦁", "🐨", "🦄"];

const fmtDate = (ms) =>
  new Date(ms).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function AddChildForm({ onDone }) {
  const s = useSession();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(CHILD_ICONS[0]);
  const [busy, setBusy] = useState(false);
  const clean = name.trim().slice(0, 20);

  async function submit(e) {
    e.preventDefault();
    if (!clean || busy) return;
    setBusy(true);
    const child = await s.addChild({ name: clean, icon });
    setBusy(false);
    if (child) { setName(""); onDone?.(child); }
  }

  return (
    <form className="child-form" onSubmit={submit}>
      <label htmlFor="child-name">Nama panggilan anak</label>
      <input id="child-name" type="text" value={name} maxLength={20} autoComplete="off" placeholder="Misalnya: Kadek" onChange={(e) => setName(e.target.value)} />
      <div className="icon-pick" role="radiogroup" aria-label="Pilih gambar">
        {CHILD_ICONS.map((ic) => (
          <button type="button" key={ic} role="radio" aria-checked={ic === icon} className={`icon-btn${ic === icon ? " on" : ""}`} onClick={() => setIcon(ic)}>{ic}</button>
        ))}
      </div>
      <button type="submit" className="main" disabled={!clean || busy}>{busy ? "Menyimpan…" : "Simpan profil"}</button>
    </form>
  );
}

function Progress({ child }) {
  const s = useSession();
  const [attempts, setAttempts] = useState(null);
  const [open, setOpen] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let dead = false;
    setAttempts(null); setErr(null); setOpen(null);
    s.store.listAttempts(child.id)
      .then((list) => { if (!dead) setAttempts(list); })
      .catch((e) => { if (!dead) setErr(messageFor(e)); });
    return () => { dead = true; };
  }, [s.store, child.id]);

  const sum = useMemo(() => summarize(attempts ?? []), [attempts]);

  if (err) return <p className="notice bad">{err}</p>;
  if (!attempts) return <p className="notice">Memuat riwayat…</p>;
  if (!attempts.length) return <p className="notice">{child.name} belum mengerjakan latihan. Nilai akan muncul di sini setelah tombol Periksa jawaban ditekan.</p>;

  return (
    <>
      <section className="panel">
        <h3>Perlu dilatih lagi</h3>
        <p className="panel-note">Diurutkan dari nilai terakhir yang paling rendah.</p>
        <ul className="rows">
          {sum.topics.map((t) => (
            <li key={t.key}>
              <span className={`score ${t.last >= 80 ? "good" : t.last >= 60 ? "mid" : "low"}`}>{t.last}</span>
              <span className="row-body">
                <b>{t.title}</b>
                <small>{t.eyebrow} · {t.count} kali latihan · terbaik {t.best} · rata-rata {t.avg}</small>
              </span>
              <a className="btn ghost small" href={t.key}>Main</a>
            </li>
          ))}
        </ul>
      </section>

      {sum.frequent.length > 0 && (
        <section className="panel">
          <h3>Soal yang sering salah</h3>
          <ul className="rows">
            {sum.frequent.map((w) => (
              <li key={[w.key, w.t, w.c, w.pre, w.post].join("|")}>
                <span className="score low">{w.times}×</span>
                <span className="row-body">
                  <b>{questionText(w)}</b>
                  <small>{w.title} · jawaban terakhir: {w.given ?? "kosong"} · yang benar: {w.a}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel">
        <h3>Riwayat latihan</h3>
        <ul className="rows">
          {attempts.map((a) => (
            <li key={a.id} className="history">
              <button type="button" className="history-head" onClick={() => setOpen(open === a.id ? null : a.id)} aria-expanded={open === a.id}>
                <span className={`score ${a.nilai >= 80 ? "good" : a.nilai >= 60 ? "mid" : "low"}`}>{a.nilai}</span>
                <span className="row-body">
                  <b>{a.title}</b>
                  <small>{a.eyebrow} · {fmtDate(a.at)} · {a.right} dari {a.total} benar</small>
                </span>
                <span aria-hidden="true">{open === a.id ? "▲" : "▼"}</span>
              </button>
              {open === a.id && (
                <div className="history-detail">
                  {a.parts.length > 1 && <p className="chips">{a.parts.map((p) => <span key={p.label}>{p.short} · {p.right}/{p.total}</span>)}</p>}
                  {a.wrong.length === 0 ? <p>Semua jawaban benar.</p> : (
                    <ol>
                      {a.wrong.map((w, i) => (
                        <li key={i}>
                          {questionText(w)}
                          <small>Jawaban anak: {w.given ?? "kosong"} · Yang benar: {w.a}</small>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function ParentPage() {
  const s = useSession();
  const [viewId, setViewId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(null); // id anak, atau "account"
  const view = s.kids.find((k) => k.id === viewId) ?? s.active ?? s.kids[0] ?? null;

  return (
    <div className="wrap parent">
      <header className="head">
        <a className="back" href="#/">← Kembali ke latihan</a>
        <p className="date">Untuk orang tua</p>
        <h1 className="small">Perkembangan anak</h1>
        {!s.ready ? (
          <p className="note">Memeriksa status login…</p>
        ) : s.user ? (
          <p className="note">Login sebagai <b>{s.user.email ?? s.user.name}</b>. Riwayat tersimpan di akun ini dan bisa dilihat dari perangkat lain.</p>
        ) : s.cloudEnabled ? (
          <p className="note">Belum login. Riwayat hanya tersimpan di perangkat ini. Login supaya riwayat aman dan bisa dilihat dari HP lain.</p>
        ) : (
          <p className="note">Riwayat tersimpan di perangkat ini saja.</p>
        )}
        {s.ready && s.cloudEnabled && (
          <div className="head-actions">
            {s.user
              ? <button type="button" className="ghost" onClick={s.signOut}>Keluar</button>
              : <button type="button" className="main" onClick={s.signIn}>Login dengan Google</button>}
          </div>
        )}
        {s.error && <p className="notice bad" role="alert">{s.error}</p>}
      </header>

      <section className="panel">
        <h3>Profil anak</h3>
        {s.kidsLoaded && s.kids.length === 0 && !adding && <p className="panel-note">Belum ada profil. Tambahkan profil supaya nilai latihan disimpan.</p>}
        <div className="kid-list">
          {s.kids.map((k) => (
            <button type="button" key={k.id} className={`kid${view?.id === k.id ? " on" : ""}`} onClick={() => { setViewId(k.id); setConfirm(null); }}>
              <span aria-hidden="true">{k.icon}</span> {k.name}
            </button>
          ))}
          {!adding && <button type="button" className="kid add" onClick={() => setAdding(true)}>+ Tambah anak</button>}
        </div>
        {adding && <AddChildForm onDone={(c) => { setAdding(false); setViewId(c.id); }} />}
        {adding && <button type="button" className="link" onClick={() => setAdding(false)}>Batal</button>}
      </section>

      {view && <Progress key={view.id} child={view} />}

      {(view || s.user) && (
        <section className="panel danger">
          <h3>Hapus data</h3>
          {view && (confirm === view.id ? (
            <p className="confirm">
              Hapus profil {view.name} beserta seluruh riwayatnya? Ini tidak bisa dibatalkan.{" "}
              <button type="button" className="danger-btn" onClick={async () => { await s.removeChild(view.id); setConfirm(null); setViewId(null); }}>Ya, hapus</button>{" "}
              <button type="button" className="link" onClick={() => setConfirm(null)}>Batal</button>
            </p>
          ) : (
            <button type="button" className="link" onClick={() => setConfirm(view.id)}>Hapus profil {view.name} dan riwayatnya</button>
          ))}
          {s.user && (confirm === "account" ? (
            <p className="confirm">
              Hapus akun ini beserta semua profil dan riwayat anak? Ini tidak bisa dibatalkan.{" "}
              <button type="button" className="danger-btn" onClick={async () => { await s.deleteAccount(); setConfirm(null); }}>Ya, hapus akun</button>{" "}
              <button type="button" className="link" onClick={() => setConfirm(null)}>Batal</button>
            </p>
          ) : (
            <button type="button" className="link" onClick={() => setConfirm("account")}>Hapus akun saya dan semua datanya</button>
          ))}
        </section>
      )}

      <p className="foot"><a href="#/privasi">Kebijakan privasi</a></p>
    </div>
  );
}
