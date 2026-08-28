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
- Kinetic line-by-line hero reveal, parallax shapes, lenis smooth scroll, scroll-reveal animations
- Booking dialog → POST /api/bookings → MongoDB, success state + toast (verified via curl + UI)
- SEO meta (title, description, OG, robots), semantic sections, data-testids throughout
- Email notifications intentionally SKIPPED per user choice (bookings stored in DB only)

## Backlog / Remaining
- P1: Admin view to review submitted bookings
- P2: Email/Calendly integration for bookings
- P2: Testimonials / logos / case studies section
- P2: Blog or resources for SEO

## Next Tasks
- Optional admin dashboard for bookings; testimonials section; real contact details.
