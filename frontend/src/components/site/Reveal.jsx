import React from "react";
import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 24, className = "", as = "div" }) => {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};

export const Eyebrow = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-gold-dark ${className}`}
  >
    <span className="h-px w-8 bg-gold/60" />
    {children}
  </span>
);
