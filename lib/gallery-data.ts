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

// 10-image pattern that fills a complete 4-col bento grid rectangle
const CATEGORY_PATTERN: ImageOrientation[] = [
  'portrait', 'landscape', 'square',
  'square', 'portrait', 'landscape',
  'square', 'square', 'landscape', 'square',
];

const IMAGES_PER_CATEGORY = 10;

function buildGalleryImages(): GalleryImage[] {
  const images: GalleryImage[] = [];

  for (let catIdx = 0; catIdx < CATEGORIES.length; catIdx++) {
    const category = CATEGORIES[catIdx];
    for (let j = 0; j < IMAGES_PER_CATEGORY; j++) {
      const globalIndex = catIdx + j * CATEGORIES.length;
      images.push({
        id: globalIndex + 1,
        src: `/images/gallery/vraja_marii_by_the_sea_eforie_sud_${globalIndex + 1}.webp`,
        alt: `Vraja Mării by the Sea - Image ${globalIndex + 1}`,
        category,
        orientation: CATEGORY_PATTERN[j],
      });
    }
  }

  return images;
}

export const GALLERY_IMAGES: GalleryImage[] = buildGalleryImages();

export const GALLERY_CATEGORIES = CATEGORIES;

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  return GALLERY_IMAGES.filter((img) => img.category === category);
}
