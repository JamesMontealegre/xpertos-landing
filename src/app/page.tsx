import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Services } from "@/components/services";
import { WhyXpertos } from "@/components/why-xpertos";
import { WorkWithUs } from "@/components/work-with-us";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenido" className="flex-1">
        <Hero />
        <HowItWorks />
        <Services />
        <WhyXpertos />
        <WorkWithUs />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
