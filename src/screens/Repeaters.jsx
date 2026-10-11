import { useEffect, useState } from "react";
import { getRepeaters, openOnSite } from "../lib/api";
import { Head, Chips, Search, Sheet, State, useAsync, useWide } from "../components/ui";
import { Icon } from "../icons";

const fmtF = (n) => (n == null || n === "" ? "—" : Number(n).toFixed(3));
const fmtOff = (n) => (!n ? "Simplex" : `${n > 0 ? "+" : "−"}${Math.abs(n)} MHz`);
const dotClass = (s) => (s === "Online" ? "" : s === "Offline" ? "off" : "busy");

function Detail({ r }) {
  return (
    <div>
      <div className="eyebrow">{r.mode || "Repeater"}{r.access ? ` · ${r.access}` : ""}</div>
      <div className="row" style={{ alignItems: "baseline" }}>
        <h1 className="title" style={{ margin: "2px 0 0" }}>{r.callsign}</h1>
        {r.status && <><span className={"dot " + dotClass(r.status)} /><span className="mute">{r.status}</span></>}
      </div>
      <div className="mute">{r.name}</div>
      <div className="freq" style={{ fontSize: 34, margin: "14px 0 0" }}>{fmtF(r.frequency)} <span className="mute" style={{ fontSize: 16 }}>MHz</span></div>
      <div className="stat">
        <div><b>{fmtOff(r.offset)}</b><span>Offset</span></div>
        <div><b>{r.tone || "None"}</b><span>Tone</span></div>
        <div><b>{r.input_tone || "None"}</b><span>Input tone</span></div>
      </div>
      {r.verification && <div style={{ marginBottom: 12 }}><span className={"tag " + (r.verification === "Verified" ? "g" : "")}>{r.verification}</span></div>}
      {r.notes && <p className="mute" style={{ margin: "0 0 16px" }}>{r.notes}</p>}
      <div className="row wrap">
        {r.lat != null && r.lng != null && (
          <button className="btn" onClick={() => openOnSite(`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`)}><Icon name="nav" size={18} />Directions</button>
        )}
        <button className="btn ghost" onClick={() => openOnSite(`/repeaters?q=${encodeURIComponent(r.callsign || "")}`)}><Icon name="ext" size={18} />On the website</button>
      </div>
    </div>
  );
}

export default function Repeaters() {
  const wide = useWide();
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [mode, setMode] = useState("All");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState(null);
  const PAGE = 30;

  useEffect(() => { const t = setTimeout(() => setDq(q), 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => { setRows([]); setPage(0); }, [dq, mode]);

  const load = useAsync(async () => {
    const got = await getRepeaters({ q: dq, mode, skip: page * PAGE, limit: PAGE });
    setRows((prev) => (page === 0 ? got : [...prev, ...got]));
    return got.length;
  }, [dq, mode, page]);

  const more = load.data === PAGE;
  const list = (
    <div className="pad">
      <Head eyebrow="Directory" title="Repeaters" />
      <Search value={q} onChange={setQ} placeholder="Callsign or name" />
      <Chips items={["All", "Online", "Analog", "Digital"]} value={mode} onChange={setMode} />
      <State loading={load.loading && !rows.length} error={load.error && !rows.length} empty={!load.loading && !rows.length} onRetry={load.reload} emptyText="No repeaters match.">
        {rows.map((r) => (
          <button key={r.id} className="item" aria-selected={sel?.id === r.id} onClick={() => setSel(r)}>
            <div className="grow">
              <div className="row"><b>{r.callsign}</b>{r.status && <span className={"dot " + dotClass(r.status)} />}</div>
              <div className="mute sm clip">{r.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="freq">{fmtF(r.frequency)}</div>
              <div className="mute sm">{r.tone ? (/^\d/.test(r.tone) ? `${r.tone} Hz` : r.tone) : r.mode}</div>
            </div>
          </button>
        ))}
        {more && <button className="btn ghost block" disabled={load.loading} onClick={() => setPage((p) => p + 1)}>{load.loading ? "Loading…" : "Show more"}</button>}
      </State>
    </div>
  );

  if (wide) {
    return (
      <div className="two">
        <div className="l">{list}</div>
        <div className="r"><div className="pad" style={{ paddingTop: 26 }}>{sel ? <Detail r={sel} /> : <div className="empty">Pick a repeater to see its details.</div>}</div></div>
      </div>
    );
  }
  return <>{list}{sel && <Sheet onClose={() => setSel(null)}><Detail r={sel} /></Sheet>}</>;
}
