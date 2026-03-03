# Categorized Bento Gallery — Design

## Overview

Replace the placeholder gallery page with a stacked, categorized bento grid gallery. Each category (Junior Suite, Twin Room, Restaurant, Fitness Room, Relaxation Areas) gets its own section with heading, description, and bento image grid. A sticky category nav provides quick navigation between sections.

## Page Structure

```
[Header]
[Hero — "Gallery" title + subtitle from existing translations]
[Sticky Category Nav — highlights active section on scroll, click to jump]
[Section: Junior Suite — heading + description + bento grid]
[Section: Twin Room — heading + description + bento grid]
[Section: Restaurant — heading + description + bento grid]
[Section: Fitness Room — heading + description + bento grid]
[Section: Relaxation Areas — heading + description + bento grid]
[Footer]
```

## Sticky Category Nav

- Horizontal bar that sticks below the header on scroll
- Category labels: Junior Suite, Twin Room, Restaurant, Fitness Room, Relaxation Areas
- Active category highlights based on scroll position (IntersectionObserver)
- Clicking a category smooth-scrolls to that section
- On mobile: horizontally scrollable pills

## Bento Grid Per Section

Grid config: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-3 grid-flow-dense`

Image sizing driven by `orientation` prop:
- `landscape` → `col-span-2 row-span-1` (wide)
- `portrait` → `col-span-1 row-span-2` (tall)
- `square` → `col-span-1 row-span-1` (default)

Images animate in with staggered fade+scale on scroll via Motion `whileInView`.

## Data Structure

```ts
type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  category: 'juniorSuite' | 'twinRoom' | 'restaurant' | 'fitnessRoom' | 'relaxationAreas';
  orientation: 'landscape' | 'portrait' | 'square';
};
```

46 images split evenly (~9 per category) as placeholders. User will reassign real images and orientations later.

## Translations

Add `gallery.categories` to `en.json` and `ro.json`:

- `juniorSuite` — name + description
- `twinRoom` — name + description
- `restaurant` — name + description
- `fitnessRoom` — name + description
- `relaxationAreas` — name + description

## Design Decisions

- **No lightbox** — keep it simple, can add later
- **No tabs/accordion** — stacked sections chosen for full visual showcase on scroll
- **Orientation-driven layout** — avoids hardcoded bento patterns, adapts when images are swapped
- **Sharp corners** — per project design system (no rounded borders)
- **Animations** — Motion whileInView with stagger, consistent with rest of site
