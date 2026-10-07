/* Penyimpanan profil anak dan riwayat latihan.
   Dua tempat dengan antarmuka yang sama:
   - localStore: di perangkat ini (tanpa login)
   - cloudStore(uid): Firestore, di bawah users/{uid}/children/{childId}/attempts/{attemptId} */
import { getCloud } from "./firebase.js";

export const MAX_ATTEMPTS = 200;
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ---------- Di perangkat ---------- */
const KEY = "latihan-ulangan.v1";

function readLocal() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (data && Array.isArray(data.children) && data.attempts) return data;
  } catch { /* penyimpanan tidak tersedia atau rusak */ }
  return { children: [], attempts: {} };
}
function writeLocal(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export const localStore = {
  kind: "local",
  async listChildren() {
    return readLocal().children;
  },
  async addChild({ name, icon }) {
    const data = readLocal();
    const child = { id: newId(), name, icon, createdAt: Date.now() };
    data.children.push(child);
    if (!writeLocal(data)) throw new Error("Penyimpanan di perangkat ini tidak tersedia.");
    return child;
  },
  async removeChild(childId) {
    const data = readLocal();
    data.children = data.children.filter((c) => c.id !== childId);
    delete data.attempts[childId];
    writeLocal(data);
  },
  async saveAttempt(childId, attempt) {
    const data = readLocal();
    const saved = { ...attempt, id: newId() };
    data.attempts[childId] = [saved, ...(data.attempts[childId] ?? [])].slice(0, MAX_ATTEMPTS);
    if (!writeLocal(data)) throw new Error("Penyimpanan di perangkat ini tidak tersedia.");
    return saved;
  },
  async listAttempts(childId) {
    return readLocal().attempts[childId] ?? [];
  },
};

/* ---------- Firestore ---------- */
export function cloudStore(uid, load = getCloud) {
  const kids = (c) => c.F.collection(c.db, "users", uid, "children");
  const attempts = (c, childId) => c.F.collection(c.db, "users", uid, "children", childId, "attempts");
  return {
    kind: "cloud",
    async listChildren() {
      const c = await load();
      const snap = await c.F.getDocs(c.F.query(kids(c), c.F.orderBy("createdAt")));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    async addChild({ name, icon }) {
      const c = await load();
      const child = { name, icon, createdAt: Date.now() };
      const ref = await c.F.addDoc(kids(c), child);
      return { id: ref.id, ...child };
    },
    async removeChild(childId) {
      const c = await load();
      for (;;) {
        const snap = await c.F.getDocs(c.F.query(attempts(c, childId), c.F.limit(400)));
        if (snap.empty) break;
        const batch = c.F.writeBatch(c.db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
      await c.F.deleteDoc(c.F.doc(kids(c), childId));
    },
    async saveAttempt(childId, attempt) {
      const c = await load();
      const ref = await c.F.addDoc(attempts(c, childId), attempt);
      return { ...attempt, id: ref.id };
    },
    async listAttempts(childId) {
      const c = await load();
      const snap = await c.F.getDocs(c.F.query(attempts(c, childId), c.F.orderBy("at", "desc"), c.F.limit(MAX_ATTEMPTS)));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  };
}
