import { useCallback, useEffect, useRef, useState } from "react";
import { restoreSession, clearSession } from "./lib/api";
import { useWide } from "./components/ui";
import { Icon } from "./icons";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Repeaters from "./screens/Repeaters";
import Events from "./screens/Events";
import Clubs from "./screens/Clubs";
import More, { SiteCard, SITE_ITEMS } from "./screens/More";
import Tools from "./screens/Tools";
import Me from "./screens/Me";

const TABS = [
  ["home", "Home", "home"],
  ["repeaters", "Repeaters", "tower"],
  ["events", "Nets", "cal"],
  ["clubs", "Clubs", "users"],
  ["more", "More", "grid"],
];

export default function App() {
  const wide = useWide();
  const [me, setMe] = useState(undefined); // undefined = checking, null = signed out
  const [offline, setOffline] = useState(false);
  const [tab, setTab] = useState("home");
  const [view, setView] = useState("");
  const [toastText, setToastText] = useState("");
  const timer = useRef();

  useEffect(() => {
    restoreSession().then((r) => {
      if (r?.member) setMe(r.member);
      else { setOffline(!!r?.offline); setMe(null); }
    });
  }, []);

  const go = useCallback((t, v = "") => { setTab(t); setView(v); }, []);
  const toast = useCallback((t) => {
    setToastText(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastText(""), 1600);
  }, []);
  const signOut = async () => { await clearSession(); setMe(null); go("home"); };

  if (me === undefined) return <div className="login" style={{ alignItems: "center", color: "var(--mute)" }}>Loading…</div>;
  if (me === null) return <Login onSignedIn={setMe} offline={offline} />;

  const back = () => setView("");
  let body;
  if (tab === "home") body = <Home me={me} go={go} />;
  else if (tab === "repeaters") body = <Repeaters />;
  else if (tab === "events") body = <Events />;
  else if (tab === "clubs") body = <Clubs />;
  else if (view === "tools") body = <Tools toast={toast} onBack={back} />;
  else if (view === "me") body = <Me me={me} onSignOut={signOut} onBack={back} />;
  else if (view.startsWith("site:")) body = <SiteCard item={SITE_ITEMS.find((s) => s.id === view.slice(5)) || SITE_ITEMS[0]} onBack={back} />;
  else body = <More go={go} />;

  const railBtn = (t, v, label, icon) => (
    <button key={label} aria-current={tab === t && view === v ? "page" : undefined} onClick={() => go(t, v)}><Icon name={icon} size={20} />{label}</button>
  );

  return (
    <div className={"app" + (wide ? " wide" : "")}>
      <nav className="rail" aria-label="Main">
        <div className="brand"><span style={{ color: "var(--accent)" }}><Icon name="tower" size={26} /></span>Repeater Nation</div>
        <div className="grp">Explore</div>
        {railBtn("home", "", "Home", "home")}
        {railBtn("repeaters", "", "Repeaters", "tower")}
        {railBtn("events", "", "Nets & Events", "cal")}
        {railBtn("clubs", "", "Clubs", "users")}
        <div className="grp">Tools</div>
        {railBtn("more", "tools", "Tools", "tool")}
        <div className="grp">On the website</div>
        {SITE_ITEMS.map((s) => railBtn("more", `site:${s.id}`, s.title.replace(" & Situational Awareness", ""), s.icon))}
        <div className="grp">Account</div>
        {railBtn("more", "me", "Me", "user")}
      </nav>
      <div className="main">
        <div className="scroll"><div className="screen" key={tab + view}>{body}</div></div>
        <nav className="tabbar" aria-label="Main">
          {TABS.map(([id, label, icon]) => (
            <button key={id} aria-current={tab === id ? "page" : undefined} onClick={() => go(id, "")}><Icon name={icon} />{label}</button>
          ))}
        </nav>
      </div>
      {toastText && <div className="toast" role="status">{toastText}</div>}
    </div>
  );
}
