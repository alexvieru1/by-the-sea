import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/hero-section';

const DataPointsSection = dynamic(() => import('@/components/sections/data-points-section'));
const YourBodySection = dynamic(() => import('@/components/sections/your-body-section'));
const YourFutureSection = dynamic(() => import('@/components/sections/your-future-section'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));
const FooterSection = dynamic(() => import('@/components/sections/footer-section'));

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
