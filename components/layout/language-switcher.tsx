'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'ro' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => switchLocale('ro')}
        className={`
          group relative
          px-1.5 py-1
          transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${locale === 'ro' ? 'font-medium text-white' : 'text-white/70 hover:text-white'}
        `}
      >
        RO
        {/* Animated underline - always visible when active, animates on hover when not active */}
        <span
          className={`
            pointer-events-none
            absolute -bottom-0.5 left-1/2 -translate-x-1/2
            h-px bg-white
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${locale === 'ro' ? 'w-4' : 'w-0 group-hover:w-4'}
          `}
        />
      </button>
      <span className="text-white/40">|</span>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`
          group relative
          px-1.5 py-1
          transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${locale === 'en' ? 'font-medium text-white' : 'text-white/70 hover:text-white'}
        `}
      >
        EN
        {/* Animated underline - always visible when active, animates on hover when not active */}
        <span
          className={`
            pointer-events-none
            absolute -bottom-0.5 left-1/2 -translate-x-1/2
            h-px bg-white
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${locale === 'en' ? 'w-4' : 'w-0 group-hover:w-4'}
          `}
        />
      </button>
    </div>
  );
}
