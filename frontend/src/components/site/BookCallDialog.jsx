import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, PhoneCall, CalendarDays, ArrowLeft, Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useBooking } from "../../context/BookingContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const services = ["AI Chatbots", "AI Receptionists", "Website Design", "Not sure yet"];

const TIMES = [];
for (let h = 9; h <= 16; h++) {
  TIMES.push(`${String(h).padStart(2, "0")}:00`);
  TIMES.push(`${String(h).padStart(2, "0")}:30`);
}
TIMES.push("17:00");

const fmtDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const label12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
};
const prettyDate = (d) =>
  d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

const inputClass =
  "w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink/35 focus:border-gold focus:ring-2 focus:ring-gold/40";

const empty = { name: "", email: "", business: "", service: "", message: "" };

export const BookCallDialog = () => {
  const { open, setOpen, presetService } = useBooking();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState("");
  const [taken, setTaken] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setDate(undefined);
      setTime("");
      setTaken([]);
      setSuccess(false);
      setForm({ ...empty, service: presetService || "" });
    }
  }, [open, presetService]);

  const loadSlots = useCallback(async (d) => {
    setSlotsLoading(true);
    try {
      const res = await axios.get(`${API}/bookings/slots`, { params: { date: fmtDate(d) } });
      setTaken(res.data.taken || []);
    } catch {
      setTaken([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const onSelectDate = (d) => {
    if (!d) return;
    setDate(d);
    setTime("");
    loadSlots(d);
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = date && fmtDate(date) === fmtDate(new Date());
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const slotPassed = (t) => {
    if (!isToday) return false;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m <= nowMinutes;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.business) {
      toast.error("Please fill in your name, email and business.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, {
        name: form.name,
        email: form.email,
        business: form.business,
        service: form.service || null,
        date: fmtDate(date),
        time,
        message: form.message || null,
      });
      setSuccess(true);
      toast.success("Call booked — see you then!");
    } catch (err) {
      if (err?.response?.status === 409) {
        toast.error("That slot was just taken. Please pick another time.");
        setStep(1);
        setTime("");
        if (date) loadSlots(date);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg overflow-hidden rounded-3xl border-black/5 bg-white p-0 shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
        data-testid="booking-dialog"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center px-8 py-16 text-center"
              data-testid="booking-success"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-light/25 text-gold-dark">
                <CheckCircle2 size={34} strokeWidth={1.6} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-ink">You're booked in.</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/55">
                Thanks, {form.name.split(" ")[0] || "there"}. Your free discovery call is set for{" "}
                <span className="font-medium text-ink">{date && prettyDate(date)} at {label12(time)}</span>.
                We'll be in touch shortly to confirm the details.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-8 rounded-full bg-ink px-8 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                data-testid="booking-close-button"
              >
                Done
              </button>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="border-b border-black/5 bg-[#FDFBF4] px-8 py-6">
                <div className="flex items-center gap-2 text-gold-dark">
                  <CalendarDays size={16} />
                  <span className="text-xs font-medium uppercase tracking-[0.2em]">Pick a Time</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">Book your free call.</h3>
                <p className="mt-1.5 text-sm text-ink/55">Choose a day and time that suits you.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
                <div className="flex justify-center rounded-2xl border border-black/5 bg-[#FAFAFA] p-1" data-testid="booking-calendar">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelectDate}
                    disabled={[{ before: new Date(Math.max(today, Date.now())) }, { dayOfWeek: [0] }]}
                    fromMonth={new Date()}
                    classNames={{
                      day_selected:
                        "bg-gold text-white hover:bg-gold hover:text-white focus:bg-gold focus:text-white",
                      day_today: "border border-gold/40 text-ink",
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink/60">
                    <Clock size={13} /> {date ? prettyDate(date) : "Select a date first"}
                  </div>
                  <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pr-1" data-testid="time-slots">
                    {!date ? (
                      <p className="col-span-2 mt-6 text-center text-xs text-ink/40">Pick a date to see available times.</p>
                    ) : slotsLoading ? (
                      <div className="col-span-2 mt-6 flex justify-center"><Loader2 className="animate-spin text-gold-dark" size={18} /></div>
                    ) : (
                      TIMES.map((t) => {
                        const disabled = taken.includes(t) || slotPassed(t);
                        return (
                          <button
                            key={t}
                            disabled={disabled}
                            onClick={() => setTime(t)}
                            className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                              time === t
                                ? "border-gold bg-gold text-white"
                                : disabled
                                ? "cursor-not-allowed border-black/5 bg-black/[0.03] text-ink/25 line-through"
                                : "border-black/10 bg-white text-ink hover:border-gold hover:text-gold-dark"
                            }`}
                            data-testid={`time-slot-${t}`}
                          >
                            {label12(t)}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-black/5 px-8 py-4">
                <span className="text-xs text-ink/50">
                  {date && time ? `${prettyDate(date)} · ${label12(time)}` : "No time selected"}
                </span>
                <button
                  disabled={!date || !time}
                  onClick={() => setStep(2)}
                  className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-white shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  data-testid="booking-continue-button"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="border-b border-black/5 bg-[#FDFBF4] px-8 py-6">
                <button
                  onClick={() => setStep(1)}
                  className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink/55 transition-colors hover:text-gold-dark"
                  data-testid="booking-back-button"
                >
                  <ArrowLeft size={14} /> Change time
                </button>
                <div className="flex items-center gap-2 text-gold-dark">
                  <PhoneCall size={16} />
                  <span className="text-xs font-medium uppercase tracking-[0.2em]">Your Details</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">Almost there.</h3>
                <p className="mt-1 text-sm text-ink/55">
                  Booking for <span className="font-medium text-ink">{date && prettyDate(date)} at {label12(time)}</span>.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4 px-8 py-6" data-testid="booking-form">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink/70">Name *</label>
                    <input className={inputClass} value={form.name} onChange={update("name")} placeholder="Jane Smith" data-testid="booking-name-input" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink/70">Email *</label>
                    <input type="email" className={inputClass} value={form.email} onChange={update("email")} placeholder="jane@business.com" data-testid="booking-email-input" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink/70">Business *</label>
                  <input className={inputClass} value={form.business} onChange={update("business")} placeholder="Your business name" data-testid="booking-business-input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink/70">Interested in</label>
                  <select className={inputClass} value={form.service} onChange={update("service")} data-testid="booking-service-select">
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink/70">Message</label>
                  <textarea rows={2} className={`${inputClass} resize-none`} value={form.message} onChange={update("message")} placeholder="What would you like to achieve?" data-testid="booking-message-input" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-white shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(212,175,55,0.55)] disabled:opacity-60"
                  data-testid="booking-submit-button"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : null}
                  {loading ? "Confirming…" : "Confirm My Booking"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
