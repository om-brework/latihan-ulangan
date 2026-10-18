/* Penjumlahan bersusun: papan kolom, isian dengan keypad, dan pembahasan per kolom. */
import { useMemo, useState } from "react";
import { PLACE, carryOk, columnPlan, emptyColumn, fillOrder, stepText } from "../lib/column.js";

const SHORT = ["S", "P", "R", "Rb"];

/* Papan bersusun. Kolom ditulis dari kiri ke kanan, jadi indeks kolom dibalik saat ditampilkan.
   box(kind, i) mengembalikan isi dan status satu kotak: { text, state, onPick, label } */
function Board({ plan, box, focus = null }) {
  const order = Array.from({ length: plan.cols }, (_, k) => plan.cols - 1 - k);
  const top = String(plan.x).length, bottom = String(plan.y).length;
  const cell = (kind, i) => {
    const b = box(kind, i);
    if (!b) return <span key={`${kind}${i}`} className="col-gap" />;
    const cls = `col-box ${kind === "c" ? "carry" : "digit"}${b.state ? ` ${b.state}` : ""}`;
    return b.onPick
      ? <button type="button" key={`${kind}${i}`} className={cls} onClick={b.onPick} aria-label={b.label} aria-pressed={b.state === "sel"}>{b.text}</button>
      : <span key={`${kind}${i}`} className={cls} aria-label={b.label}>{b.text}</span>;
  };
  return (
    <div className="col-board" style={{ "--cols": plan.cols }} role="group" aria-label={`${plan.x} ditambah ${plan.y}, bersusun`}>
      <span />
      {order.map((i) => <span key={`h${i}`} className={`col-head${focus === i ? " on" : ""}`} title={PLACE[i]}>{SHORT[i]}</span>)}
      <span />
      {order.map((i) => (i === 0 ? <span key="c0" className="col-gap small" /> : cell("c", i)))}
      <span />
      {order.map((i) => <b key={`x${i}`} className={`col-num${focus === i ? " on" : ""}`}>{i < top ? plan.xs[i] : ""}</b>)}
      <b className="col-num op">+</b>
      {order.map((i) => <b key={`y${i}`} className={`col-num${focus === i ? " on" : ""}`}>{i < bottom ? plan.ys[i] : ""}</b>)}
      <i className="col-line" />
      <span />
      {order.map((i) => cell("d", i))}
    </div>
  );
}

/* Isian soal bersusun: ketuk kotak, lalu ketik angka dengan keypad atau papan ketik. */
export function ColumnInput({ q, value, checked, onChange }) {
  const [x, y] = q.src.col;
  const plan = useMemo(() => columnPlan(x, y), [x, y]);
  const v = value ?? emptyColumn(plan.cols);
  const order = fillOrder(plan.cols);
  const [sel, setSel] = useState("d0");
  const expected = String(q.src.a).padStart(plan.cols, " ").split("").reverse(); // digit per kolom, " " = kosong

  const setBox = (key, ch) => {
    const kind = key[0], i = Number(key.slice(1));
    const next = { d: [...v.d], c: [...v.c] };
    next[kind][i] = ch;
    onChange(next);
  };
  const press = (digit) => {
    if (checked) return;
    setBox(sel, digit);
    const k = order.indexOf(sel);
    if (k < order.length - 1) setSel(order[k + 1]);
  };
  const erase = () => {
    if (checked) return;
    const kind = sel[0], i = Number(sel.slice(1));
    if (v[kind][i] !== "") return setBox(sel, "");
    const k = order.indexOf(sel);
    if (k > 0) { setSel(order[k - 1]); setBox(order[k - 1], ""); }
  };
  const onKey = (e) => {
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); }
    else if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); erase(); }
  };

  const box = (kind, i) => {
    const key = `${kind}${i}`;
    const text = v[kind][i];
    let state = !checked && sel === key ? "sel" : "";
    if (checked) {
      if (kind === "d") state = expected[i] === " " && (text === "" || text === "0") ? "" : text === expected[i] ? "right" : "wrong";
      else state = carryOk(v, plan, i) ? (text && text !== "0" ? "right" : "") : "wrong";
    }
    const label = kind === "c" ? `Simpanan untuk ${PLACE[i]}` : `Hasil ${PLACE[i]}`;
    return { text, state, label: text ? `${label}: ${text}` : label, onPick: checked ? null : () => setSel(key) };
  };

  const focus = Number(sel.slice(1));
  return (
    <div className="col-wrap" onKeyDown={onKey}>
      <Board plan={plan} box={box} focus={checked ? null : focus} />
      {!checked && (
        <div className="col-pad" role="group" aria-label="Papan angka">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((d) => (
            <button type="button" key={d} className="col-key" onClick={() => press(d)}>{d}</button>
          ))}
          <button type="button" className="col-key erase" onClick={erase} aria-label="Hapus">⌫</button>
        </div>
      )}
      {!checked && <p className="col-tip">{tipFor(sel, plan)}</p>}
    </div>
  );
}

function tipFor(sel, plan) {
  const i = Number(sel.slice(1));
  if (sel === "d0") return "Mulai dari satuan. Jumlahkan angka paling kanan.";
  if (sel[0] === "c") return `Ada simpanan untuk ${PLACE[i]}? Tulis 1. Kalau tidak ada, tulis 0 atau ketuk kotak di bawah.`;
  if (i === plan.cols - 1) return `Ada simpanan di atas ${PLACE[i]}? Turunkan ke sini. Kalau tidak ada, biarkan kosong.`;
  return `Jumlahkan ${PLACE[i]}. Jangan lupa simpanan di atasnya.`;
}

/* Pembahasan: buka kolom satu per satu dari kanan */
export function ColumnDemo({ q }) {
  const [x, y] = q.src.col;
  const plan = useMemo(() => columnPlan(x, y), [x, y]);
  const lastCarry = plan.carry[plan.cols - 1];
  const total = plan.n + (lastCarry ? 1 : 0);
  const [k, setK] = useState(0); // jumlah kolom yang sudah dikerjakan
  const done = k >= total;

  const box = (kind, i) => {
    if (kind === "c") {
      const show = plan.carry[i] && i <= k;
      return { text: show ? "1" : "", state: show ? "right pop" : "", label: `Simpanan ${PLACE[i]}` };
    }
    const show = i < k;
    return { text: show ? String(plan.res[i]) : "", state: show ? "right pop" : i === k && !done ? "sel" : "", label: `Hasil ${PLACE[i]}` };
  };

  let say, sub;
  if (k === 0) { say = "Mulai dari kanan"; sub = "Satuan dulu, lalu puluhan, lalu ratusan."; }
  else if (k <= plan.n) { say = stepText(plan.steps[k - 1]); sub = k < total ? "Lanjut ke kolom berikutnya." : null; }
  else { say = `Simpanan 1 turun menjadi angka ${PLACE[plan.cols - 1]}.`; sub = null; }
  if (done) sub = `Jadi ${plan.x} + ${plan.y} = ${plan.result}.`;

  return (
    <div className="stage">
      <div className="pile"><Board plan={plan} box={box} focus={done ? null : Math.min(k, plan.cols - 1)} /></div>
      <div className="say" aria-live="polite"><strong className="col-say">{say}</strong>{sub && <span>{sub}</span>}</div>
      <div className="actions">
        <button type="button" className="chunk" onClick={() => setK(0)} disabled={k === 0}>↺ Ulang</button>
        <button type="button" className="chunk go" onClick={() => setK(k + 1)} disabled={done}>
          {done ? "Selesai ✓" : k === 0 ? "Hitung satuan" : k < plan.n ? `Hitung ${PLACE[k]}` : "Turunkan simpanan"}
        </button>
      </div>
    </div>
  );
}
