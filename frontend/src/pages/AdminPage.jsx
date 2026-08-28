import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, CalendarDays, Users, LogOut, RefreshCw, Link2, Loader2, CheckCircle2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const KEY = "pp_admin_pass";

const fmt = (iso) => {
  try { return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
};
const fmtSlot = (date, time) => {
  if (!date || !time) return "—";
  try { return new Date(`${date}T${time}`).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric" }) + ` · ${time}`; }
  catch { return `${date} ${time}`; }
};

export default function AdminPage() {
  const [pass, setPass] = useState(localStorage.getItem(KEY) || "");
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [cal, setCal] = useState({ configured: false, connected: false, email: null });
  const [loading, setLoading] = useState(false);

  const headers = useCallback((p) => ({ "X-Admin-Passcode": p || pass }), [pass]);

  const loadAll = useCallback(async (p) => {
    setLoading(true);
    try {
      const [b, l, c] = await Promise.all([
        axios.get(`${API}/bookings`, { headers: headers(p) }),
        axios.get(`${API}/leads`, { headers: headers(p) }),
        axios.get(`${API}/calendar/status`, { headers: headers(p) }),
      ]);
      setBookings(b.data); setLeads(l.data); setCal(c.data);
    } catch { toast.error("Couldn't load data."); }
    finally { setLoading(false); }
  }, [headers]);

  const tryAuth = useCallback(async (p) => {
    try {
      await axios.post(`${API}/admin/verify`, {}, { headers: headers(p) });
      setPass(p); localStorage.setItem(KEY, p); setAuthed(true);
      loadAll(p);
      return true;
    } catch { return false; }
  }, [headers, loadAll]);

  useEffect(() => {
    if (pass) tryAuth(pass);
    const params = new URLSearchParams(window.location.search);
    if (params.get("calendar") === "connected") toast.success("Google Calendar connected!");
    if (params.get("calendar") === "error") toast.error("Calendar connection failed.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const ok = await tryAuth(input.trim());
    if (!ok) toast.error("Incorrect passcode.");
  };

  const logout = () => { localStorage.removeItem(KEY); setAuthed(false); setPass(""); setInput(""); };

  const connectCalendar = async () => {
    try {
      const res = await axios.get(`${API}/oauth/calendar/login`, { params: { passcode: pass } });
      window.location.href = res.data.authorization_url;
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Calendar not configured on server.");
    }
  };
  const disconnectCalendar = async () => {
    try { await axios.post(`${API}/calendar/disconnect`, {}, { headers: headers() }); toast.success("Disconnected."); loadAll(); }
    catch { toast.error("Failed."); }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
        <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" data-testid="admin-login">
          <div className="mb-6 flex items-center gap-2.5">
            <img src="/pilot-logo.png" alt="Page Pilot" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-display text-lg font-extrabold text-ink">Page Pilot <span className="text-ink/40">Admin</span></span>
          </div>
          <label className="mb-1.5 block text-xs font-medium text-ink/60">Passcode</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] py-3 pl-9 pr-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/40"
              data-testid="admin-passcode-input"
            />
          </div>
          <button type="submit" className="mt-5 w-full rounded-full bg-gold py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5" data-testid="admin-login-button">
            Enter
          </button>
          <a href="/" className="mt-4 block text-center text-xs text-ink/45 hover:text-ink">← Back to site</a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/pilot-logo.png" alt="Page Pilot" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-display text-base font-extrabold text-ink">Admin Inbox</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => loadAll()} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-gold" data-testid="admin-refresh">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-gold" data-testid="admin-logout">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Calendar card */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/5 bg-white p-6 sm:flex-row sm:items-center" data-testid="calendar-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-light/25 text-gold-dark"><CalendarDays size={20} /></div>
            <div>
              <p className="font-display text-sm font-bold text-ink">Google Calendar Sync</p>
              <p className="text-xs text-ink/50">
                {!cal.configured ? "Server credentials not set — add GOOGLE_CLIENT_ID & SECRET." :
                  cal.connected ? <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 size={12} /> Connected as {cal.email}</span> :
                  "Connect so new bookings appear in your calendar."}
              </p>
            </div>
          </div>
          {cal.configured && (cal.connected ? (
            <button onClick={disconnectCalendar} className="rounded-full border border-black/10 px-5 py-2.5 text-xs font-medium text-ink hover:border-gold" data-testid="calendar-disconnect">Disconnect</button>
          ) : (
            <button onClick={connectCalendar} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-white hover:-translate-y-0.5 transition-transform" data-testid="calendar-connect">
              <Link2 size={13} /> Connect Google Calendar
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button onClick={() => setTab("bookings")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${tab === "bookings" ? "bg-gold text-white" : "border border-black/10 bg-white text-ink"}`} data-testid="tab-bookings">
            <CalendarDays size={15} /> Bookings ({bookings.length})
          </button>
          <button onClick={() => setTab("leads")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${tab === "leads" ? "bg-gold text-white" : "border border-black/10 bg-white text-ink"}`} data-testid="tab-leads">
            <Users size={15} /> Chat Leads ({leads.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-dark" /></div>
        ) : tab === "bookings" ? (
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white" data-testid="bookings-table">
            {bookings.length === 0 ? <p className="p-10 text-center text-sm text-ink/40">No bookings yet.</p> : (
              <div className="divide-y divide-black/5">
                {bookings.map((b) => (
                  <div key={b.id} className="grid grid-cols-1 gap-1 p-5 md:grid-cols-5 md:items-center">
                    <div className="md:col-span-1"><p className="font-display font-bold text-ink">{b.name}</p><p className="text-xs text-ink/50">{b.email}</p></div>
                    <p className="text-sm text-ink/70">{b.business}</p>
                    <p className="text-sm text-ink/70">{b.service || "—"}</p>
                    <p className="text-sm font-medium text-gold-dark">{fmtSlot(b.date, b.time)}</p>
                    <div className="text-right"><p className="text-xs text-ink/40">{fmt(b.created_at)}</p>{b.meet_link && <a href={b.meet_link} target="_blank" rel="noreferrer" className="text-xs text-pilot underline">Meet link</a>}</div>
                    {b.message && <p className="text-xs text-ink/50 md:col-span-5">“{b.message}”</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white" data-testid="leads-table">
            {leads.length === 0 ? <p className="p-10 text-center text-sm text-ink/40">No chat leads yet.</p> : (
              <div className="divide-y divide-black/5">
                {leads.map((l) => (
                  <div key={l.id} className="grid grid-cols-1 gap-1 p-5 md:grid-cols-4 md:items-center">
                    <div><p className="font-display font-bold text-ink">{l.name}</p><p className="text-xs text-ink/50">{l.email}</p></div>
                    <p className="text-sm text-ink/60 md:col-span-2">{l.note || "—"}</p>
                    <p className="text-right text-xs text-ink/40">{fmt(l.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
