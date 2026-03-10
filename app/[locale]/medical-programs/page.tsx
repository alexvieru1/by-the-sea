import PlaceholderPage from '@/components/layout/placeholder-page';
import { setRequestLocale } from 'next-intl/server';

export default async function MedicalProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlaceholderPage translationKey="medicalPrograms" />;
}
