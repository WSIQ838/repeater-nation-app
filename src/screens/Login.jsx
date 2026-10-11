import { useState } from "react";
import { signIn, openOnSite } from "../lib/api";
import logo from "../assets/icon.svg";

export default function Login({ onSignedIn, offline }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(offline ? "Can't reach Repeater Nation. Check your internet connection." : "");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSignedIn((await signIn(email, password)).member);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="login" onSubmit={submit}>
      <img className="logo" src={logo} alt="" />
      <h1>Repeater Nation</h1>
      <p className="mute" style={{ margin: "0 0 22px" }}>Sign in with your Repeater Nation account.</p>
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
      <div className="row" style={{ justifyContent: "space-between", marginTop: 18 }}>
        <button type="button" className="link" onClick={() => openOnSite("/forgot-password")}>Forgot password?</button>
        <button type="button" className="link" onClick={() => openOnSite("/register")}>Create an account</button>
      </div>
      <p className="mute sm" style={{ marginTop: 22 }}>Signed up with Google? Set a password on the website first (Forgot password), then sign in here.</p>
    </form>
  );
}
