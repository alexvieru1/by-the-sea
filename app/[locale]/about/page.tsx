import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/page-hero';

const AboutContent = dynamic(() => import('@/components/sections/about-content'));

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPageInner />;
}

function AboutPageInner() {
  const t = useTranslations('aboutContent');

  return (
    <>
      <PageHero title={t('title')} />
      <AboutContent />
    </>
  );
}
