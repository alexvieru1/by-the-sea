const BASE_URL = 'https://www.vrajamariibythesea.ro';

export function getAlternates(pathname: string) {
  const cleanPath = pathname === '/' ? '' : pathname;
  return {
    canonical: `${BASE_URL}${cleanPath}`,
    languages: {
      ro: `${BASE_URL}${cleanPath}`,
      en: `${BASE_URL}/en${cleanPath}`,
      'x-default': `${BASE_URL}${cleanPath}`,
    },
  };
}
