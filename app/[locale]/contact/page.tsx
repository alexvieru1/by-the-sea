import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/page-hero';
import ContactPageContent from '@/components/sections/contact-page-content';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.contact' });
  return { title: t('title'), description: t('description') };
}

export default async function ContactPage({ params }: Props) {
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
