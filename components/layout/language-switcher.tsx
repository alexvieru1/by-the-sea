'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isLight = variant === 'light';

  const switchLocale = (newLocale: 'ro' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  const activeClass = isLight ? 'font-medium text-white' : 'font-medium text-gray-900';
  const inactiveClass = isLight
    ? 'text-white/70 hover:text-white'
    : 'text-gray-500 hover:text-gray-900';
  const underlineColor = isLight ? 'bg-white' : 'bg-gray-900';
  const dividerColor = isLight ? 'text-white/40' : 'text-gray-300';

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => switchLocale('ro')}
        className={`
          group relative
          px-1.5 py-1
          transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${locale === 'ro' ? activeClass : inactiveClass}
        `}
      >
        RO
        <span
          className={`
            pointer-events-none
            absolute -bottom-0.5 left-1/2 -translate-x-1/2
            h-px ${underlineColor}
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${locale === 'ro' ? 'w-4' : 'w-0 group-hover:w-4'}
          `}
        />
      </button>
      <span className={dividerColor}>|</span>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`
          group relative
          px-1.5 py-1
          transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${locale === 'en' ? activeClass : inactiveClass}
        `}
      >
        EN
        <span
          className={`
            pointer-events-none
            absolute -bottom-0.5 left-1/2 -translate-x-1/2
            h-px ${underlineColor}
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${locale === 'en' ? 'w-4' : 'w-0 group-hover:w-4'}
          `}
        />
      </button>
    </div>
  );
}
