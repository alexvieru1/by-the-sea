import { notFound } from 'next/navigation';
import TherapyPageClient from './therapy-page-client';

const validSlugs = new Set([
  'endometriosis',
  'longevity',
  'fertility',
  'medical-recovery',
  'wellness',
  'immunology',
  'chemotherapy',
]);

export default async function TherapyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!validSlugs.has(slug)) {
    notFound();
  }

  return <TherapyPageClient slug={slug} />;
}
