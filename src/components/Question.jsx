import { isCorrect } from "../lib/grade.js";

export default function Question({ q, marks, value, checked, onChange }) {
  const { src } = q;
  const ok = checked && isCorrect(q, value);

  return (
    <li className="q" id={`row-${q.id}`}>
      <div className="q-text">
        <span className="num">{q.no}</span>
        <span>
          {src.t}
          {src.c && <span className="clue">{src.c}</span>}
        </span>
      </div>

      {q.opts ? (
        <div className={`opts${marks ? " marks" : ""}`} role="radiogroup" aria-label="Pilihan jawaban">
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
        <div className="fill">
          {src.pre && <span>{src.pre}</span>}
          <input
            type="text"
            id={`q-${q.id}`}
            aria-label="Jawaban"
            className={[src.wide ? "wide" : "", checked ? (ok ? "right" : "wrong") : ""].join(" ").trim()}
            maxLength={src.wide ? 10 : 4}
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
