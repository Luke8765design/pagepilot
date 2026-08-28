import React from "react";
import { Reveal, Eyebrow } from "./Reveal";
import { ChatConversation } from "./ChatConversation";

export const ChatDemo = () => (
  <section id="demo" className="relative py-24 md:py-32" data-testid="chat-demo-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal><Eyebrow>Try It Live</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
              Meet Pilot. Chat with our AI right now.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
              This is the same kind of assistant we build for local businesses. Ask it about our
              services, how AI could work for you, or what happens after you book a call — and see
              how naturally it responds, 24/7.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3 text-sm text-ink/70">
              {["Answers instantly, day or night", "Captures leads while you sleep", "Books calls and handles FAQs"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ChatConversation variant="inline" />
        </Reveal>
      </div>
    </div>
  </section>
);
