# Page Pilot — Product Requirements Document

## Original Problem Statement
Build a premium, award-worthy marketing website for "Page Pilot", a digital agency helping local businesses grow with AI chatbots, AI receptionists and modern websites. Blend of Apple/Stripe/Vercel/Linear with a luxury white & gold palette. Main goal: convert visitors into booked discovery calls.

## Architecture
- **Frontend**: React 19 (CRA/craco), Tailwind, framer-motion (scroll reveals, kinetic hero), lenis (smooth momentum scroll), shadcn/ui (Dialog, Accordion), lucide-react icons, sonner toasts. Fonts: Cabinet Grotesk + Satoshi (Fontshare).
- **Backend**: FastAPI + MongoDB (motor). `/api/bookings` POST/GET stores discovery-call requests.
- **Design**: Luxury white/gold (#D4AF37) with black ink text; brand blue "Pilot" logo used as-is. Single-page site.

## User Personas
- Local business owner (café, salon, clinic, trades) seeking more leads and less admin.

## Core Requirements (static)
- Sticky glass nav with Book a Call CTA + smooth scroll
- Kinetic hero, marquee, services, why-choose-us, how-it-works, about manifesto, FAQ, final CTA, footer
- Book a Call form (name/email/business/service/message) stored in DB with confirmation

## Implemented (2026-06)
- Full one-page site with all required sections, responsive + mobile nav
- Kinetic hero, parallax, lenis smooth scroll, scroll reveals
- Calendar booking (date + time slot, past/Sundays disabled, taken slots greyed, 409 double-book guard) → MongoDB
- Live AI chatbot (GPT-5.4 Mini via Emergent key, streaming) — inline demo + floating widget
- Chat lead capture (name/email mid-conversation) → /api/leads + owner email alerts
- Email confirmations (Emergent-managed Resend): visitor confirmation + owner alerts to lukegray8765@gmail.com & pagepilot19@gmail.com
- New sections: StatsBand (count-up), IndustriesStrip, WebsiteShowcase (before/after image), ResultsSection (dark), Pricing (Starter/Growth/Complete, placeholder £X)
- Admin inbox at /admin (single passcode `pilot-2026-gold`): bookings + chat leads tables + Google Calendar connect card
- Google Calendar OAuth code fully implemented (server routes + admin connect) — INACTIVE until GOOGLE_CLIENT_ID/SECRET provided

## Backlog / Remaining
- P0: Add GOOGLE_CLIENT_ID/SECRET to activate calendar sync
- P1: Testimonials (deferred by user)
- P2: Real pricing numbers; edit contact details

## Next Tasks
- Optional admin dashboard for bookings; testimonials section; real contact details.
