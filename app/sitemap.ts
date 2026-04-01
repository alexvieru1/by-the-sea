import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.vrajamariibythesea.ro';

const medicalProgramSlugs = [
  'medical-rehabilitation',
  'endometriosis-infertility',
  'longevity',
  'rheumatology',
  'post-intervention-recovery',
];

const staticPages = [
  '',
  '/about',
  '/medical-programs',
  '/therapies',
  '/contact',
  '/book',
  '/stays',
  '/gallery',
  '/patient-guide',
  '/press',
  '/other-info',
  '/privacy',
  '/terms',
  '/cookies',
  '/locations/constanta',
  '/locations/eforie',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push(
      {
        url: `${BASE_URL}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            ro: `${BASE_URL}${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      },
    );
  }

  for (const slug of medicalProgramSlugs) {
    entries.push({
      url: `${BASE_URL}/medical-programs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ro: `${BASE_URL}/medical-programs/${slug}`,
          en: `${BASE_URL}/en/medical-programs/${slug}`,
        },
      },
    });
  }

  return entries;
}
