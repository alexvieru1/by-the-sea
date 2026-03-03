'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import BentoGrid from './bento-grid';
import type { GalleryCategory, GalleryImage } from '@/lib/gallery-data';

interface GallerySectionProps {
  category: GalleryCategory;
  images: GalleryImage[];
}

const GallerySection = forwardRef<HTMLElement, GallerySectionProps>(
  function GallerySection({ category, images }, ref) {
    const t = useTranslations(`pages.gallery.categories.${category}`);

    return (
      <section ref={ref} id={`gallery-${category}`} className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl lg:text-5xl">
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
);

export default GallerySection;
