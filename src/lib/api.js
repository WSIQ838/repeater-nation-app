import { createClient } from "@base44/sdk";
import { openUrl } from "@tauri-apps/plugin-opener";

// Same Repeater Nation account and data as the website. ?mock in the address (or VITE_MOCK=1)
// swaps in sample data so screens can be checked without signing in.
export const SITE = "https://repeaternation.com";
const APP_ID = "6a6d787f8e808727b935dd09";
export const MOCK = import.meta.env.VITE_MOCK === "1" || (typeof location !== "undefined" && new URLSearchParams(location.search).has("mock"));

let c = null;
function client() {
  if (!c) {
    c = createClient({
      appId: APP_ID,
      serverUrl: SITE,
      requiresAuth: false,
      appBaseUrl: SITE,
      options: { actorsTransport: "proxy" },
    });
  }
  return c;
}

const TOKEN_KEYS = ["base44_access_token", "token"];
const savedToken = () => {
  try {
    for (const k of TOKEN_KEYS) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
  } catch { /* storage can be unavailable */ }
  return "";
};

const withTimeout = (p, ms = 15000) => {
  let t;
  return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej(new Error("timeout")), ms); })]).finally(() => clearTimeout(t));
};

const friendly = (err) => {
  const status = err?.status ?? err?.response?.status;
  const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.data?.message;
  if (status === 401 || status === 403 || status === 400) return detail ? String(detail) : "Wrong email or password.";
  if (err?.message === "timeout" || /network/i.test(err?.message || "")) return "Can't reach Repeater Nation. Check your internet connection.";
  return detail ? String(detail) : "Something went wrong. Try again.";
};

// Returns { member } when a saved sign-in still works, null when there is none or it was
// refused, and { offline: true } when the server could not be reached.
export async function restoreSession() {
  if (MOCK) return { member: MOCK_ME };
  const token = savedToken();
  if (!token) return null;
  try {
    client().auth.setToken(token);
    const member = await withTimeout(client().auth.me());
    return member ? { member } : null;
  } catch (err) {
    const status = err?.status ?? err?.response?.status;
    if (status === 401 || status === 403) { await clearSession(); return null; }
    return { offline: true };
  }
}

export async function signIn(email, password) {
  if (MOCK) return { member: MOCK_ME };
  const e = email.trim();
  if (!e || !password) throw new Error("Enter your Repeater Nation email and password.");
  try {
    await withTimeout(client().auth.loginViaEmailPassword(e, password));
    const member = await withTimeout(client().auth.me());
    if (!member) throw new Error("Signed in, but your account could not be loaded.");
    return { member };
  } catch (err) {
    throw new Error(err?.message && !err?.response && err.message.length < 120 && !/network|timeout/i.test(err.message) ? err.message : friendly(err));
  }
}

export async function clearSession() {
  // The SDK's logout() also sends the page to the website's logout screen; forget the token instead.
  try { TOKEN_KEYS.forEach((k) => localStorage.removeItem(k)); } catch { /* ignore */ }
  try { c?.cleanup?.(); } catch { /* nothing to stop */ }
  c = null;
}

export function openOnSite(path = "/") {
  const url = path.startsWith("http") ? path : SITE + path;
  return openUrl(url).catch(() => { window.open(url, "_blank"); });
}

/* ---- data ---- */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getRepeaters({ q = "", mode = "All", skip = 0, limit = 30 } = {}) {
  if (MOCK) return MOCK_REPEATERS.filter((r) => (!q || (r.callsign + r.name).toLowerCase().includes(q.toLowerCase())) && (mode === "All" || (mode === "Online" ? r.status === "Online" : mode === "Analog" ? r.mode === "Analog" : r.mode !== "Analog"))).slice(skip, skip + limit);
  const query = {};
  if (mode === "Online") query.status = "Online";
  if (mode === "Analog") query.mode = "Analog";
  if (mode === "Digital") query.mode = { $ne: "Analog" };
  const t = q.trim();
  if (t) {
    const re = esc(t);
    query.$or = [{ callsign: { $regex: re, $options: "i" } }, { name: { $regex: re, $options: "i" } }];
  }
  return withTimeout(client().entities.Repeater.filter(query, "name", limit, skip));
}

export async function getLiveNets() {
  if (MOCK) return MOCK_NETS;
  return withTimeout(client().entities.NetControlSession.filter({ status: "active", is_public: true }, "-updated_date", 20));
}

export async function getEvents() {
  if (MOCK) return MOCK_EVENTS;
  const rows = await withTimeout(client().entities.Event.list("-date", 80));
  const since = Date.now() - 24 * 3600 * 1000;
  return rows.filter((e) => e.date && new Date(e.date).getTime() >= since).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export async function getClubs({ q = "", skip = 0, limit = 30 } = {}) {
  if (MOCK) return MOCK_CLUBS.filter((x) => !q || x.name.toLowerCase().includes(q.toLowerCase())).slice(skip, skip + limit);
  const query = q.trim() ? { name: { $regex: esc(q.trim()), $options: "i" } } : {};
  return withTimeout(client().entities.Club.filter(query, "-members_count", limit, skip));
}

/* ---- sample data (mock mode only) ---- */
const MOCK_ME = { id: "me", full_name: "Sean", email: "sean@example.com", callsign: "WSIQ838", role: "user" };
const MOCK_REPEATERS = [
  { id: "1", callsign: "WQRS220", name: "Ramah, NM", frequency: 462.55, offset: 5, tone: "103.5", input_tone: "", mode: "Analog", access: "Public", status: "Online", verification: "Verified", lat: 35.13, lng: -108.49, notes: "County: Cibola · Source: RepeaterBook.com" },
  { id: "2", callsign: "WRWD838", name: "Hobbs, NM", frequency: 462.7, offset: 5, tone: "162.2", input_tone: "162.2", mode: "Analog", access: "Public", status: "Online", verification: "Verified", lat: 32.7, lng: -103.13, notes: "County: Lea" },
  { id: "3", callsign: "W5RN", name: "Nation Hub, Dallas TX", frequency: 146.94, offset: -0.6, tone: "100.0", input_tone: "100.0", mode: "Analog", access: "Open", status: "Online", verification: "Verified", lat: 32.78, lng: -96.8, notes: "Weekly net Tuesdays 8 PM." },
  { id: "4", callsign: "N5DMR", name: "Metro DMR, Irving TX", frequency: 442.1, offset: 5, tone: "CC1", input_tone: "", mode: "DMR", access: "Open", status: "Online", verification: "Verified", lat: 32.81, lng: -96.95, notes: "Talkgroup 31480." },
  { id: "5", callsign: "KE5LS", name: "Lakeside, Rockwall TX", frequency: 145.33, offset: -0.6, tone: "88.5", input_tone: "88.5", mode: "Analog", access: "Open", status: "Offline", verification: "Verified", lat: 32.9, lng: -96.46, notes: "Down for antenna work." },
];
const MOCK_NETS = [
  { id: "n1", name: "Nation Wide Net", net_type: "Open net", frequency: "146.940", repeater_name: "W5RN", tone: "100.0", status: "active", start_time: "20:00" },
];
const day = (n) => new Date(Date.now() + n * 86400000).toISOString();
const MOCK_EVENTS = [
  { id: "e1", title: "Nation Wide Net", type: "Net", date: day(1), location: "146.940 · W5RN", organizer: "W5RN", description: "Weekly open net. All licensed operators welcome." },
  { id: "e2", title: "Lake Ray Hubbard POTA activation", type: "Gathering", date: day(5), location: "Rockwall, TX", organizer: "KD5JAX", description: "K-4521, 40m SSB." },
  { id: "e3", title: "Massillon Hamfest", type: "Swap Meet", date: day(21), location: "North Canton, OH", organizer: null, description: "Annual hamfest at the museum." },
];
const MOCK_CLUBS = [
  { id: "c1", name: "DFW Amateur Radio Club", callsign: "W5DFW", description: "Field Day, monthly meetings and a Saturday coffee at the repeater site.", location: "Garland, TX", members_count: 214, membership_fee: 30, fee_period: "Yearly", net_schedule: "Tue 8 PM", radio_services: ["HAM"] },
  { id: "c2", name: "Lakeside Radio Society", callsign: "KE5LS", description: "Lake-area club that maintains the Lakeside repeater.", location: "Rockwall, TX", members_count: 88, membership_fee: 0, fee_period: "One-time", net_schedule: "none", radio_services: ["HAM", "GMRS"] },
];
