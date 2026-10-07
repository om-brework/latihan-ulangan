/* Mengucapkan teks bahasa Inggris dengan fitur baca-teks bawaan perangkat (Web Speech API). */
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
let voice = null;

function pickVoice() {
  if (!synth) return null;
  const voices = synth.getVoices();
  voice =
    voices.find((v) => /^en[-_]US/i.test(v.lang) && /female|samantha|google us/i.test(v.name)) ??
    voices.find((v) => /^en[-_]US/i.test(v.lang)) ??
    voices.find((v) => /^en[-_]GB/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    null;
  return voice;
}
if (synth) {
  pickVoice();
  synth.addEventListener?.("voiceschanged", pickVoice);
}

/* Benar kalau perangkat ini bisa mengucapkan teks */
export const canSpeak = () => Boolean(synth && typeof window.SpeechSynthesisUtterance === "function");

export function speak(text) {
  if (!canSpeak() || !text) return false;
  try {
    synth.cancel();
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.8;
    u.pitch = 1.05;
    const v = voice ?? pickVoice();
    if (v) u.voice = v;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  try { synth?.cancel(); } catch { /* abaikan */ }
}
