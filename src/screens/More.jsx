import { Head, Back } from "../components/ui";
import { Icon } from "../icons";
import { openOnSite } from "../lib/api";

// Screens that are not in the app yet open the same page on the website.
export const SITE_ITEMS = [
  { id: "parks", title: "Parks & Summits", desc: "POTA and SOTA, favorites and activations", icon: "mount", path: "/tools/pota" },
  { id: "forum", title: "Forum", desc: "Antennas, repeaters, nets and newcomers", icon: "chat", path: "/forums" },
  { id: "market", title: "Marketplace", desc: "Buy, sell and swap gear", icon: "bag", path: "/marketplace" },
  { id: "equip", title: "Equipment", desc: "Track and borrow gear", icon: "tool", path: "/equipment" },
  { id: "trips", title: "Trips", desc: "Plan a route with repeaters along it", icon: "route", path: "/trips" },
  { id: "sdr", title: "SDR Streams", desc: "Listen to receivers near you", icon: "wave", path: "/tools/sdr" },
  { id: "log", title: "Logbook", desc: "Your contacts", icon: "book", path: "/logbook" },
  { id: "msgs", title: "Messages", desc: "Friends and direct messages", icon: "mail", path: "/messages" },
  { id: "emerg", title: "Emergency & Situational Awareness", desc: "Alerts, emergency nets and infrastructure", icon: "alert", path: "/tools/emergency" },
];

export default function More({ go }) {
  return (
    <div className="pad">
      <Head eyebrow="Everything else" title="More" />
      <div className="tiles">
        <button className="tile" onClick={() => go("more", "tools")}><Icon name="tool" /><b>Tools</b><span>Offset, antenna, coax, tones and more</span></button>
        {SITE_ITEMS.map((s) => (
          <button key={s.id} className="tile" onClick={() => go("more", `site:${s.id}`)}><Icon name={s.icon} /><b>{s.title}</b><span>{s.desc}</span></button>
        ))}
        <button className="tile" onClick={() => go("more", "me")}><Icon name="user" /><b>Me</b><span>Account and sign out</span></button>
      </div>
    </div>
  );
}

export function SiteCard({ item, onBack }) {
  return (
    <div className="pad">
      <Back onClick={onBack} label="More" />
      <Head eyebrow="On the website" title={item.title} />
      <div className="card">
        <div style={{ color: "var(--accent)", marginBottom: 8 }}><Icon name={item.icon} size={30} /></div>
        <p style={{ margin: "0 0 12px" }}>{item.desc}.</p>
        <p className="mute" style={{ margin: "0 0 16px" }}>This screen isn't in the app yet. It opens on the Repeater Nation website in your browser, and it's coming to the app in a later update.</p>
        <button className="btn" onClick={() => openOnSite(item.path)}><Icon name="ext" size={18} />Open on the website</button>
      </div>
    </div>
  );
}
