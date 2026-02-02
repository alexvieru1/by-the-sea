'use client';

import { Link } from '@/i18n/routing';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

export default function AnimatedLink({
  href,
  children,
  className = '',
  onClick,
  variant = 'light',
}: AnimatedLinkProps) {
  const isLight = variant === 'light';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group
        relative
        inline-flex items-center
        text-sm
        transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${isLight ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
        ${className}
      `}
    >
      {children}
      {/* Animated underline */}
      <span
        className={`
          pointer-events-none
          absolute -bottom-1 left-0
          h-px w-0
          transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          group-hover:w-full
          ${isLight ? 'bg-white' : 'bg-gray-900'}
        `}
      />
    </Link>
  );
}
