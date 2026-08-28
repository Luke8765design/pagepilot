import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-black/5 bg-white/80 backdrop-blur-xl py-3"
          : "border-b border-transparent bg-transparent py-5"
      }`}
      data-testid="site-header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
        <button
          onClick={() => go("#home")}
          className="flex items-center gap-2.5"
          data-testid="logo-button"
        >
          <img src="/pilot-logo.png" alt="Page Pilot" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            Page<span className="text-ink"> Pilot</span>
          </span>
        </button>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="relative text-sm font-medium text-ink/70 transition-colors duration-300 hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              data-testid={`nav-${l.label.toLowerCase()}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openBooking()}
            className="hidden rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_26px_rgba(212,175,55,0.55)] md:inline-flex"
            data-testid="nav-book-call-button"
          >
            Book a Call
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ink md:hidden"
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="py-3 text-left text-base font-medium text-ink/80"
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileOpen(false); openBooking(); }}
                className="mt-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-white"
                data-testid="mobile-book-call-button"
              >
                Book a Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
