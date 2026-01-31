'use client';

import { Link } from '@/i18n/routing';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedLink({
  href,
  children,
  className = '',
  onClick,
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group
        relative
        inline-flex items-center
        text-sm text-white/70
        transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        hover:text-white
        ${className}
      `}
    >
      {children}
      {/* Animated underline */}
      <span
        className="
          pointer-events-none
          absolute -bottom-1 left-0
          h-px w-0
          bg-white
          transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          group-hover:w-full
        "
      />
    </Link>
  );
}
