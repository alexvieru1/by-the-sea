import PlaceholderPage from '@/components/layout/placeholder-page';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.locations.eforie' });
  return { title: t('title'), description: t('description'), alternates: getAlternates('/locations/eforie') };
}

export default async function EforieLocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlaceholderPage translationKey="locations.eforie" />;
}
