import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/sections/hero-section'), {
  loading: () => (
    <section className="hero-section snap-section relative overflow-hidden bg-[#c5d5d8]" />
  ),
});
const EndometriosisSection = dynamic(() => import('@/components/sections/endometriosis-section'));
const LongevitySection = dynamic(() => import('@/components/sections/longevity-section'));
const FertilitySection = dynamic(() => import('@/components/sections/fertility-section'));
const TherapiesPreview = dynamic(() => import('@/components/sections/therapies-preview'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));

export default function Home() {
  return (
    <>
      <HeroSection />
      <EndometriosisSection />
      <LongevitySection />
      <FertilitySection />
      <TherapiesPreview />
      <FacilitiesSection />
    </>
  );
}
