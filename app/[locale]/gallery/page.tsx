import { setRequestLocale, getTranslations } from 'next-intl/server';
import GalleryPageClient from '@/components/gallery/gallery-page-client';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.gallery' });
  return { title: t('title'), description: t('description') };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GalleryPageClient />;
}
