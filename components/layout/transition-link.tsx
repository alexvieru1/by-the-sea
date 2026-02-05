'use client';

import { ReactNode, MouseEvent, CSSProperties } from 'react';
import { Link } from '@/i18n/routing';
import { usePageTransition } from './transition-provider';
import { usePathname } from 'next/navigation';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  locale?: 'ro' | 'en';
  onClick?: (e?: MouseEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({
  href,
  children,
  className,
  style,
  locale,
  onClick,
}: TransitionLinkProps) {
  const { startTransition, isTransitioning } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    onClick?.(e);

    // Don't transition if already transitioning
    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    // Don't transition for same page navigation or external links
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const isSamePage = pathname === href;

    if (isExternal || isSamePage) {
      return; // Let normal navigation happen
    }

    // Prevent default and start transition
    e.preventDefault();
    startTransition(href);
  };

  return (
    <Link href={href} className={className} style={style} locale={locale} onClick={handleClick}>
      {children}
    </Link>
  );
}
