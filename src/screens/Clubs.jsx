import { useEffect, useState } from "react";
import { getClubs, openOnSite } from "../lib/api";
import { Head, Search, Sheet, State, useAsync, useWide } from "../components/ui";
import { Icon } from "../icons";

const initials = (n = "") => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Detail({ c }) {
  const fee = c.membership_fee ? `$${c.membership_fee}${c.fee_period ? ` / ${String(c.fee_period).toLowerCase()}` : ""}` : "Free";
  return (
    <div>
      <div className="eyebrow">{[c.callsign, c.location].filter(Boolean).join(" · ") || "Club"}</div>
      <h1 className="title" style={{ marginTop: 2 }}>{c.name}</h1>
      {c.description && <p className="mute" style={{ margin: "0 0 12px" }}>{c.description}</p>}
      <div className="stat">
        <div><b>{c.members_count ?? 0}</b><span>Members</span></div>
        <div><b>{fee}</b><span>Dues</span></div>
        <div><b>{c.net_schedule && c.net_schedule !== "none" ? c.net_schedule : "—"}</b><span>Club net</span></div>
      </div>
      {!!c.radio_services?.length && <div className="row wrap" style={{ marginBottom: 14 }}>{c.radio_services.map((s) => <span key={s} className="tag">{s}</span>)}</div>}
      <button className="btn" onClick={() => openOnSite("/clubs")}><Icon name="ext" size={18} />Join on the website</button>
    </div>
  );
}

export default function Clubs() {
  const wide = useWide();
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [sel, setSel] = useState(null);
  useEffect(() => { const t = setTimeout(() => setDq(q), 300); return () => clearTimeout(t); }, [q]);
  const clubs = useAsync(() => getClubs({ q: dq }), [dq]);

  const list = (
    <div className="pad">
      <Head eyebrow="Groups" title="Clubs" />
      <Search value={q} onChange={setQ} placeholder="Find a club" />
      <State loading={clubs.loading && !clubs.data} error={clubs.error} empty={!clubs.loading && !clubs.data?.length} onRetry={clubs.reload} emptyText="No clubs match.">
        {clubs.data?.map((c) => (
          <button key={c.id} className="item" aria-selected={sel?.id === c.id} onClick={() => setSel(c)}>
            <div style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: "#2a1604", border: "1px solid #5a3512", font: "700 15px var(--display)", flex: "none" }}>{initials(c.name)}</div>
            <div className="grow"><b className="clip" style={{ display: "block" }}>{c.name}</b><div className="mute sm clip">{[c.location, `${c.members_count ?? 0} members`].filter(Boolean).join(" · ")}</div></div>
          </button>
        ))}
      </State>
    </div>
  );

  if (wide) {
    return (
      <div className="two">
        <div className="l">{list}</div>
        <div className="r"><div className="pad" style={{ paddingTop: 26 }}>{sel ? <Detail c={sel} /> : <div className="empty">Pick a club to see its details.</div>}</div></div>
      </div>
    );
  }
  return <>{list}{sel && <Sheet onClose={() => setSel(null)}><Detail c={sel} /></Sheet>}</>;
}
