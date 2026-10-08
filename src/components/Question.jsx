import { isCorrect } from "../lib/grade.js";
import { canSpeak, speak } from "../lib/speak.js";

/* Tombol dengar untuk soal menyimak. Tanpa fitur suara, teksnya ditampilkan sebagai tulisan. */
export function Listen({ text, big = false }) {
  if (!canSpeak()) return <span className="say-text">“{text}”</span>;
  return (
    <button type="button" className={`listen${big ? " big" : ""}`} onClick={() => speak(text)} aria-label="Dengarkan">
      <span aria-hidden="true">🔊</span> Dengarkan
    </button>
  );
}

const isPicture = (o) => !/[a-z0-9]/i.test(o.replace(/[\u{1F1E6}-\u{1F1FF}]|️|⃣/gu, "").replace(/[0-9#*]/g, ""));

export default function Question({ q, marks, value, checked, onChange }) {
  const { src } = q;
  const ok = checked && isCorrect(q, value);
  const pictures = Boolean(q.opts) && q.opts.every(isPicture);
  // Soal hitungan murni (12 + 5 = __, 21, 22, __) ditampilkan besar di tengah
  const math = !q.opts && Boolean(src.pre || src.post) && /^[\d\s,+–=-]*$/.test(`${src.pre ?? ""}${src.post ?? ""}`);

  return (
    <li className="q" id={`row-${q.id}`}>
      <div className="q-text">
        <span className="num">{q.no}</span>
        <span>
          {src.t}
          {src.c && src.c.split(" | ").map((line) => <span className="clue" key={line}>{line}</span>)}
        </span>
      </div>

      {src.say && <Listen text={src.say} big />}

      {q.opts ? (
        <div className={`opts${marks || pictures ? " marks" : ""}${pictures ? " pictures" : ""}`} role="radiogroup" aria-label="Pilihan jawaban">
          {q.opts.map((o, k) => {
            const state = !checked ? "" : o === src.a ? " right" : value === o ? " wrong" : "";
            return (
              <label className={`opt${state}`} key={o}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  id={`q-${q.id}-${k}`}
                  checked={value === o}
                  disabled={checked}
                  onChange={() => onChange(o)}
                  aria-label={marks ? (o === "?" ? "tanda tanya" : "tanda seru") : undefined}
                />
                <span>{o}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className={`fill${math ? " math" : ""}`}>
          {src.pre && <span>{src.pre}</span>}
          <input
            type="text"
            id={`q-${q.id}`}
            aria-label="Jawaban"
            className={[src.wide ? "wide" : "", checked ? (ok ? "right" : "wrong") : ""].join(" ").trim()}
            maxLength={src.wide ? 12 : 4}
            inputMode={/^[0-9]+$/.test(src.a) ? "numeric" : "text"}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={value ?? ""}
            readOnly={checked}
            onChange={(e) => onChange(e.target.value)}
          />
          {src.post && <span>{src.post}</span>}
        </div>
      )}

      {checked && (
        <p className={`fb ${ok ? "right" : "wrong"}`}>
          {ok ? "✓ Benar" : `✗ Jawaban yang benar: ${src.a}`}
        </p>
      )}
    </li>
  );
}
