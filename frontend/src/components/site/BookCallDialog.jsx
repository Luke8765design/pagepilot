import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useBooking } from "../../context/BookingContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const services = ["AI Chatbots", "AI Receptionists", "Website Design", "Not sure yet"];

const empty = { name: "", email: "", business: "", service: "", message: "" };

const inputClass =
  "w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink/35 focus:border-gold focus:ring-2 focus:ring-gold/40";

export const BookCallDialog = () => {
  const { open, setOpen, presetService } = useBooking();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setForm({ ...empty, service: presetService || "" });
    }
  }, [open, presetService]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
        message: form.message || null,
      });
      setSuccess(true);
      toast.success("Call request received — we'll be in touch shortly.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
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
              <h3 className="mt-6 font-display text-2xl font-bold text-ink">You're all set.</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/55">
                Thanks, {form.name.split(" ")[0] || "there"}. We've received your request and will
                reach out shortly to book your free discovery call.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-8 rounded-full bg-ink px-8 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                data-testid="booking-close-button"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="border-b border-black/5 bg-[#FDFBF4] px-8 py-7">
                <div className="flex items-center gap-2 text-gold-dark">
                  <PhoneCall size={16} />
                  <span className="text-xs font-medium uppercase tracking-[0.2em]">Book a Call</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                  Let's grow your business.
                </h3>
                <p className="mt-1.5 text-sm text-ink/55">
                  Tell us a little about you — we'll set up your free discovery call.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4 px-8 py-7" data-testid="booking-form">
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
                  <textarea rows={3} className={`${inputClass} resize-none`} value={form.message} onChange={update("message")} placeholder="What would you like to achieve?" data-testid="booking-message-input" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-white shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(212,175,55,0.55)] disabled:opacity-60"
                  data-testid="booking-submit-button"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : null}
                  {loading ? "Sending…" : "Request My Free Call"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
