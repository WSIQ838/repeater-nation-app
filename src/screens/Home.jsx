import { getLiveNets, getEvents } from "../lib/api";
import { Head, State, useAsync, fmtDay } from "../components/ui";
import { Icon } from "../icons";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export default function Home({ me, go }) {
  const nets = useAsync(getLiveNets, []);
  const events = useAsync(getEvents, []);
  const first = (me.full_name || me.email || "").split(" ")[0];
  const live = nets.data || [];
  const soon = (events.data || []).slice(0, 3);

  return (
    <div className="pad">
      <Head eyebrow={greeting()} title={first ? <>{first}{me.callsign && <> · <span className="mono" style={{ fontSize: ".7em", color: "var(--accent)" }}>{me.callsign}</span></>}</> : "Welcome"} />

      <div className="hero">
        <div className="eyebrow" style={{ color: "#ffb066" }}>{live.length ? "On the air now" : "Nets"}</div>
        {nets.loading ? <div className="mute" style={{ marginTop: 8 }}>Checking the airwaves…</div> : nets.error ? (
          <div className="mute" style={{ marginTop: 8 }}>Can't check live nets right now.</div>
        ) : live.length ? (
          live.slice(0, 2).map((n) => (
            <div key={n.id} style={{ marginTop: 8 }}>
              <div style={{ font: "700 24px/1.1 var(--display)" }}>{n.name}</div>
              <div className="mute sm">{[n.net_type, n.frequency && `${n.frequency} MHz`, n.repeater_name].filter(Boolean).join(" · ")}</div>
            </div>
          ))
        ) : (
          <div style={{ font: "700 24px/1.1 var(--display)", marginTop: 8 }}>No nets on the air right now</div>
        )}
        <button className="btn" style={{ marginTop: 14 }} onClick={() => go("events")}><Icon name="cal" size={18} />Nets and events</button>
      </div>

      <div className="sec"><h3>Coming up</h3><button className="link" onClick={() => go("events")}>All</button></div>
      <State loading={events.loading} error={events.error} empty={!soon.length} onRetry={events.reload} emptyText="No upcoming events.">
        {soon.map((e) => {
          const d = fmtDay(e.date);
          return (
            <button key={e.id} className="item" onClick={() => go("events")}>
              <div className="cal"><div className="eyebrow">{d.dow}</div><b>{d.day}</b></div>
              <div className="grow"><b className="clip" style={{ display: "block" }}>{e.title}</b><div className="mute sm clip">{d.time}{e.location ? ` · ${e.location}` : ""}</div></div>
              {e.type && <span className="tag o">{e.type}</span>}
            </button>
          );
        })}
      </State>

      <div className="sec"><h3>Jump to</h3></div>
      <div className="tiles">
        <button className="tile" onClick={() => go("repeaters")}><Icon name="tower" /><b>Find a repeater</b><span>Search by callsign or name</span></button>
        <button className="tile" onClick={() => go("more", "tools")}><Icon name="tool" /><b>Operator tools</b><span>Offset, antenna, coax and more</span></button>
        <button className="tile" onClick={() => go("clubs")}><Icon name="users" /><b>Clubs</b><span>Find or join a club</span></button>
        <button className="tile" onClick={() => go("more")}><Icon name="grid" /><b>More</b><span>Forum, marketplace, logbook</span></button>
      </div>
    </div>
  );
}
