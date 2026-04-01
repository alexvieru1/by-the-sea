import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo';
import GalleryPageClient from '@/components/gallery/gallery-page-client';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.gallery' });
  return { title: t('title'), description: t('description'), alternates: getAlternates('/gallery') };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GalleryPageClient />;
}
