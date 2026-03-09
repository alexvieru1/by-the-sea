import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/page-hero';
import ContactPageContent from '@/components/sections/contact-page-content';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.contact');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title={t('title')} subtitle={t('subtitle')} description={t('description')} />
      <ContactPageContent />
    </div>
  );
}
