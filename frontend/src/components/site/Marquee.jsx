import React from "react";

const items = [
  "AI Chatbots",
  "AI Receptionists",
  "Website Design",
  "Lead Capture",
  "24/7 Support",
  "SEO Ready",
  "Conversion Focused",
];

export const Marquee = () => {
  const row = [...items, ...items];
  return (
    <div
      className="w-full overflow-hidden border-y border-black/5 bg-white py-8"
      data-testid="marquee"
    >
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((it, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl font-medium tracking-tight text-ink/80 md:text-3xl">
              {it}
            </span>
            <span className="text-gold">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
