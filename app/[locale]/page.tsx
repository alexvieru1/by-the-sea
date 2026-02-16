import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/hero-section';
import OffersPreview from '@/components/sections/offers-preview';

const DataPointsSection = dynamic(() => import('@/components/sections/data-points-section'));
const YourBodySection = dynamic(() => import('@/components/sections/your-body-section'));
const YourFutureSection = dynamic(() => import('@/components/sections/your-future-section'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));

export default function Home() {
  return (
    <>
      <HeroSection />
      <DataPointsSection />
      <OffersPreview />
      <YourBodySection />
      <YourFutureSection />
      <FacilitiesSection />
    </>
  );
}
