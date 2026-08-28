import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Reveal, Eyebrow } from "./Reveal";
import { useBooking } from "../../context/BookingContext";

const faqs = [
  { q: "What businesses do you work with?", a: "We specialise in local service businesses — salons, clinics, trades, cafés, gyms, dentists and more. If you rely on enquiries and bookings, we can help." },
  { q: "How long does a website take?", a: "Most modern sites go live within one to two weeks, depending on the number of pages and content. We keep the process fast and done-for-you." },
  { q: "Can AI answer my phone?", a: "Yes. Our AI receptionists answer calls in a natural voice, handle FAQs and book appointments — so you never miss a customer, even after hours." },
  { q: "Can the chatbot book appointments?", a: "Absolutely. The chatbot can qualify enquiries, answer questions and book appointments straight into your calendar, 24/7." },
  { q: "Do you provide ongoing support?", a: "Always. Every plan includes ongoing support and updates. We stay in your corner long after launch to keep things running smoothly." },
  { q: "Can you redesign my existing website?", a: "Yes. We regularly rebuild dated sites into fast, modern, conversion-focused websites — often keeping your content and improving everything around it." },
  { q: "Is AI difficult to use?", a: "Not at all. We set everything up and tune it for your business. There's nothing to babysit — it simply works in the background." },
  { q: "How do I get started?", a: "Book a free discovery call. We'll learn about your business and recommend the right mix of AI and website to help you grow." },
];

export const FAQ = () => {
  const { openBooking } = useBooking();
  return (
    <section id="faq" className="relative bg-white py-24 md:py-32" data-testid="faq-section">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div className="text-center">
          <Reveal><Eyebrow className="justify-center">Questions</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
              Frequently asked questions.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-14" data-testid="faq-accordion">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-black/8">
                <AccordionTrigger
                  className="py-6 text-left font-display text-lg font-medium text-ink hover:no-underline [&[data-state=open]>svg]:text-gold-dark"
                  data-testid={`faq-trigger-${i}`}
                >
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-ink/60">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center">
            <p className="text-sm text-ink/50">Still have questions?</p>
            <button
              onClick={() => openBooking()}
              className="mt-3 inline-flex rounded-full border border-black/10 bg-white px-7 py-3 text-sm font-medium text-ink transition-all duration-300 hover:border-gold hover:-translate-y-0.5"
              data-testid="faq-book-call-button"
            >
              Book a Call
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
