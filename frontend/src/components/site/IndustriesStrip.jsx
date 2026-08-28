import React from "react";
import { Scissors, Stethoscope, Coffee, Wrench, Dumbbell, Utensils, Home, Car } from "lucide-react";
import { Reveal } from "./Reveal";

const industries = [
  { icon: Scissors, label: "Salons" },
  { icon: Stethoscope, label: "Clinics" },
  { icon: Coffee, label: "Cafés" },
  { icon: Wrench, label: "Trades" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: Utensils, label: "Restaurants" },
  { icon: Home, label: "Estate Agents" },
  { icon: Car, label: "Garages" },
];

export const IndustriesStrip = () => (
  <section className="relative py-16 md:py-20" data-testid="industries-strip">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <Reveal>
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-ink/40">
          Built for local businesses across every trade
        </p>
      </Reveal>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
        {industries.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.04}>
            <div className="group flex items-center gap-2.5 text-ink/45 transition-colors duration-300 hover:text-ink">
              <it.icon size={22} strokeWidth={1.5} className="transition-colors duration-300 group-hover:text-gold-dark" />
              <span className="font-display text-lg font-medium tracking-tight md:text-xl">{it.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
