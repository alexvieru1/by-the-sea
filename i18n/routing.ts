import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed' // Only show /en for English, / for Romanian
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
