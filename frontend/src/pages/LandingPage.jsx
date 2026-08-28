import { useEffect } from "react";
import Lenis from "lenis";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { StatsBand } from "@/components/site/StatsBand";
import { IndustriesStrip } from "@/components/site/IndustriesStrip";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { WebsiteShowcase } from "@/components/site/WebsiteShowcase";
import { ChatDemo } from "@/components/site/ChatDemo";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { ResultsSection } from "@/components/site/ResultsSection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Pricing } from "@/components/site/Pricing";
import { About } from "@/components/site/About";
import { FAQ } from "@/components/site/FAQ";
import { ContactCTA } from "@/components/site/ContactCTA";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";

export default function LandingPage() {
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

  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBand />
        <IndustriesStrip />
        <Marquee />
        <Services />
        <WebsiteShowcase />
        <ChatDemo />
        <WhyChooseUs />
        <ResultsSection />
        <HowItWorks />
        <Pricing />
        <About />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
