import { setRequestLocale } from 'next-intl/server';
import StaysContent from './stays-content';

export default async function StaysPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <StaysContent />;
}
