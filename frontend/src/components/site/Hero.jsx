import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

const lines = ["AI That Works", "While You Sleep."];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const lineWrap = { hidden: {}, show: {} };
const lineVariant = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const Hero = () => {
  const { openBooking } = useBooking();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 25]);

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden pt-28 pb-20"
      data-testid="hero-section"
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.10),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <motion.div
          style={{ y: y1, rotate: rot }}
          className="absolute -right-10 top-24 h-72 w-72 rounded-[3rem] border border-gold/25 bg-gradient-to-br from-gold-light/40 to-transparent backdrop-blur-sm md:right-24"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute -left-8 bottom-24 h-40 w-40 rounded-full border border-black/5 bg-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:left-24"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <motion.div variants={fadeUp} className="mb-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/70 px-4 py-1.5 text-xs font-medium text-gold-dark backdrop-blur-md">
            <Sparkles size={13} className="text-gold" />
            AI & Modern Websites for Local Business
          </span>
        </motion.div>

        <h1 className="font-display text-5xl font-black leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[5.5rem]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden py-1">
              <motion.span variants={lineWrap} className="block">
                <motion.span variants={lineVariant} className="inline-block">
                  {i === 1 ? (
                    <span>
                      While You <span className="text-ink">Sleep.</span>
                    </span>
                  ) : (
                    line
                  )}
                </motion.span>
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-2xl text-base text-ink/60 md:text-lg"
        >
          Affordable AI chatbots, AI receptionists and stunning websites that help local
          businesses win more customers, answer enquiries 24/7 and grow faster.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => openBooking()}
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-white shadow-[0_4px_24px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)]"
            data-testid="hero-book-call-button"
          >
            Book a Call
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            onClick={() => scrollTo("#services")}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-medium text-ink transition-all duration-300 hover:border-gold hover:-translate-y-0.5"
            data-testid="hero-view-services-button"
          >
            View Services
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-14 flex items-center gap-8 text-xs text-ink/40">
          <span>24/7 Response</span>
          <span className="h-3 w-px bg-black/10" />
          <span>Local Specialists</span>
          <span className="h-3 w-px bg-black/10" />
          <span>Fast Turnaround</span>
        </motion.div>
      </motion.div>
    </section>
  );
};
