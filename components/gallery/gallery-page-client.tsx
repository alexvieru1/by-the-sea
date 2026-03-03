'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import CategoryNav from './category-nav';
import GallerySection from './gallery-section';
import { GALLERY_CATEGORIES, getImagesByCategory } from '@/lib/gallery-data';
import type { GalleryCategory } from '@/lib/gallery-data';

export default function GalleryPageClient() {
  const t = useTranslations('pages.gallery');
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | null>(null);
  const sectionRefs = useRef<Map<GalleryCategory, HTMLElement>>(new Map());

  const setSectionRef = useCallback(
    (category: GalleryCategory) => (el: HTMLElement | null) => {
      if (el) {
        sectionRefs.current.set(category, el);
      } else {
        sectionRefs.current.delete(category);
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const category = id.replace('gallery-', '') as GalleryCategory;
            setActiveCategory(category);
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );

    for (const el of sectionRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('subtitle')}
          </motion.p>
          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('description')}
          </motion.p>
        </div>
      </div>

      {/* Sticky Category Nav */}
      <CategoryNav categories={GALLERY_CATEGORIES} activeCategory={activeCategory} />

      {/* Category Sections */}
      {GALLERY_CATEGORIES.map((category) => (
        <GallerySection
          key={category}
          ref={setSectionRef(category)}
          category={category}
          images={getImagesByCategory(category)}
        />
      ))}
    </div>
  );
}
