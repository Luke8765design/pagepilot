import React from "react";
import { motion } from "framer-motion";

export const ResultsSection = () => (
  <section className="relative px-6 py-10 md:px-12" data-testid="results-section">
    <div className="mx-auto max-w-7xl">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-20 md:px-16 md:py-28">
        <div className="pointer-events-none absolute -right-1/4 top-0 h-[120%] w-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.22),_transparent_60%)]" />
        <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-gold-light">The Outcome</span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-xl font-display text-4xl font-black leading-[1.08] tracking-tight text-white md:text-5xl"
            >
              While your competitors miss calls, you're{" "}
              <span className="gold-text-gradient">fully booked.</span>
            </motion.h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
              Every enquiry answered in seconds. Every appointment captured. Every visitor met with a
              website that looks like you mean business — all running quietly in the background.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              ["Instant", "reply to every enquiry"],
              ["Nights & weekends", "always covered"],
              ["More", "appointments booked"],
              ["Less", "time on admin"],
            ].map(([big, small], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <p className="font-display text-xl font-bold text-white md:text-2xl">{big}</p>
                <p className="mt-1.5 text-sm text-white/50">{small}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
