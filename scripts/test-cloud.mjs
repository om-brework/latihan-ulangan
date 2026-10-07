// Uji cloudStore dan firestore.rules terhadap emulator Firebase.
import assert from "node:assert/strict";
import { initializeApp } from "firebase/app";
import * as A from "firebase/auth";
import * as F from "firebase/firestore";
import { cloudStore } from "../src/lib/store.js";
import { buildAttempt, summarize } from "../src/lib/progress.js";

function client(name) {
  const app = initializeApp({ apiKey: "demo", projectId: "demo-latihan" }, name);
  const auth = A.getAuth(app); const db = F.getFirestore(app);
  A.connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  F.connectFirestoreEmulator(db, "127.0.0.1", 8080);
  return { auth, db, A, F };
}
const login = (c, sub, email) => A.signInWithCredential(c.auth, A.GoogleAuthProvider.credential(JSON.stringify({ sub, email, email_verified: true })));
const denied = async (p, label) => { await assert.rejects(p, (e) => e.code === "permission-denied", label); console.log("  ditolak (benar):", label); };

const ibu = client("ibu"), ayahLain = client("lain"), tamu = client("tamu");
const u1 = (await login(ibu, "ibu-1", "ibu@example.com")).user;
const u2 = (await login(ayahLain, "lain-2", "lain@example.com")).user;
const s1 = cloudStore(u1.uid, async () => ibu);

// profil + latihan
const kid = await s1.addChild({ name: "Kadek", icon: "🦊" });
const sections = [{ id: "x", label: "Bab 1", short: "Bab 1", questions: [
  { id: "x-1", src: { t: "Hitung hasilnya.", pre: "3 + 4 =", a: "7" }, opts: null },
  { id: "x-2", src: { t: "Lengkapi katanya.", c: "Air dari langit", post: "– jan", a: "hu" }, opts: null }] }];
const route = { key: "#/mtk/mtk-1", eyebrow: "Matematika", title: "Bab 1" };
await s1.saveAttempt(kid.id, buildAttempt(route, sections, { "x-1": "8" }, 1000));
await s1.saveAttempt(kid.id, buildAttempt(route, sections, { "x-1": "7", "x-2": "hu" }, 2000));
const list = await s1.listAttempts(kid.id);
assert.deepEqual(list.map((a) => a.nilai), [100, 0]); // terbaru dulu
assert.equal(summarize(list).topics[0].last, 100);
assert.deepEqual((await s1.listChildren()).map((k) => k.name), ["Kadek"]);
console.log("  pemilik: simpan profil, simpan 2 latihan, baca riwayat OK");

// orang tua lain dan tamu tidak boleh menyentuh data ini
const other = cloudStore(u1.uid, async () => ayahLain), anon = cloudStore(u1.uid, async () => tamu);
await denied(other.listChildren(), "orang tua lain membaca profil");
await denied(other.listAttempts(kid.id), "orang tua lain membaca riwayat");
await denied(other.saveAttempt(kid.id, buildAttempt(route, sections, {}, 3000)), "orang tua lain menulis riwayat");
await denied(other.addChild({ name: "Penyusup", icon: "🐯" }), "orang tua lain menambah profil");
await denied(anon.listChildren(), "tanpa login membaca profil");
await denied(anon.saveAttempt(kid.id, buildAttempt(route, sections, {}, 3000)), "tanpa login menulis riwayat");
// data tidak sah dari pemilik
await denied(s1.addChild({ name: "x".repeat(40), icon: "🦊" }), "nama lebih dari 30 huruf");
await denied(F.addDoc(F.collection(ibu.db, "users", u1.uid, "children"), { name: "A", icon: "🦊", createdAt: 1, sekolah: "SD 1" }), "field di luar daftar");
await denied(F.addDoc(F.collection(ibu.db, "users", u1.uid, "children", kid.id, "attempts"), { nilai: "100", at: 1, wrong: [] }), "nilai bukan angka");
await denied(F.getDocs(F.collectionGroup(ayahLain.db, "attempts")), "membaca riwayat semua orang sekaligus");

// orang tua lain punya ruang sendiri yang terpisah
const s2 = cloudStore(u2.uid, async () => ayahLain);
await s2.addChild({ name: "Budi", icon: "🐼" });
assert.deepEqual((await s2.listChildren()).map((k) => k.name), ["Budi"]);
assert.deepEqual((await s1.listChildren()).map((k) => k.name), ["Kadek"]);
console.log("  dua orang tua: data terpisah OK");

// hapus profil ikut menghapus riwayatnya
await s1.removeChild(kid.id);
assert.equal((await s1.listChildren()).length, 0);
assert.equal((await s1.listAttempts(kid.id)).length, 0);
console.log("  hapus profil beserta riwayat OK");
console.log("SEMUA UJI FIRESTORE LULUS");
process.exit(0);
