import PlaceholderPage from '@/components/layout/placeholder-page';
import { setRequestLocale } from 'next-intl/server';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlaceholderPage translationKey="contact" />;
}
