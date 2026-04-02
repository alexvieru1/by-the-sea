import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vraja Mării by the Sea',
    short_name: 'Vraja Mării',
    description: 'Complex de recuperare medicală și wellness în Eforie Sud',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#002343',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
