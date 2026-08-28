import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 24, suffix: "/7", label: "Enquiries answered, day & night" },
  { value: 100, suffix: "%", label: "Done-for-you setup" },
  { value: 2, prefix: "<", suffix: " wk", label: "Typical website turnaround" },
  { value: 0, suffix: "", label: "Missed calls with an AI receptionist", zeroLabel: "Zero" },
];

const Counter = ({ value, prefix = "", suffix = "", zeroLabel }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (value === 0) return;
    let raf;
    const start = performance.now();
    const dur = 1200;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref}>
      {value === 0 ? zeroLabel : `${prefix}${n}${suffix}`}
    </span>
  );
};

export const StatsBand = () => (
  <section className="relative border-y border-black/5 bg-white" data-testid="stats-band">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 py-14 md:grid-cols-4 md:px-12">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6 }}
          className="flex flex-col items-center border-black/5 text-center md:[&:not(:last-child)]:border-r"
          data-testid={`stat-${i}`}
        >
          <span className="font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} zeroLabel={s.zeroLabel} />
          </span>
          <span className="mt-2 max-w-[12rem] text-xs text-ink/50 md:text-sm">{s.label}</span>
        </motion.div>
      ))}
    </div>
  </section>
);
