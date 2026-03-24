import dynamic from 'next/dynamic';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.about' });
  return {
    title: { absolute: 'Vraja Mării by the Sea — Recuperare Medicală & Wellness' },
    description: t('description'),
  };
}

const HeroSection = dynamic(() => import('@/components/sections/hero-section'), {
  loading: () => (
    <section className="hero-section snap-section relative overflow-hidden bg-[#F2E4D1]" />
  ),
});
const MedicalRehabilitationSection = dynamic(() => import('@/components/sections/medical-rehabilitation-section'));
const EndometriosisSection = dynamic(() => import('@/components/sections/endometriosis-section'));
const LongevitySection = dynamic(() => import('@/components/sections/longevity-section'));
const RheumatologySection = dynamic(() => import('@/components/sections/rheumatology-section'));
const PostChemoSection = dynamic(() => import('@/components/sections/post-chemo-section'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <MedicalRehabilitationSection />
      <EndometriosisSection />
      <LongevitySection />
      <RheumatologySection />
      <PostChemoSection />
      <FacilitiesSection />
    </>
  );
}
