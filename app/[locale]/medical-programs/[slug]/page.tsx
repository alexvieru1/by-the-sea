import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo';
import TherapyPageClient from './therapy-page-client';

const validSlugs = [
  'medical-rehabilitation',
  'endometriosis-infertility',
  'longevity',
  'rheumatology',
  'post-intervention-recovery',
] as const;

const slugToKey: Record<string, string> = {
  'medical-rehabilitation': 'medicalRehabilitation',
  'endometriosis-infertility': 'endometriosisInfertility',
  'longevity': 'longevity',
  'rheumatology': 'rheumatology',
  'post-intervention-recovery': 'postChemotherapy',
};

const validSlugSet = new Set<string>(validSlugs);

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const key = slugToKey[slug];
  if (!key) return {};
  const t = await getTranslations({ locale, namespace: `medicalPrograms.${key}` });
  return { title: t('title'), description: t('subtitle'), alternates: getAlternates(`/medical-programs/${slug}`) };
}

export default async function MedicalProgramPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!validSlugSet.has(slug)) {
    notFound();
  }

  return <TherapyPageClient slug={slug} />;
}
