import PlaceholderPage from '@/components/layout/placeholder-page';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.locations.constanta' });
  return { title: t('title'), description: t('description') };
}

export default async function ConstantaLocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlaceholderPage translationKey="locations.constanta" />;
}
