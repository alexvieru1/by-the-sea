import HeroSection from '@/components/sections/hero-section';
import DataPointsSection from '@/components/sections/data-points-section';
import YourBodySection from '@/components/sections/your-body-section';
import YourFutureSection from '@/components/sections/your-future-section';
import FacilitiesSection from '@/components/sections/facilities-section';
import FooterSection from '@/components/sections/footer-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <DataPointsSection />
      <YourBodySection />
      <YourFutureSection />
      <FacilitiesSection />
      <FooterSection />
    </main>
  );
}
