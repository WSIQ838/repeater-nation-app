import { Head, Back } from "../components/ui";
import { Icon } from "../icons";
import { openOnSite } from "../lib/api";

export default function Me({ me, onSignOut, onBack }) {
  const name = me.full_name || me.email || "Member";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="pad">
      <Back onClick={onBack} label="More" />
      <Head eyebrow="Account" title="Me" />
      <div className="card">
        <div className="row">
          <div style={{ width: 60, height: 60, borderRadius: "50%", display: "grid", placeItems: "center", background: "#2a1604", border: "1px solid #5a3512", font: "700 22px var(--display)" }}>{initials}</div>
          <div className="grow">
            <div style={{ font: "700 22px var(--display)" }}>{name}</div>
            {me.callsign && <div className="mono" style={{ color: "var(--accent)" }}>{me.callsign}</div>}
            {me.email && <div className="mute sm clip">{me.email}</div>}
          </div>
        </div>
      </div>
      <div className="row wrap" style={{ marginTop: 14 }}>
        <button className="btn ghost" onClick={() => openOnSite("/profile")}><Icon name="ext" size={18} />Edit profile on the website</button>
        <button className="btn ghost" onClick={onSignOut}><Icon name="logout" size={18} />Sign out</button>
      </div>
      <p className="mute sm" style={{ marginTop: 22 }}>Repeater Nation app {__APP_VERSION__}</p>
    </div>
  );
}
