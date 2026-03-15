import dynamic from 'next/dynamic';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/page-hero';

const AboutContent = dynamic(() => import('@/components/sections/about-content'));

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.about');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title={t('title')} subtitle={t('subtitle')} description={t('description')} />
      <AboutContent />
    </div>
  );
}
