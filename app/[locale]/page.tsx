import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';

const HeroSection = dynamic(() => import('@/components/sections/hero-section'), {
  loading: () => (
    <section className="hero-section snap-section relative overflow-hidden bg-[#c5d5d8]" />
  ),
});
const MedicalRehabilitationSection = dynamic(() => import('@/components/sections/medical-rehabilitation-section'));
const EndometriosisSection = dynamic(() => import('@/components/sections/endometriosis-section'));
const LongevitySection = dynamic(() => import('@/components/sections/longevity-section'));
const TherapiesPreview = dynamic(() => import('@/components/sections/therapies-preview'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <MedicalRehabilitationSection />
      <EndometriosisSection />
      <LongevitySection />
      <TherapiesPreview />
      <FacilitiesSection />
    </>
  );
}
