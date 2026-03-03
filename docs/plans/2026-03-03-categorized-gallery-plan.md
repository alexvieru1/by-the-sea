# Categorized Bento Gallery — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the placeholder gallery page with a stacked, categorized bento grid gallery with sticky category navigation.

**Architecture:** Gallery page with hero section, sticky category nav bar (IntersectionObserver-driven), and per-category sections each containing a heading, description, and orientation-driven bento image grid. All text is i18n via next-intl. Image data lives in a dedicated data file with category and orientation props.

**Tech Stack:** Next.js (App Router), next-intl, Motion (motion/react), Tailwind CSS, IntersectionObserver

---

### Task 1: Add gallery category translations

**Files:**
- Modify: `messages/en.json` — add `gallery.categories` object
- Modify: `messages/ro.json` — add `gallery.categories` object

**Step 1: Add English translations**

In `messages/en.json`, replace the existing `pages.gallery` block with expanded content. Find:

```json
"gallery": {
  "title": "Gallery",
  "subtitle": "See our spaces",
  "description": "Take a visual tour of our facilities, treatment rooms, and the stunning seaside setting."
},
```

Replace with:

```json
"gallery": {
  "title": "Gallery",
  "subtitle": "See our spaces",
  "description": "Take a visual tour of our facilities, treatment rooms, and the stunning seaside setting.",
  "categories": {
    "juniorSuite": {
      "name": "Junior Suite",
      "description": "Spacious apartment-style suites with a separate bedroom and living area featuring an expandable couch — ideal for extended wellness stays."
    },
    "twinRoom": {
      "name": "Twin Room",
      "description": "Comfortable rooms with two separate beds, designed for restful recovery in a serene seaside setting."
    },
    "restaurant": {
      "name": "Restaurant",
      "description": "Our restaurant serves nourishing, locally sourced cuisine crafted to complement your wellness journey."
    },
    "fitnessRoom": {
      "name": "Fitness Room",
      "description": "A fully equipped fitness space for maintaining your exercise routine during your stay."
    },
    "relaxationAreas": {
      "name": "Relaxation Areas",
      "description": "Tranquil spaces throughout the complex designed for rest, reflection, and unwinding between treatments."
    }
  }
},
```

**Step 2: Add Romanian translations**

In `messages/ro.json`, find the same `pages.gallery` block and replace with:

```json
"gallery": {
  "title": "Galerie",
  "subtitle": "Descoperă spațiile noastre",
  "description": "Fă un tur vizual al facilităților noastre, camerelor de tratament și cadrului splendid de pe malul mării.",
  "categories": {
    "juniorSuite": {
      "name": "Suită Junior",
      "description": "Suite spațioase tip apartament cu dormitor separat și zonă de living cu canapea extensibilă — ideale pentru sejururi wellness prelungite."
    },
    "twinRoom": {
      "name": "Cameră Twin",
      "description": "Camere confortabile cu două paturi separate, concepute pentru o recuperare odihnită într-un cadru liniștit la malul mării."
    },
    "restaurant": {
      "name": "Restaurant",
      "description": "Restaurantul nostru servește preparate hrănitoare din ingrediente locale, create să completeze călătoria ta wellness."
    },
    "fitnessRoom": {
      "name": "Sala de Fitness",
      "description": "Un spațiu de fitness complet echipat pentru a-ți menține rutina de exerciții în timpul sejurului."
    },
    "relaxationAreas": {
      "name": "Zone de Relaxare",
      "description": "Spații liniștite din tot complexul, concepute pentru odihnă, reflecție și relaxare între tratamente."
    }
  }
},
```

**Step 3: Commit**

```bash
git add messages/en.json messages/ro.json
git commit -m "feat: add gallery category translations for bento gallery"
```

---

### Task 2: Create gallery image data file

**Files:**
- Create: `lib/gallery-data.ts`

**Step 1: Create the data file**

```ts
export type GalleryCategory =
  | 'juniorSuite'
  | 'twinRoom'
  | 'restaurant'
  | 'fitnessRoom'
  | 'relaxationAreas';

export type ImageOrientation = 'landscape' | 'portrait' | 'square';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: GalleryCategory;
  orientation: ImageOrientation;
}

const CATEGORIES: GalleryCategory[] = [
  'juniorSuite',
  'twinRoom',
  'restaurant',
  'fitnessRoom',
  'relaxationAreas',
];

// Placeholder distribution — reassign images and orientations later
export const GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 46 }, (_, i) => ({
  id: i + 1,
  src: `/images/gallery/vraja_marii_by_the_sea_eforie_sud_${i + 1}.webp`,
  alt: `Vraja Mării by the Sea - Image ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  orientation: 'landscape' as ImageOrientation,
}));

export const GALLERY_CATEGORIES = CATEGORIES;

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  return GALLERY_IMAGES.filter((img) => img.category === category);
}
```

**Step 2: Commit**

```bash
git add lib/gallery-data.ts
git commit -m "feat: add gallery image data with category and orientation types"
```

---

### Task 3: Create the bento grid component

**Files:**
- Create: `components/gallery/bento-grid.tsx`

**Step 1: Create the component**

This component takes an array of `GalleryImage` and renders the bento grid. The `orientation` prop drives `col-span` / `row-span` classes.

```tsx
'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/lib/gallery-data';

const orientationClasses: Record<string, string> = {
  landscape: 'col-span-2 row-span-1',
  portrait: 'col-span-1 row-span-2',
  square: 'col-span-1 row-span-1',
};

interface BentoGridProps {
  images: GalleryImage[];
}

export default function BentoGrid({ images }: BentoGridProps) {
  return (
    <div className="grid auto-rows-[200px] grid-flow-dense grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, i) => (
        <motion.div
          key={image.id}
          className={cn(
            'group relative overflow-hidden',
            orientationClasses[image.orientation] ?? orientationClasses.square
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </motion.div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/gallery/bento-grid.tsx
git commit -m "feat: add bento grid component with orientation-driven layout"
```

---

### Task 4: Create the gallery category section component

**Files:**
- Create: `components/gallery/gallery-section.tsx`

**Step 1: Create the component**

Each category section: heading, description, and its bento grid.

```tsx
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
```

**Step 2: Commit**

```bash
git add components/gallery/gallery-section.tsx
git commit -m "feat: add gallery section component with heading and bento grid"
```

---

### Task 5: Create the sticky category nav component

**Files:**
- Create: `components/gallery/category-nav.tsx`

**Step 1: Create the component**

Sticky nav that highlights the active section based on scroll position.

```tsx
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
```

**Step 2: Commit**

```bash
git add components/gallery/category-nav.tsx
git commit -m "feat: add sticky category nav for gallery sections"
```

---

### Task 6: Create the gallery page client component

**Files:**
- Create: `components/gallery/gallery-page-client.tsx`

**Step 1: Create the component**

This is the main orchestrator: hero, sticky nav, and all category sections. Uses IntersectionObserver to track active category.

```tsx
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
```

**Step 2: Commit**

```bash
git add components/gallery/gallery-page-client.tsx
git commit -m "feat: add gallery page client with IntersectionObserver category tracking"
```

---

### Task 7: Wire up the gallery route

**Files:**
- Modify: `app/[locale]/gallery/page.tsx`

**Step 1: Replace placeholder with real gallery**

Replace the entire file:

```tsx
import GalleryPageClient from '@/components/gallery/gallery-page-client';

export default function GalleryPage() {
  return <GalleryPageClient />;
}
```

**Step 2: Verify in browser**

Run: `pnpm dev`

Visit `http://localhost:3000/gallery` and `http://localhost:3000/en/gallery`

Verify:
- Hero section renders with title/subtitle/description
- Sticky nav appears and sticks on scroll
- All 5 category sections render with headings and bento grids
- Clicking a nav item scrolls to the section
- Active nav item highlights on scroll
- Images display in bento layout
- Language switch works (RO/EN)

**Step 3: Commit**

```bash
git add app/[locale]/gallery/page.tsx
git commit -m "feat: wire gallery route to categorized bento gallery page"
```
