/* Firebase dimuat hanya kalau konfigurasinya ada (lihat .env.example).
   Tanpa konfigurasi, aplikasi tetap jalan dan riwayat disimpan di perangkat. */
const env = import.meta.env ?? {};

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const cloudEnabled = Boolean(config.apiKey && config.projectId);

let cloud;
export function getCloud() {
  cloud ??= (async () => {
    const [{ initializeApp }, A, F] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
      import("firebase/firestore"),
    ]);
    const app = initializeApp(config);
    return { auth: A.getAuth(app), db: F.getFirestore(app), A, F };
  })();
  return cloud;
}
