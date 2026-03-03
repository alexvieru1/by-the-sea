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

const ORIENTATIONS: ImageOrientation[] = ['landscape', 'portrait', 'square'];

// Placeholder distribution — reassign images and orientations later
export const GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 46 }, (_, i) => ({
  id: i + 1,
  src: `/images/gallery/vraja_marii_by_the_sea_eforie_sud_${i + 1}.webp`,
  alt: `Vraja Mării by the Sea - Image ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  orientation: ORIENTATIONS[(i * 7 + 3) % ORIENTATIONS.length],
}));

export const GALLERY_CATEGORIES = CATEGORIES;

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  return GALLERY_IMAGES.filter((img) => img.category === category);
}
