import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useBooking } from "../../context/BookingContext";

const IMG = "https://static.prod-images.emergentagent.com/jobs/fc2e1dcb-3c12-4148-b13f-88e424639a44/images/8554d0468b33db2eecb0776d2ada9eb7dc4a9b86180a5ceb5748cba89683fdec.jpeg";

export const WebsiteShowcase = () => {
  const { openBooking } = useBooking();
  return (
    <section className="relative bg-white py-24 md:py-32" data-testid="showcase-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal><Eyebrow>The Difference</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
                From dated and ignored to modern and booked.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
                Most local websites quietly turn customers away. We rebuild them into fast,
                mobile-first experiences designed to load instantly, rank on Google and turn
                visitors into booked appointments.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/5 pt-6">
                {[["3×", "faster load"], ["+40%", "more enquiries"], ["100%", "mobile-ready"]].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl font-bold text-gold-dark">{n}</p>
                    <p className="mt-1 text-xs text-ink/50">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <button
                onClick={() => openBooking("Website Design")}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                data-testid="showcase-book-call-button"
              >
                See what yours could look like
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-3xl border border-black/5 bg-[#FAFAFA] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              <img
                src={IMG}
                alt="Website redesign before and after comparison"
                className="w-full rounded-2xl"
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
