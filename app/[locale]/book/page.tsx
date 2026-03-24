import { setRequestLocale, getTranslations } from 'next-intl/server';
import WaitlistSection from '@/components/sections/waitlist-section';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.book' });
  return { title: t('title'), description: t('description') };
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WaitlistSection />;
}
