'use client';

import { Link } from '@/i18n/routing';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  initialText: string;
  hoverText: string;
  className?: string;
}

export default function AnimatedButton({
  href,
  onClick,
  bgColor = '#ffffff',
  textColor = '#568fa6',
  hoverTextColor = '#44d8a4',
  borderColor = '#44d8a4',
  initialText,
  hoverText,
  className = '',
}: AnimatedButtonProps) {
  const content = (
    <>
      {/* Horizontal border lines */}
      <span
        className="absolute right-0 top-0 h-0.5 w-0 transition-all duration-500 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:w-full"
        style={{ backgroundColor: borderColor }}
      />
      <span
        className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:w-full"
        style={{ backgroundColor: borderColor }}
      />

      {/* Vertical border lines */}
      <span
        className="absolute right-0 top-0 bottom-0 w-0.5 origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:scale-y-100"
        style={{ backgroundColor: borderColor }}
      />
      <span
        className="absolute left-0 top-0 bottom-0 w-0.5 origin-bottom scale-y-0 transition-transform duration-300 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:scale-y-100"
        style={{ backgroundColor: borderColor }}
      />

      {/* Text container */}
      <span className="relative block h-5 overflow-hidden">
        {/* Initial text - slides up and out on hover */}
        <span
          className="block whitespace-nowrap leading-5 transition-transform duration-400 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:-translate-y-full"
          style={{ color: textColor }}
        >
          {initialText}
        </span>
        {/* Hover text - slides up from below */}
        <span
          className="block whitespace-nowrap leading-5 transition-transform duration-400 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:-translate-y-full"
          style={{ color: hoverTextColor }}
        >
          {hoverText}
        </span>
      </span>
    </>
  );

  const baseClasses = `
    group
    relative overflow-hidden
    px-8 py-4
    text-sm font-medium uppercase tracking-wider
    cursor-pointer
    flex items-center justify-center
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        style={{ backgroundColor: bgColor }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      style={{ backgroundColor: bgColor }}
    >
      {content}
    </button>
  );
}
