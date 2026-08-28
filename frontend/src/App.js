import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { BookingProvider } from "@/context/BookingContext";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { ChatDemo } from "@/components/site/ChatDemo";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { HowItWorks } from "@/components/site/HowItWorks";
import { About } from "@/components/site/About";
import { FAQ } from "@/components/site/FAQ";
import { ContactCTA } from "@/components/site/ContactCTA";
import { Footer } from "@/components/site/Footer";
import { BookCallDialog } from "@/components/site/BookCallDialog";
import { ChatWidget } from "@/components/site/ChatWidget";

function App() {
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
    <div className="App">
      <BookingProvider>
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <ChatDemo />
          <WhyChooseUs />
          <HowItWorks />
          <About />
          <FAQ />
          <ContactCTA />
        </main>
        <Footer />
        <BookCallDialog />
        <ChatWidget />
        <Toaster position="top-center" richColors />
      </BookingProvider>
    </div>
  );
}

export default App;
