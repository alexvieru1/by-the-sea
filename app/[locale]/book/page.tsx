import WaitlistSection from '@/components/sections/waitlist-section';
import { setRequestLocale } from 'next-intl/server';

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WaitlistSection />;
}
