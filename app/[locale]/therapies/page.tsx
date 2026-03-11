import { setRequestLocale } from 'next-intl/server';
import TherapiesContent from './therapies-content';

export default async function TherapiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TherapiesContent />;
}
