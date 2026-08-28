import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useBooking } from "../../context/BookingContext";

export const ContactCTA = () => {
  const { openBooking } = useBooking();
  return (
    <section id="contact" className="relative px-6 py-24 md:px-12 md:py-32" data-testid="contact-cta-section">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-20 text-center md:px-16 md:py-28">
            <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[130%] w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.28),_transparent_60%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light">
                Free Discovery Call
              </span>
              <h2 className="mx-auto mt-7 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
                Ready to Grow <span className="gold-text-gradient">Your Business?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                Book a free discovery call and find out how AI and a modern website can help your
                business attract more customers and save valuable time.
              </p>
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => openBooking()}
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-10 py-5 text-base font-medium text-white shadow-[0_8px_40px_rgba(212,175,55,0.45)] transition-shadow duration-300 hover:shadow-[0_12px_50px_rgba(212,175,55,0.7)]"
                data-testid="final-cta-book-call-button"
              >
                Book a Call
                <ArrowUpRight size={19} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
