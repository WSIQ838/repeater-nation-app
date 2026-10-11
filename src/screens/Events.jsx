import { useState } from "react";
import { getEvents, getLiveNets } from "../lib/api";
import { Head, Chips, Sheet, State, useAsync, fmtDay } from "../components/ui";

export default function Events() {
  const [tab, setTab] = useState("Events");
  const [sel, setSel] = useState(null);
  const events = useAsync(getEvents, []);
  const nets = useAsync(getLiveNets, []);

  return (
    <div className="pad">
      <Head eyebrow="What's happening" title="Nets & Events" />
      <Chips items={["Events", "Live nets"]} value={tab} onChange={setTab} />
      {tab === "Events" ? (
        <State loading={events.loading} error={events.error} empty={!events.data?.length} onRetry={events.reload} emptyText="No upcoming events.">
          {events.data?.map((e) => {
            const d = fmtDay(e.date);
            return (
              <button key={e.id} className="item" onClick={() => setSel(e)}>
                <div className="cal"><div className="eyebrow">{d.dow}</div><b>{d.day}</b></div>
                <div className="grow"><b className="clip" style={{ display: "block" }}>{e.title}</b><div className="mute sm clip">{d.time}{e.location ? ` · ${e.location}` : ""}</div></div>
                {e.type && <span className="tag o">{e.type}</span>}
              </button>
            );
          })}
        </State>
      ) : (
        <State loading={nets.loading} error={nets.error} empty={!nets.data?.length} onRetry={nets.reload} emptyText="No nets on the air right now.">
          {nets.data?.map((n) => (
            <div key={n.id} className="card">
              <div className="row"><span className="dot" /><b className="grow">{n.name}</b>{n.net_type && <span className="tag">{n.net_type}</span>}</div>
              <div className="mute sm" style={{ marginTop: 6 }}>{[n.frequency && `${n.frequency} MHz`, n.tone && `Tone ${n.tone}`, n.repeater_name, n.location].filter(Boolean).join(" · ")}</div>
            </div>
          ))}
        </State>
      )}
      {sel && (
        <Sheet onClose={() => setSel(null)}>
          <div className="eyebrow">{sel.type}</div>
          <h1 className="title" style={{ marginTop: 2 }}>{sel.title}</h1>
          <div className="stat" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div><b>{new Date(sel.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</b><span>Date</span></div>
            <div><b>{fmtDay(sel.date).time}</b><span>Time</span></div>
          </div>
          {sel.location && <p style={{ margin: "0 0 10px" }}>{sel.location}</p>}
          {sel.organizer && <p className="mute" style={{ margin: "0 0 10px" }}>Organizer: {sel.organizer}</p>}
          {sel.description && <p className="mute" style={{ margin: 0 }}>{sel.description}</p>}
        </Sheet>
      )}
    </div>
  );
}
