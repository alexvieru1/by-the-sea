'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import BentoGrid from './bento-grid';
import type { GalleryCategory, GalleryImage } from '@/lib/gallery-data';

interface GallerySectionProps {
  category: GalleryCategory;
  images: GalleryImage[];
}

export default function GallerySection({ category, images }: GallerySectionProps) {
  const t = useTranslations(`pages.gallery.categories.${category}`);

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl lg:text-5xl">
            {t('name')}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-gray-600 lg:text-lg">
            {t('description')}
          </p>
        </motion.div>

        <BentoGrid images={images} />
      </div>
    </section>
  );
}
