import { useEffect, useState } from "react";
import { Icon } from "../icons";

export function useWide() {
  const q = "(min-width: 900px)";
  const [wide, setWide] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

// Runs an async loader and keeps its state; reload() runs it again.
export function useAsync(fn, deps) {
  const [s, set] = useState({ loading: true, data: null, error: null });
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    set((x) => ({ ...x, loading: true, error: null }));
    fn().then((data) => live && set({ loading: false, data, error: null })).catch((error) => live && set({ loading: false, data: null, error }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n]);
  return { ...s, reload: () => setN((x) => x + 1) };
}

export const Head = ({ eyebrow, title, right }) => (
  <div className="head">
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="title">{title}</h1>
    </div>
    {right}
  </div>
);

export const Chips = ({ items, value, onChange }) => (
  <div className="chips">
    {items.map((x) => (
      <button key={x} className="chip" aria-pressed={value === x} onClick={() => onChange(x)}>{x}</button>
    ))}
  </div>
);

export const Search = ({ value, onChange, placeholder }) => (
  <label className="search">
    <Icon name="search" />
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} autoCapitalize="off" autoCorrect="off" />
  </label>
);

export function Sheet({ onClose, children }) {
  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button onClick={onClose} aria-label="Close" style={{ color: "var(--mute)", padding: 6 }}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Back = ({ onClick, label }) => (
  <button className="back" onClick={onClick}><Icon name="back" size={20} />{label}</button>
);

export function State({ loading, error, empty, onRetry, children, emptyText = "Nothing here yet." }) {
  if (loading) return <div className="empty">Loading…</div>;
  if (error) return (
    <div className="empty">
      Can't load this right now. Check your connection.
      <div style={{ marginTop: 12 }}><button className="btn ghost" onClick={onRetry}><Icon name="refresh" size={18} />Try again</button></div>
    </div>
  );
  if (empty) return <div className="empty">{emptyText}</div>;
  return children;
}

export const fmtDay = (iso) => {
  const d = new Date(iso);
  return { dow: d.toLocaleDateString([], { weekday: "short" }).toUpperCase(), day: d.getDate(), time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
};
