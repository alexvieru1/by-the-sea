import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile', '/evaluation', '/consultation', '/waitlist/'],
    },
    sitemap: 'https://vrajamariibythesea.ro/sitemap.xml',
  };
}
