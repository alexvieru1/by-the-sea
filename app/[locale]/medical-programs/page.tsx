import { setRequestLocale } from 'next-intl/server';
import MedicalProgramsContent from '@/components/sections/medical-programs-content';

export default async function MedicalProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MedicalProgramsContent />;
}
