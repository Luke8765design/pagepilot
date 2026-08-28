import React from "react";
import { motion } from "framer-motion";
import { Bot, PhoneCall, LayoutTemplate, ArrowUpRight, Check } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useBooking } from "../../context/BookingContext";

const services = [
  {
    id: "ai-chatbots",
    icon: Bot,
    title: "AI Chatbots",
    tagline: "Your fastest employee, live 24/7.",
    points: [
      "Answer questions instantly",
      "Capture and qualify leads",
      "Book appointments automatically",
      "Work around the clock",
      "Cut hours of admin time",
    ],
  },
  {
    id: "ai-receptionists",
    icon: PhoneCall,
    title: "AI Receptionists",
    tagline: "A voice agent that never misses a call.",
    points: [
      "Answer every call, day or night",
      "Book appointments by phone",
      "Handle common FAQs",
      "Never miss a customer again",
      "Save money on staffing",
    ],
  },
  {
    id: "website-design",
    icon: LayoutTemplate,
    title: "Website Design",
    tagline: "Sites built to turn visitors into customers.",
    points: [
      "Modern, premium design",
      "Mobile-friendly by default",
      "Fast-loading pages",
      "SEO-ready structure",
      "Conversion-focused layouts",
    ],
  },
];

export const Services = () => {
  const { openBooking } = useBooking();
  return (
    <section id="services" className="relative py-24 md:py-32" data-testid="services-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <Eyebrow>What We Build</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Three ways we help you win more customers.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-shadow duration-500 hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] md:p-10"
                data-testid={`service-card-${s.id}`}
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gold-light/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/25 bg-gold-light/20 text-gold-dark">
                  <s.icon size={24} strokeWidth={1.6} />
                </div>
                <h3 className="relative mt-7 font-display text-2xl font-bold text-ink">{s.title}</h3>
                <p className="relative mt-2 text-sm text-ink/50">{s.tagline}</p>
                <ul className="relative mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-ink/70">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold-dark" />
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openBooking(s.title)}
                  className="relative mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors duration-300 hover:text-gold-dark"
                  data-testid={`service-cta-${s.id}`}
                >
                  Book a Call
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
