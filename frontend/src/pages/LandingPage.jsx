import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import {
  ArrowRight,
  CalendarCheck2,
  CarFront,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const services = [
  {
    name: "Exterior Detailing",
    duration: "2–3 hrs",
    price: "$135+",
    description:
      "A deep hand wash, wheel and tire detailing, decontamination, and a finish-safe paint refresh that restores shine and adds a polished look.",
  },
  {
    name: "Interior Detailing",
    duration: "2–4 hrs",
    price: "$160+",
    description:
      "Vacuuming, surface cleaning, leather or fabric care, glass treatment, and finishing touches for a cleaner, more comfortable cabin.",
  },
  {
    name: "Full Detail",
    duration: "4–6 hrs",
    price: "$285+",
    description:
      "A combined interior and exterior service that addresses the complete vehicle, with a balanced finish for daily use and special occasions.",
  },
  {
    name: "Paint Correction",
    duration: "1–2 days",
    price: "$450+",
    description:
      "Multi-stage paint refinement to reduce swirl marks, fine scratches, and surface haze, helping the finish look more consistent and refined.",
  },
  {
    name: "Ceramic Coating",
    duration: "1–2 days",
    price: "$650+",
    description:
      "A protective ceramic layer that helps water bead, makes routine care easier, and supports long-term surface protection with proper maintenance.",
  },
];

const processSteps = [
  { title: "Choose a service", text: "Select the level of care that matches your vehicle and routine." },
  { title: "Request a time", text: "Share your details and preferred date so we can review your request." },
  { title: "Bring in the vehicle", text: "Drop off your car and we’ll work through the selected package." },
  { title: "Collect a freshly detailed car", text: "Pick up a cleaned, refreshed, and protected vehicle ready for the road." },
];

const benefits = [
  "Remove built-up dirt, dust, and road debris from surfaces and trim.",
  "Improve cabin comfort with cleaner seats, mats, glass, and touch points.",
  "Restore a more polished look to paint, metalwork, and high-traffic areas.",
  "Support long-term surface care with protective finishes and maintenance routines.",
];

const faqs = [
  {
    q: "How long does detailing usually take?",
    a: "Most services range from a few hours to a full day depending on the vehicle’s size, condition, and the package selected. Paint correction and ceramic coating typically take longer than standard detailing.",
  },
  {
    q: "What should I remove from the vehicle before drop-off?",
    a: "It helps to remove personal items, valuables, and anything fragile from the cabin and trunk so the detail can be completed cleanly and efficiently.",
  },
  {
    q: "How often should I book a detail?",
    a: "A maintenance detail is often booked every few months, while heavily used vehicles or seasonal changes may call for more frequent visits. The right schedule depends on how often the vehicle is driven and the condition of the surfaces.",
  },
  {
    q: "What is paint correction?",
    a: "Paint correction is a machine-assisted refinement process used to reduce visible swirl marks, haze, and minor imperfections so the finish appears more uniform and glossy.",
  },
  {
    q: "What does a ceramic coating do?",
    a: "A ceramic coating adds a durable layer that helps repel water, reduces the immediate impact of contaminants, and supports easier maintenance between washes. It is a protective step, not a substitute for regular cleaning.",
  },
  {
    q: "What happens if weather affects an appointment?",
    a: "If weather or severe conditions affect the appointment, we’ll contact you to reschedule or adjust timing as needed. We focus on safe, practical scheduling for both the vehicle and the detailing process.",
  },
];

const defaultForm = {
  name: "",
  emailPhone: "",
  vehicle: "",
  service: "",
  date: "",
  notes: "",
};

export default function LandingPage() {
  const heroStageRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [galleryReveal, setGalleryReveal] = useState(52);
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!heroStageRef.current || reduceMotion) return;

    const onScroll = () => {
      const shift = Math.min(window.scrollY * 0.12, 36);
      heroStageRef.current.style.setProperty("--scroll-shift", `${shift}px`);
      heroStageRef.current.style.setProperty("--glow-shift", `${Math.min(window.scrollY * 0.05, 14)}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePointerMove = (event) => {
    const stage = heroStageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const rotateY = x * 16;
    const rotateX = y * -12;

    stage.style.setProperty("--tilt-x", `${rotateX}deg`);
    stage.style.setProperty("--tilt-y", `${rotateY}deg`);
  };

  const handlePointerLeave = () => {
    const stage = heroStageRef.current;
    if (!stage) return;
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormSuccess(false);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Please enter your name.";

    const contact = formData.emailPhone.trim();
    if (!contact) {
      nextErrors.emailPhone = "Please provide an email address or phone number.";
    } else {
      const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      const looksLikePhone = /^[+()\d\s-]{7,}$/.test(contact);
      if (!looksLikeEmail && !looksLikePhone) {
        nextErrors.emailPhone = "Please enter a valid email or phone number.";
      }
    }

    if (!formData.vehicle.trim()) nextErrors.vehicle = "Please include the vehicle make and model.";
    if (!formData.service) nextErrors.service = "Please choose a service.";
    if (!formData.date) nextErrors.date = "Please choose a preferred date.";

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormSuccess(false);
      return;
    }

    setErrors({});
    setFormSuccess(true);
    setFormData(defaultForm);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-shell">
          <button className="wordmark" type="button" onClick={() => scrollToSection("top")} aria-label="Back to top">
            Car Detailing
          </button>

          <nav className={`header-nav ${mobileMenuOpen ? "open" : ""}`} aria-label="Main navigation">
            <button type="button" onClick={() => scrollToSection("services")}>
              Services
            </button>
            <button type="button" onClick={() => scrollToSection("process")}>
              Process
            </button>
            <button type="button" onClick={() => scrollToSection("gallery")}>
              Gallery
            </button>
            <button type="button" onClick={() => scrollToSection("faqs")}>
              FAQs
            </button>
          </nav>

          <div className="header-actions">
            <button type="button" className="primary-cta compact" onClick={() => scrollToSection("appointment")}>
              Book Now
            </button>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="site-main">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Premium vehicle care</span>
            <h1>A deeper clean. A better drive.</h1>
            <p>
              Professional detailing restores and protects a vehicle’s interior and exterior, helping it look cleaner,
              feel more refined, and stay easier to maintain.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-cta" onClick={() => scrollToSection("services")}>
                Explore Services <ArrowRight size={18} />
              </button>
              <button type="button" className="secondary-cta" onClick={() => scrollToSection("appointment")}>
                Request an Appointment
              </button>
            </div>
            <ul className="hero-meta" aria-label="Key benefits">
              <li>
                <Sparkles size={14} />
                Interior &amp; exterior care
              </li>
              <li>
                <ShieldCheck size={14} />
                Surface protection focus
              </li>
            </ul>
          </div>

          <div className="hero-stage-wrap">
            <div
              ref={heroStageRef}
              className="hero-stage"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              aria-label="3D studio hero with a polished car"
            >
              <div className="studio-halo" />
              <div className="studio-light light-left" />
              <div className="studio-light light-right" />
              <div className="hero-floor" />
              <div className="hero-car" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="service-section" id="services">
          <div className="section-heading">
            <span className="eyebrow">Services</span>
            <h2>Tailored care for daily use and weekend drives.</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article key={service.name} className="service-card">
                <div className="card-topline">
                  <span className="service-name">{service.name}</span>
                  <span className="service-price">Sample price: {service.price}</span>
                </div>
                <p>{service.description}</p>
                <div className="card-meta">
                  <span>
                    <Clock3 size={14} />
                    {service.duration}
                  </span>
                  <button type="button" onClick={() => scrollToSection("appointment")}>
                    Book now <ChevronRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-heading narrow">
            <span className="eyebrow">Gallery</span>
            <h2>See the difference a careful detail can make.</h2>
          </div>

          <div className="comparison-panel" role="img" aria-label="Before and after comparison slider for a vehicle detail">
            <div className="comparison-track">
              <div className="compare-layer before-layer" />
              <div className="compare-layer after-layer" style={{ width: `${galleryReveal}%` }} />
              <div className="compare-divider" style={{ left: `${galleryReveal}%` }}>
                <span>Before</span>
                <span>After</span>
              </div>
            </div>
            <input
              aria-label="Adjust before and after comparison"
              type="range"
              min="0"
              max="100"
              value={galleryReveal}
              onChange={(event) => setGalleryReveal(Number(event.target.value))}
            />
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="section-heading">
            <span className="eyebrow">Process</span>
            <h2>Simple steps from request to pickup.</h2>
          </div>

          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div key={step.title} className="process-card">
                <div className="step-number">0{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="benefits-section" id="why-professional-detailing">
          <div className="section-heading narrow">
            <span className="eyebrow">Why professional detailing</span>
            <h2>Thoughtful care for the surfaces you live with every day.</h2>
          </div>

          <div className="benefits-layout">
            <div className="benefits-copy">
              {benefits.map((benefit) => (
                <div key={benefit} className="benefit-item">
                  <span className="benefit-bullet">
                    <CarFront size={16} />
                  </span>
                  <p>{benefit}</p>
                </div>
              ))}
            </div>

            <div className="benefits-visual" aria-hidden="true">
              <div className="detail-surface" />
            </div>
          </div>
        </section>

        <section className="appointment-section" id="appointment">
          <div className="section-heading narrow">
            <span className="eyebrow">Appointment request</span>
            <h2>Tell us about your vehicle and preferred timing.</h2>
          </div>

          <div className="appointment-layout">
            <div className="appointment-panel form-panel">
              <form onSubmit={handleSubmit} noValidate>
                <div className="field-grid">
                  <div className="field-wrap">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <small>{errors.name}</small>}
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="emailPhone">Email or phone</label>
                    <input
                      id="emailPhone"
                      name="emailPhone"
                      type="text"
                      value={formData.emailPhone}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.emailPhone)}
                    />
                    {errors.emailPhone && <small>{errors.emailPhone}</small>}
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="vehicle">Vehicle make &amp; model</label>
                    <input
                      id="vehicle"
                      name="vehicle"
                      type="text"
                      value={formData.vehicle}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.vehicle)}
                    />
                    {errors.vehicle && <small>{errors.vehicle}</small>}
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="service">Desired service</label>
                    <select id="service" name="service" value={formData.service} onChange={handleChange} aria-invalid={Boolean(errors.service)}>
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.service && <small>{errors.service}</small>}
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="date">Preferred date</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.date)}
                    />
                    {errors.date && <small>{errors.date}</small>}
                  </div>

                  <div className="field-wrap field-wide">
                    <label htmlFor="notes">Extra notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="4"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Let us know what needs attention, your timeline, or anything else we should know."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-cta wide">
                    Request an appointment
                  </button>
                  <p className="privacy-note">We only use this information to review your request and respond to your appointment enquiry.</p>
                </div>

                {formSuccess && (
                  <div className="success-toast" aria-live="polite">
                    <CalendarCheck2 size={18} />
                    Thanks — your request has been received. We will review it and follow up soon.
                  </div>
                )}
              </form>
            </div>

            <aside className="appointment-panel details-panel" aria-label="Booking guidance and service note">
              <div className="mini-card highlight">
                <span className="eyebrow smaller">Before you arrive</span>
                <h3>Helpful prep</h3>
                <ul>
                  <li>Remove personal items and valuables from the cabin and trunk.</li>
                  <li>Let us know about any paint concerns or interior materials you want us to focus on.</li>
                  <li>Bring your preferred date or timeline if you need a quicker turnaround.</li>
                </ul>
              </div>
              <div className="mini-card">
                <span className="eyebrow smaller">Sample pricing</span>
                <p>Rates are sample starting points and can be adjusted based on vehicle size, condition, and finish requirements.</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="faq-section" id="faqs">
          <div className="section-heading narrow">
            <span className="eyebrow">FAQs</span>
            <h2>Common questions before booking.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span>{item.q}</span>
                    <span className="faq-plus">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <p>{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-shell">
          <div className="footer-brand-block">
            <div className="wordmark small">Car Detailing</div>
            <p>Professional detailing for drivers who want a cleaner cabin, better surface care, and a more polished finish.</p>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li>
                <Mail size={15} />
                Email: add your email
              </li>
              <li>
                <MapPin size={15} />
                Location: add your city and region
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Hours</h3>
            <ul>
              <li>Mon–Fri: add your hours</li>
              <li>Sat–Sun: add your hours</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>More</h3>
            <ul>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Car Detailing</span>
          <button type="button" className="primary-cta compact" onClick={() => scrollToSection("appointment")}>
            Request an Appointment
          </button>
        </div>
      </footer>
    </>
  );
}
