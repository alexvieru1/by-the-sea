import { setRequestLocale, getTranslations } from 'next-intl/server';
import StaysContent from './stays-content';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.stays' });
  return { title: t('title'), description: t('description') };
}

export default async function StaysPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <StaysContent />;
}
