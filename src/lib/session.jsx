/* Sesi: orang tua yang login, daftar profil anak, anak yang sedang aktif, dan riwayatnya. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cloudEnabled, getCloud } from "./firebase.js";
import { cloudStore, localStore } from "./store.js";

const Ctx = createContext(null);
export const useSession = () => useContext(Ctx);

const ACTIVE_KEY = "latihan-ulangan.active";
const bestKey = (childId) => `latihan-ulangan.best.${childId ?? "tamu"}`;
const readBest = (childId) => {
  try { return JSON.parse(localStorage.getItem(bestKey(childId)) ?? "{}") ?? {}; } catch { return {}; }
};
const readActive = () => {
  try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
};

export function messageFor(err) {
  const code = err?.code ?? "";
  if (code.includes("popup-closed") || code.includes("cancelled-popup")) return "Login dibatalkan.";
  if (code.includes("popup-blocked")) return "Jendela login diblokir browser. Izinkan pop-up untuk situs ini, lalu coba lagi.";
  if (code.includes("unauthorized-domain")) return "Alamat situs ini belum didaftarkan di Firebase (Authentication > Settings > Authorized domains).";
  if (code.includes("requires-recent-login")) return "Demi keamanan, keluar lalu login lagi, kemudian ulangi.";
  if (code.includes("permission-denied")) return "Tidak diizinkan. Coba login ulang.";
  if (code.includes("unavailable") || code.includes("network")) return "Tidak ada sambungan internet. Coba lagi nanti.";
  return err?.message ?? "Terjadi kesalahan. Coba lagi.";
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!cloudEnabled);
  const [kids, setKids] = useState([]);
  const [kidsLoaded, setKidsLoaded] = useState(false);
  const [activeId, setActiveId] = useState(readActive);
  const [attempts, setAttempts] = useState([]);
  const [bestCache, setBestCache] = useState({});
  const [error, setError] = useState(null);

  const store = useMemo(() => (user ? cloudStore(user.uid) : localStore), [user]);

  // Pantau status login
  useEffect(() => {
    if (!cloudEnabled) return undefined;
    let stop, dead = false;
    getCloud()
      .then((c) => {
        if (dead) return;
        stop = c.A.onAuthStateChanged(c.auth, (u) => {
          setUser(u ? { uid: u.uid, name: u.displayName, email: u.email } : null);
          setReady(true);
        });
      })
      .catch((e) => { setError(messageFor(e)); setReady(true); });
    return () => { dead = true; stop?.(); };
  }, []);

  // Muat profil anak tiap kali tempat penyimpanan berganti (login/keluar)
  useEffect(() => {
    if (!ready) return undefined;
    let dead = false;
    setKidsLoaded(false);
    store.listChildren()
      .then((list) => { if (!dead) { setKids(list); setKidsLoaded(true); } })
      .catch((e) => { if (!dead) { setKids([]); setKidsLoaded(true); setError(messageFor(e)); } });
    return () => { dead = true; };
  }, [store, ready]);

  const active = kids.find((k) => k.id === activeId) ?? (kids.length === 1 ? kids[0] : null);

  // Muat riwayat anak yang aktif
  useEffect(() => {
    if (!active) { setAttempts([]); return undefined; }
    let dead = false;
    store.listAttempts(active.id)
      .then((list) => { if (!dead) setAttempts(list); })
      .catch((e) => { if (!dead) setError(messageFor(e)); });
    return () => { dead = true; };
  }, [store, active?.id]);

  // Nilai terbaik tiap level: gabungan riwayat dan cadangan di perangkat (dipakai juga tanpa profil)
  useEffect(() => { setBestCache(readBest(active?.id)); }, [active?.id]);
  const bests = useMemo(() => {
    const out = { ...bestCache };
    for (const a of attempts) out[a.key] = Math.max(out[a.key] ?? 0, a.nilai);
    return out;
  }, [bestCache, attempts]);

  const chooseChild = useCallback((id) => {
    setActiveId(id);
    try { id ? localStorage.setItem(ACTIVE_KEY, id) : localStorage.removeItem(ACTIVE_KEY); } catch { /* abaikan */ }
  }, []);

  const api = useMemo(() => ({
    cloudEnabled, ready, user, kids, kidsLoaded, active, attempts, bests, error, store,
    clearError: () => setError(null),
    chooseChild,
    async signIn() {
      setError(null);
      try {
        const c = await getCloud();
        await c.A.signInWithPopup(c.auth, new c.A.GoogleAuthProvider());
      } catch (e) { setError(messageFor(e)); }
    },
    async signOut() {
      const c = await getCloud();
      await c.A.signOut(c.auth);
    },
    async addChild(data) {
      setError(null);
      try {
        const child = await store.addChild(data);
        setKids((list) => [...list, child]);
        chooseChild(child.id);
        return child;
      } catch (e) { setError(messageFor(e)); return null; }
    },
    async removeChild(id) {
      setError(null);
      try {
        await store.removeChild(id);
        setKids((list) => list.filter((k) => k.id !== id));
        if (activeId === id) chooseChild(null);
        return true;
      } catch (e) { setError(messageFor(e)); return false; }
    },
    /* Simpan satu latihan untuk anak yang aktif. Mengembalikan "saved", "no-child", atau "failed". */
    async saveAttempt(attempt) {
      setBestCache((cache) => {
        const next = { ...cache, [attempt.key]: Math.max(cache[attempt.key] ?? 0, attempt.nilai) };
        try { localStorage.setItem(bestKey(active?.id), JSON.stringify(next)); } catch { /* abaikan */ }
        return next;
      });
      if (!active) return "no-child";
      try {
        const saved = await store.saveAttempt(active.id, attempt);
        setAttempts((list) => [saved, ...list]);
        return "saved";
      } catch (e) { setError(messageFor(e)); return "failed"; }
    },
    /* Hapus semua data orang tua ini di server, lalu hapus akunnya */
    async deleteAccount() {
      setError(null);
      try {
        const c = await getCloud();
        for (const k of await store.listChildren()) await store.removeChild(k.id);
        await c.A.deleteUser(c.auth.currentUser);
        chooseChild(null);
        return true;
      } catch (e) { setError(messageFor(e)); return false; }
    },
  }), [ready, user, kids, kidsLoaded, active, attempts, bests, error, store, activeId, chooseChild]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
