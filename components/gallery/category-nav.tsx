'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { GalleryCategory } from '@/lib/gallery-data';

interface CategoryNavProps {
  categories: GalleryCategory[];
  activeCategory: GalleryCategory | null;
}

export default function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  const t = useTranslations('pages.gallery.categories');

  const scrollToCategory = (category: GalleryCategory) => {
    const el = document.getElementById(`gallery-${category}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-[72px] z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-12">
        <nav className="flex gap-1 py-3" aria-label="Gallery categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={cn(
                'shrink-0 px-4 py-2 text-sm font-medium tracking-wide transition-colors',
                activeCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {t(`${category}.name`)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
