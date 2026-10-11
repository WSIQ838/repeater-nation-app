import { useState } from "react";
import { Head, Back, useWide } from "../components/ui";
import { Icon } from "../icons";
import { FrequencyTool, ToneTool, AntennaTool, CoaxTool, PowerTool, DistanceTool, MorseTool } from "../tools/Calculators";

export const TOOLS = [
  { id: "freq", title: "Frequency Calculator", desc: "Repeater input/output and offset math.", icon: "tower", C: FrequencyTool },
  { id: "tone", title: "CTCSS / DCS Tones", desc: "Search and copy tones and codes.", icon: "music", C: ToneTool },
  { id: "antenna", title: "Antenna Calculator", desc: "Estimate 1/4, 1/2, and 5/8 wave lengths.", icon: "ruler", C: AntennaTool },
  { id: "coax", title: "Coax Loss Calculator", desc: "Estimate feedline loss and remaining power.", icon: "route", C: CoaxTool },
  { id: "power", title: "Power & ERP Calculator", desc: "Estimate EIRP and ERP from your system.", icon: "zap", C: PowerTool },
  { id: "distance", title: "Distance Calculator", desc: "Measure distance between two locations.", icon: "pin", C: DistanceTool },
  { id: "morse", title: "Morse Code Chart", desc: "Reference chart plus a text to Morse converter.", icon: "binary", C: MorseTool },
];

export default function Tools({ toast, onBack }) {
  const wide = useWide();
  const [id, setId] = useState(wide ? "freq" : null);
  const cur = TOOLS.find((t) => t.id === id);
  const detail = cur && (
    <div className="pad">
      <div className="eyebrow">{cur.desc}</div>
      <h1 className="title" style={{ marginBottom: 14 }}>{cur.title}</h1>
      <cur.C toast={toast} />
    </div>
  );

  if (wide) {
    return (
      <div className="two" style={{ gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.2fr)" }}>
        <div className="l">
          <div className="pad">
            <Head eyebrow="Calculators & reference" title="Tools" />
            {TOOLS.map((t) => (
              <button key={t.id} className="item" aria-selected={id === t.id} onClick={() => setId(t.id)}>
                <span style={{ color: "var(--accent)" }}><Icon name={t.icon} /></span>
                <div className="grow"><b>{t.title}</b><div className="mute sm">{t.desc}</div></div>
              </button>
            ))}
          </div>
        </div>
        <div className="r">{detail}</div>
      </div>
    );
  }
  if (cur) return <div><div style={{ padding: "4px 14px 0" }}><Back onClick={() => setId(null)} label="Tools" /></div>{detail}</div>;
  return (
    <div className="pad">
      <Back onClick={onBack} label="More" />
      <Head eyebrow="Calculators & reference" title="Tools" />
      <div className="tiles">
        {TOOLS.map((t) => (
          <button key={t.id} className="tile" onClick={() => setId(t.id)}><Icon name={t.icon} /><b>{t.title}</b><span>{t.desc}</span></button>
        ))}
      </div>
    </div>
  );
}
