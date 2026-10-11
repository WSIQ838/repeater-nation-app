import { useState } from "react";
import { TONES, DCS, MC } from "./data";
import { Search } from "../components/ui";

const num = (v) => { const x = parseFloat(v); return Number.isNaN(x) ? null : x; };
const Fld = ({ label, unit, value, set, mode = "decimal" }) => (
  <div className="fld">
    <label>{label}{unit ? ` (${unit})` : ""}</label>
    <input inputMode={mode} autoComplete="off" value={value} onChange={(e) => set(e.target.value)} />
  </div>
);
const Row = ({ l, v }) => (<div className="ro"><span className="mute">{l}</span><b>{v}</b></div>);
const Out = ({ children }) => <div className="card" style={{ padding: "2px 14px" }}>{children}</div>;
const Note = ({ children }) => <div className="card mute">{children}</div>;
const ftin = (ft) => { const f = Math.floor(ft); return `${f} ft ${((ft - f) * 12).toFixed(1)} in`; };

export function FrequencyTool() {
  const [f, setF] = useState("146.94");
  const [tn, setTn] = useState("100.0");
  const x = num(f);
  let off = null;
  if (x !== null) {
    if ((x >= 145.1 && x < 145.5) || (x >= 146.6 && x < 147.0)) off = -0.6;
    else if ((x >= 146.0 && x < 146.4) || (x >= 147.0 && x < 147.4)) off = 0.6;
    else if (x >= 442 && x < 445) off = 5;
    else if (x >= 447 && x < 450) off = -5;
    else if (x >= 462.55 && x < 462.73) off = 5; // GMRS repeater channels
  }
  return (
    <>
      <Fld label="Repeater output frequency" unit="MHz" value={f} set={setF} />
      <div className="fld"><label>CTCSS tone</label><select value={tn} onChange={(e) => setTn(e.target.value)}>{TONES.map((t) => <option key={t} value={t}>{t} Hz</option>)}</select></div>
      {x === null ? <Note>Enter a frequency in MHz.</Note> : off === null ? <Note>That frequency has no standard offset in the US band plan. Treat it as simplex, or check the repeater listing.</Note> : (
        <Out>
          <Row l="Receive (repeater output)" v={`${x.toFixed(3)} MHz`} />
          <Row l="Transmit (repeater input)" v={`${(x + off).toFixed(3)} MHz`} />
          <Row l="Offset" v={`${off > 0 ? "+" : "−"}${Math.abs(off)} MHz`} />
          <Row l="Tone (transmit)" v={`${tn} Hz`} />
        </Out>
      )}
    </>
  );
}

export function ToneTool({ toast }) {
  const [q, setQ] = useState("");
  const m = (a) => a.filter((t) => !q.trim() || t.includes(q.trim()));
  const copy = (t) => { try { navigator.clipboard.writeText(t).then(() => toast(`Copied ${t}`), () => toast(t)); } catch { toast(t); } };
  const chips = (a, u) => (a.length ? a.map((t) => <button key={t} className="chip" onClick={() => copy(t + u)}>{t}</button>) : <span className="mute sm">No match</span>);
  return (
    <>
      <Search value={q} onChange={setQ} placeholder="Search a tone or code, like 100 or 023" />
      <div className="eyebrow" style={{ margin: "4px 0 8px" }}>CTCSS (Hz)</div>
      <div className="row wrap">{chips(m(TONES), "")}</div>
      <div className="eyebrow" style={{ margin: "16px 0 8px" }}>DCS codes</div>
      <div className="row wrap">{chips(m(DCS), "")}</div>
      <div className="mute sm" style={{ marginTop: 10 }}>Tap a tone to copy it.</div>
    </>
  );
}

export function AntennaTool() {
  const [f, setF] = useState("146.52");
  const x = num(f);
  const r = (n, k) => { const ft = k / x; return <Row key={n} l={n} v={<>{ftin(ft)}<div className="mute sm" style={{ font: "12px var(--mono)" }}>{(ft * 0.3048).toFixed(2)} m</div></>} />; };
  return (
    <>
      <Fld label="Frequency" unit="MHz" value={f} set={setF} />
      {!x || x <= 0 ? <Note>Enter a frequency in MHz.</Note> : (
        <>
          <Out>{[["Quarter-wave vertical", 234], ["Half-wave dipole (total)", 468], ["Each dipole leg", 234], ["5/8 wave vertical", 585]].map(([n, k]) => r(n, k))}</Out>
          <div className="mute sm" style={{ marginTop: 8 }}>Free-space starting points. Trim while watching SWR.</div>
        </>
      )}
    </>
  );
}

const LOSS = { "RG-58": [2.2, 5.0, 9.5], "RG-8X": [1.4, 3.7, 6.7], "RG-213": [0.7, 1.9, 3.8], "LMR-400": [0.6, 1.5, 2.7] };
export function CoaxTool() {
  const [cab, setCab] = useState("RG-58");
  const [band, setBand] = useState(1);
  const [len, setLen] = useState("50");
  const [pw, setPw] = useState("50");
  const [swr, setSwr] = useState("1.5");
  const l = num(len), p = num(pw), s = num(swr);
  let out = <Note>Enter a length and power.</Note>;
  if (l !== null && p !== null) {
    const dB = (LOSS[cab][band] * l) / 100, po = p * 10 ** (-dB / 10);
    out = <Out><Row l="Loss" v={`${dB.toFixed(2)} dB`} /><Row l="Power at the antenna" v={`${po.toFixed(1)} W`} /><Row l="Lost as heat" v={`${(p - po).toFixed(1)} W`} /></Out>;
  }
  let sw = <Note>Enter an SWR of 1.0 or higher.</Note>;
  if (s !== null && s >= 1) {
    const g = (s - 1) / (s + 1);
    sw = <Out><Row l="Reflected power" v={`${(g * g * 100).toFixed(1)} %`} /><Row l="Return loss" v={g === 0 ? "∞" : `${(-20 * Math.log10(g)).toFixed(1)} dB`} /><Row l="Mismatch loss" v={`${(-10 * Math.log10(1 - g * g)).toFixed(2)} dB`} /></Out>;
  }
  return (
    <>
      <div className="fld"><label>Cable</label><select value={cab} onChange={(e) => setCab(e.target.value)}>{Object.keys(LOSS).map((k) => <option key={k}>{k}</option>)}</select></div>
      <div className="fld"><label>Band</label><select value={band} onChange={(e) => setBand(+e.target.value)}><option value={0}>10 m (28 MHz)</option><option value={1}>2 m (146 MHz)</option><option value={2}>70 cm (446 MHz)</option></select></div>
      <Fld label="Cable length" unit="ft" value={len} set={setLen} />
      <Fld label="Transmitter power" unit="W" value={pw} set={setPw} />
      {out}
      <div className="eyebrow" style={{ margin: "18px 0 8px" }}>SWR check</div>
      <Fld label="SWR at the antenna" value={swr} set={setSwr} />
      {sw}
      <div className="mute sm" style={{ marginTop: 8 }}>Loss figures are typical values for new cable. Real cable varies.</div>
    </>
  );
}

export function PowerTool() {
  const [pw, setPw] = useState("50");
  const [ls, setLs] = useState("2.5");
  const [g, setG] = useState("3");
  const p = num(pw), l = num(ls), a = num(g);
  const ok = p !== null && l !== null && a !== null && p > 0;
  const erp = ok ? p * 10 ** ((a - l) / 10) : 0;
  return (
    <>
      <Fld label="Transmitter power" unit="W" value={pw} set={setPw} />
      <Fld label="Feedline loss" unit="dB" value={ls} set={setLs} />
      <Fld label="Antenna gain" unit="dBd" value={g} set={setG} />
      {!ok ? <Note>Enter power, feedline loss and antenna gain.</Note> : (
        <Out><Row l="ERP (vs. a dipole)" v={`${erp.toFixed(1)} W`} /><Row l="EIRP (vs. isotropic)" v={`${(erp * 1.64).toFixed(1)} W`} /><Row l="Net system gain" v={`${a - l >= 0 ? "+" : "−"}${Math.abs(a - l).toFixed(1)} dB`} /></Out>
      )}
    </>
  );
}

export function DistanceTool() {
  const [v, setV] = useState({ a: "32.78", b: "-96.8", c: "36.15", d: "-95.99" });
  const set = (k) => (x) => setV((s) => ({ ...s, [k]: x }));
  const [a, b, c, d] = [v.a, v.b, v.c, v.d].map(num);
  let out = <Note>Enter four coordinates.</Note>;
  if ([a, b, c, d].every((x) => x !== null)) {
    const R = 3958.8, r = (x) => (x * Math.PI) / 180, dl = r(d - b), p1 = r(a), p2 = r(c);
    const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    const mi = 2 * R * Math.asin(Math.sqrt(h));
    const br = ((Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)) * 180) / Math.PI + 360) % 360;
    out = <Out><Row l="Distance" v={`${mi.toFixed(1)} mi`} /><Row l="In kilometers" v={`${(mi * 1.609).toFixed(1)} km`} /><Row l="Bearing" v={`${br.toFixed(0)}° ${["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(br / 45) % 8]}`} /></Out>;
  }
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 6 }}>From</div>
      <div className="row" style={{ alignItems: "stretch" }}><div className="grow"><Fld label="Latitude" value={v.a} set={set("a")} /></div><div className="grow"><Fld label="Longitude" value={v.b} set={set("b")} /></div></div>
      <div className="eyebrow" style={{ margin: "4px 0 6px" }}>To</div>
      <div className="row" style={{ alignItems: "stretch" }}><div className="grow"><Fld label="Latitude" value={v.c} set={set("c")} /></div><div className="grow"><Fld label="Longitude" value={v.d} set={set("d")} /></div></div>
      {out}
    </>
  );
}

const morseOf = (t) => t.toUpperCase().split("").map((ch) => (ch === " " ? "/" : MC[ch] || "")).filter(Boolean);
const dd = (s) => s.replace(/\./g, "·").replace(/-/g, "−");
export function MorseTool({ toast }) {
  const [t, setT] = useState("CQ CQ DE WSIQ838");
  const [wpm, setWpm] = useState(15);
  const m = morseOf(t);
  const play = () => {
    try {
      const u = 1.2 / wpm, AC = window.AudioContext || window.webkitAudioContext, ctx = new AC();
      let at = ctx.currentTime + 0.05;
      m.forEach((w) => {
        if (w === "/") { at += u * 4; return; }
        [...w].forEach((s) => {
          const d = s === "." ? u : u * 3, o = ctx.createOscillator(), g = ctx.createGain();
          o.frequency.value = 700; o.connect(g); g.connect(ctx.destination);
          g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(0.25, at + 0.005); g.gain.setValueAtTime(0.25, at + d - 0.005); g.gain.linearRampToValueAtTime(0, at + d);
          o.start(at); o.stop(at + d + 0.01); at += d + u;
        });
        at += u * 2;
      });
    } catch { toast("Sound isn't available here"); }
  };
  return (
    <>
      <div className="fld"><label>Text</label><input value={t} onChange={(e) => setT(e.target.value)} autoComplete="off" /></div>
      <div className="fld"><label>Speed</label><select value={wpm} onChange={(e) => setWpm(+e.target.value)}>{[12, 15, 20].map((n) => <option key={n} value={n}>{n} words per minute</option>)}</select></div>
      <div className="card"><div className="mo">{m.length ? m.map(dd).join("  ") : <span className="mute">Type some text.</span>}</div></div>
      <div className="row" style={{ margin: "12px 0 18px" }}><button className="btn" onClick={play}>Play</button><span className="mute sm">Sound starts when you tap Play.</span></div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Chart</div>
      <div className="ph">{Object.keys(MC).filter((k) => /[A-Z0-9]/.test(k)).map((k) => <div key={k}><b>{k}</b><span>{dd(MC[k])}</span></div>)}</div>
    </>
  );
}
