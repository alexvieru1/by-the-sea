'use client';

import { useTranslations } from 'next-intl';
import GallerySection from './gallery-section';
import { GALLERY_CATEGORIES, getImagesByCategory } from '@/lib/gallery-data';
import PageHero from '@/components/layout/page-hero';

export default function GalleryPageClient() {
  const t = useTranslations('pages.gallery');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

      {/* Category Sections */}
      {GALLERY_CATEGORIES.map((category) => (
        <GallerySection
          key={category}
          category={category}
          images={getImagesByCategory(category)}
        />
      ))}
    </div>
  );
}
