import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/sections/hero-section'), {
  loading: () => (
    <section className="hero-section snap-section relative overflow-hidden bg-[#c5d5d8]" />
  ),
});
const OffersPreview = dynamic(() => import('@/components/sections/offers-preview'));
const DataPointsSection = dynamic(() => import('@/components/sections/data-points-section'));
const YourBodySection = dynamic(() => import('@/components/sections/your-body-section'));
const YourFutureSection = dynamic(() => import('@/components/sections/your-future-section'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <DataPointsSection /> */}
      <YourBodySection />
      <YourFutureSection />
      <OffersPreview />
      <FacilitiesSection />
    </>
  );
}
