import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/page-hero';
import PatientGuideContent from '@/components/sections/patient-guide-content';

export default async function PatientGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.patientGuide');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      <PatientGuideContent />
    </div>
  );
}
