/* Bunyi pendek untuk jawaban benar dan salah, dibuat langsung di browser (tanpa file suara). */
const KEY = "latihan-ulangan.sound";
let ctx;

export function soundEnabled() {
  try { return localStorage.getItem(KEY) !== "off"; } catch { return true; }
}

export function setSoundEnabled(on) {
  try { localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* abaikan */ }
}

export function playResult(ok) {
  if (!soundEnabled()) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") ctx.resume();
    // benar: tiga nada naik; salah: dua nada rendah yang lembut
    const notes = ok ? [523.25, 659.25, 783.99] : [246.94, 196];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.11;
      osc.type = ok ? "triangle" : "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(ok ? 0.2 : 0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  } catch { /* bunyi tidak wajib */ }
}
