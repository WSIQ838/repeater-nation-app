import { useEffect, useState } from "react";
import { signIn, sendVerifyCode, verifyEmailCode, startProviderSignIn, PROVIDERS, openOnSite } from "../lib/api";
import logo from "../assets/icon.svg";

export default function Login({ onSignedIn, offline, note }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(offline ? "Can't reach Repeater Nation. Check your internet connection." : "");
  const [info, setInfo] = useState("");
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const [wait, setWait] = useState(0); // seconds until "Send a new code" works again

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSignedIn((await signIn(email, password)).member);
    } catch (err) {
      if (err.needsVerify) await askForCode();
      else setError(err.message);
      setBusy(false);
    }
  };

  // The account's email was never verified: send a code and show the code screen.
  const askForCode = async () => {
    setError("");
    if (!email.trim()) { setError("Enter your email first."); return; }
    try {
      await sendVerifyCode(email);
      setCode("");
      setVerify(true);
      setWait(30);
    } catch (err) {
      setError(err.message);
    }
  };

  const resend = async () => {
    setError("");
    try {
      await sendVerifyCode(email);
      setCode("");
      setWait(30);
      setInfo("New code sent. Use the code from the newest email (check Spam too).");
    } catch (err) {
      setError(err.message);
    }
  };

  const confirm = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSignedIn((await verifyEmailCode(email, code, password)).member);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const provider = async (id, name) => {
    setError("");
    setInfo(`Finish signing in with ${name} in your browser, then come back to the app.`);
    try { await startProviderSignIn(id); } catch { setError("Couldn't open your browser."); }
  };

  if (verify) {
    return (
      <form className="login" onSubmit={confirm}>
        <img className="logo" src={logo} alt="" />
        <h1>Verify your email</h1>
        <p className="mute" style={{ margin: "0 0 22px" }}>Your email isn't verified yet. Enter the 6-digit code we sent to {email}.</p>
        <div className="fld">
          <label htmlFor="otp">Code</label>
          <input id="otp" className="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" autoFocus />
        </div>
        <button className="btn block" type="submit" disabled={busy || code.length < 6}>{busy ? "Checking…" : "Verify and sign in"}</button>
        {error && <div className="err" role="alert">{error}</div>}
        {info && !error && <div className="note" role="status">{info}</div>}
        <div className="row" style={{ justifyContent: "space-between", marginTop: 18 }}>
          <button type="button" className="link" disabled={wait > 0} onClick={resend} style={wait > 0 ? { color: "var(--mute)" } : undefined}>{wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}</button>
          <button type="button" className="link" onClick={() => { setVerify(false); setError(""); setInfo(""); }}>Back</button>
        </div>
      </form>
    );
  }

  return (
    <form className="login" onSubmit={submit}>
      <img className="logo" src={logo} alt="" />
      <h1>Repeater Nation</h1>
      <p className="mute" style={{ margin: "0 0 20px" }}>Sign in with your Repeater Nation account.</p>

      <div className="providers">
        {PROVIDERS.map((p) => (
          <button key={p.id} type="button" className="prov" onClick={() => provider(p.id, p.name)}>
            <span className="mark" style={{ color: p.color }}>{p.mark}</span>
            <span>Continue with {p.name}</span>
          </button>
        ))}
      </div>
      <div className="or"><span>or</span></div>

      <div className="fld">
        <label htmlFor="em">Email</label>
        <input id="em" type="email" inputMode="email" autoComplete="username" autoCapitalize="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="fld">
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn block" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      {error && <div className="err" role="alert">{error}</div>}
      {(note || info) && !error && <div className="note" role="status">{note || info}</div>}
      <div className="row" style={{ justifyContent: "space-between", marginTop: 18 }}>
        <button type="button" className="link" onClick={() => openOnSite("/forgot-password")}>Forgot password?</button>
        <button type="button" className="link" onClick={() => openOnSite("/register")}>Create an account</button>
      </div>
      <p className="mute sm" style={{ marginTop: 18 }}>
        Signed up but never entered your email code?{" "}
        <button type="button" className="link" onClick={askForCode}>Verify your email</button>
      </p>
    </form>
  );
}
