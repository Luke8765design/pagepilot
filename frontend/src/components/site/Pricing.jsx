import React from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useBooking } from "../../context/BookingContext";

const tiers = [
  {
    name: "Starter",
    price: "£X",
    period: "/mo",
    tagline: "A modern website that wins trust.",
    features: [
      "Modern, mobile-first website",
      "Fast-loading & SEO-ready",
      "Lead enquiry form",
      "Ongoing support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "£X",
    period: "/mo",
    tagline: "Website + AI chatbot working 24/7.",
    features: [
      "Everything in Starter",
      "Custom AI chatbot",
      "Lead capture & appointment booking",
      "24/7 instant replies",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Complete",
    price: "£X",
    period: "/mo",
    tagline: "The full AI front desk for your business.",
    features: [
      "Everything in Growth",
      "AI phone receptionist",
      "Call handling & FAQs",
      "Calendar & booking sync",
      "Dedicated account manager",
    ],
    highlight: false,
  },
];

export const Pricing = () => {
  const { openBooking } = useBooking();
  return (
    <section id="pricing" className="relative py-24 md:py-32" data-testid="pricing-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><Eyebrow className="justify-center">Simple Pricing</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
              Premium results, priced for local business.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-ink/55">
              Every business is different, so we tailor a plan to yours. Book a free call for an exact quote.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex h-full flex-col rounded-3xl p-8 transition-shadow duration-500 md:p-10 ${
                  t.highlight
                    ? "border-2 border-gold bg-white shadow-[0_20px_50px_rgba(212,175,55,0.18)]"
                    : "border border-black/8 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
                }`}
                data-testid={`pricing-tier-${t.name.toLowerCase()}`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-medium text-white shadow">
                    <Star size={12} className="fill-white" /> Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-ink">{t.name}</h3>
                <p className="mt-1.5 text-sm text-ink/50">{t.tagline}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-xs text-ink/45">from</span>
                  <span className="font-display text-4xl font-black tracking-tight text-ink">{t.price}</span>
                  <span className="mb-1 text-sm text-ink/50">{t.period}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink/70">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold-dark" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openBooking()}
                  className={`mt-8 w-full rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                    t.highlight
                      ? "bg-gold text-white shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                      : "border border-black/10 bg-white text-ink hover:border-gold"
                  }`}
                  data-testid={`pricing-cta-${t.name.toLowerCase()}`}
                >
                  Book a Call for a Quote
                </button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
