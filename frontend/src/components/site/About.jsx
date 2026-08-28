import React from "react";
import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./Reveal";
import { useBooking } from "../../context/BookingContext";

const manifesto = [
  {
    n: "1",
    title: "Local business deserves a big-league presence.",
    body: "You compete with national brands every day. We give you the same modern websites and AI tools they use — priced for a local budget, built for a local audience.",
  },
  {
    n: "2",
    title: "Every enquiry is a customer worth keeping.",
    body: "A missed call or an ignored message is lost revenue. Our AI answers instantly, day and night, so no opportunity ever slips away.",
  },
  {
    n: "3",
    title: "Technology should feel effortless.",
    body: "No dashboards to babysit, no jargon to decode. We set everything up, tune it to your business and support you the whole way — you just watch it work.",
  },
];

export const About = () => {
  const { openBooking } = useBooking();
  return (
    <section id="about" className="relative bg-white py-24 md:py-32" data-testid="about-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal><Eyebrow>About Page Pilot</Eyebrow></Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
                  A modern agency in your corner.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-base leading-relaxed text-ink/60">
                  Page Pilot helps local businesses compete with the big players using affordable AI
                  and exceptional websites. Confident, friendly, and relentlessly focused on your growth.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 overflow-hidden rounded-2xl border border-black/5">
                  <img
                    src="https://images.unsplash.com/photo-1753351052363-53ce102830eb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsb2NhbCUyMGJ1c2luZXNzJTIwb3duZXIlMjBjb2ZmZWUlMjBzaG9wfGVufDB8fHx8MTc4NzkwOTE5NHww&ixlib=rb-4.1.0&q=85"
                    alt="Local business owner"
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8 lg:pl-8">
            <div className="space-y-14">
              {manifesto.map((m, i) => (
                <Reveal key={m.n} delay={i * 0.08}>
                  <div className="flex gap-6 border-b border-black/5 pb-14 last:border-0 md:gap-10" data-testid={`manifesto-${m.n}`}>
                    <span className="font-display text-5xl font-black leading-none text-black/10 md:text-7xl">
                      {m.n}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold leading-snug text-ink md:text-3xl">
                        {m.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/60">{m.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => openBooking()}
                  className="inline-flex items-center gap-2 font-display text-lg font-bold text-ink"
                  data-testid="about-book-call-button"
                >
                  Let's build yours <span className="text-gold-dark">→</span>
                </motion.button>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
