import AboutSection from './_components/AboutSection';
import ContactSection from './_components/ContactSection';
import HeroSection from './_components/HeroSection';
import JourneySection from './_components/JourneySection';
import PortfolioSection from './_components/PortfolioSection';
import ServicesSection from './_components/ServicesSection';

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#0b0f11] text-[#e0e2e6] font-body">
      <div className="shader-bg" />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <JourneySection />
      <ContactSection />
    </main>
  );
}
