import GalleryPageClient from '@/components/gallery/gallery-page-client';
import { setRequestLocale } from 'next-intl/server';

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GalleryPageClient />;
}
