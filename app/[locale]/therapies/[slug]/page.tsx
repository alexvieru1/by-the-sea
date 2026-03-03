import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import TherapyPageClient from './therapy-page-client';

const validSlugs = [
  'medical-rehabilitation',
  'endometriosis',
  'longevity',
  'infertility',
  'rheumatology',
  'wellness',
  'post-chemotherapy',
] as const;

const validSlugSet = new Set<string>(validSlugs);

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export default async function TherapyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!validSlugSet.has(slug)) {
    notFound();
  }

  return <TherapyPageClient slug={slug} />;
}
