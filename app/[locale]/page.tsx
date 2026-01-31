import HeroSection from '@/components/sections/hero-section';
import DataPointsSection from '@/components/sections/data-points-section';
import YourBodySection from '@/components/sections/your-body-section';
import YourFutureSection from '@/components/sections/your-future-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <DataPointsSection />
      <YourBodySection />
      <YourFutureSection />
    </main>
  );
}
