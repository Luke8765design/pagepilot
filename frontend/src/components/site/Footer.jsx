import React from "react";
import { Linkedin, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

const cols = [
  {
    heading: "Navigation",
    links: [
      { label: "Home", href: "#home" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "AI Chatbots", href: "#services" },
      { label: "AI Receptionists", href: "#services" },
      { label: "Website Design", href: "#services" },
    ],
  },
];

const socials = [Linkedin, Instagram, Facebook, Twitter];

export const Footer = () => {
  const { openBooking } = useBooking();
  const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="border-t border-black/8 bg-white" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/pilot-logo.png" alt="Page Pilot" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                Page<span className="text-gold-dark"> Pilot</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/55">
              Helping local businesses grow with affordable AI and modern websites that work 24/7.
            </p>
            <button
              onClick={() => openBooking()}
              className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
              data-testid="footer-book-call-button"
            >
              Book a Call
            </button>
          </div>

          {cols.map((c) => (
            <div key={c.heading}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">{c.heading}</h4>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => go(l.href)}
                      className="text-sm text-ink/55 transition-colors duration-300 hover:text-gold-dark"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-ink/55">
              <li className="flex items-center gap-2"><Mail size={15} className="text-gold-dark" /> <a href="mailto:pagepilot19@gmail.com" className="transition-colors hover:text-ink">pagepilot19@gmail.com</a></li>
              <li className="flex items-center gap-2"><Phone size={15} className="text-gold-dark" /> <a href="tel:+447419581132" className="transition-colors hover:text-ink">+44 7419 581132</a></li>
              <li className="flex items-center gap-2"><MapPin size={15} className="text-gold-dark" /> Glasgow, UK</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-black/8 pt-8 md:flex-row">
          <p className="text-xs text-ink/40">© {new Date().getFullYear()} Page Pilot. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socials.map((S, i) => (
              <a
                key={i}
                href="#home"
                onClick={(e) => { e.preventDefault(); go("#home"); }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink/60 transition-all duration-300 hover:border-gold hover:text-gold-dark"
                aria-label="Social link"
                data-testid={`footer-social-${i}`}
              >
                <S size={16} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6 text-xs text-ink/40">
            <a href="#home" onClick={(e) => { e.preventDefault(); go("#home"); }} className="transition-colors hover:text-ink">Privacy Policy</a>
            <a href="#home" onClick={(e) => { e.preventDefault(); go("#home"); }} className="transition-colors hover:text-ink">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
