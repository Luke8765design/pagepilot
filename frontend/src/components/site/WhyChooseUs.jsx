import React from "react";
import { motion } from "framer-motion";
import { BadgePoundSterling, Zap, MapPin, Cpu, Smartphone, LifeBuoy, HeartHandshake, TrendingUp } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";

const items = [
  { icon: BadgePoundSterling, title: "Affordable Pricing", desc: "Premium results without the enterprise price tag." },
  { icon: Zap, title: "Fast Turnaround", desc: "Live in days, not months of back-and-forth." },
  { icon: MapPin, title: "Local Specialists", desc: "We understand how local businesses actually grow." },
  { icon: Cpu, title: "Modern AI Solutions", desc: "The latest AI, set up and tuned for your business." },
  { icon: Smartphone, title: "Mobile-First Websites", desc: "Flawless on every phone, tablet and screen." },
  { icon: LifeBuoy, title: "Ongoing Support", desc: "We stay in your corner long after launch." },
  { icon: HeartHandshake, title: "Friendly Service", desc: "Real people, plain language, zero jargon." },
  { icon: TrendingUp, title: "Built for Growth", desc: "Everything designed to bring in more customers." },
];

export const WhyChooseUs = () => (
  <section className="relative bg-white py-24 md:py-32" data-testid="why-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <div className="max-w-2xl">
        <Reveal><Eyebrow>Why Page Pilot</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            The reasons local businesses choose us.
          </h2>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={(i % 4) * 0.06}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35 }}
              className="group h-full bg-white p-8 transition-colors duration-300 hover:bg-[#FDFBF4]"
              data-testid={`why-card-${i}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-light/25 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-white">
                <it.icon size={20} strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{it.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
