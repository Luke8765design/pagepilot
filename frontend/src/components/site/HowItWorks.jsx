import React from "react";
import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./Reveal";

const steps = [
  { n: "01", title: "Book a Call", desc: "Grab a free discovery call at a time that suits you. No pressure, no obligation." },
  { n: "02", title: "Discuss Your Business", desc: "We learn how you work, where enquiries slip through, and what growth looks like for you." },
  { n: "03", title: "We Build Your Solution", desc: "Your AI tools and website are built, tuned and tested — done-for-you from start to finish." },
  { n: "04", title: "Watch Your Business Grow", desc: "More enquiries answered, more appointments booked, more time back in your day." },
];

export const HowItWorks = () => (
  <section className="relative py-24 md:py-32" data-testid="how-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <div className="max-w-2xl">
        <Reveal><Eyebrow>How It Works</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            From first call to real growth in four steps.
          </h2>
        </Reveal>
      </div>

      <div className="relative mt-20">
        <div className="absolute left-0 top-[2.1rem] hidden h-px w-full bg-black/5 md:block" />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="relative" data-testid={`step-${s.n}`}>
                <div className="mb-6 flex items-center gap-4 md:block">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-white font-display text-lg font-bold text-gold-dark shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
                  >
                    {s.n}
                  </motion.div>
                </div>
                <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
