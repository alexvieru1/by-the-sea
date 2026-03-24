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

interface CategoryConfig {
  key: GalleryCategory;
  folder: string;
  prefix: string;
  count: number;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  { key: 'juniorSuite', folder: 'junior-suite', prefix: 'js', count: 10 },
  { key: 'twinRoom', folder: 'twin-room', prefix: 'tw', count: 10 },
  { key: 'restaurant', folder: 'restaurant', prefix: 'rs', count: 10 },
  { key: 'fitnessRoom', folder: 'kineto-and-fitness-rooms', prefix: 'kf', count: 10 },
  // { key: 'relaxationAreas', folder: 'relaxation-area', prefix: 'ra', count: 10 },
];

// 10-image pattern that fills a complete 4-col bento grid rectangle
const CATEGORY_PATTERN: ImageOrientation[] = [
  'portrait', 'landscape', 'square',
  'square', 'portrait', 'landscape',
  'square', 'square', 'landscape', 'square',
];

function buildGalleryImages(): GalleryImage[] {
  const images: GalleryImage[] = [];
  let id = 1;

  for (const config of CATEGORY_CONFIGS) {
    for (let j = 0; j < config.count; j++) {
      images.push({
        id: id++,
        src: `/images/gallery/${config.folder}/${config.prefix}-${j + 1}.webp`,
        alt: `Vraja Mării by the Sea - ${config.folder} ${j + 1}`,
        category: config.key,
        orientation: CATEGORY_PATTERN[j % CATEGORY_PATTERN.length],
      });
    }
  }

  return images;
}

export const GALLERY_IMAGES: GalleryImage[] = buildGalleryImages();

export const GALLERY_CATEGORIES: GalleryCategory[] = CATEGORY_CONFIGS.map((c) => c.key);

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  return GALLERY_IMAGES.filter((img) => img.category === category);
}
