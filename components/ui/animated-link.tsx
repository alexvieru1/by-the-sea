'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import TransitionLink from '@/components/layout/transition-link';

const animatedLinkVariants = cva(
  'group relative inline-flex items-center text-sm transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
  {
    variants: {
      variant: {
        light: 'text-white/70 hover:text-white',
        dark: 'text-gray-600 hover:text-gray-900',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

const underlineVariants = cva(
  'pointer-events-none absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:w-full',
  {
    variants: {
      variant: {
        light: 'bg-white',
        dark: 'bg-gray-900',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

interface AnimatedLinkProps extends VariantProps<typeof animatedLinkVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedLink({
  href,
  children,
  className,
  onClick,
  variant,
}: AnimatedLinkProps) {
  return (
    <TransitionLink
      href={href}
      onClick={onClick}
      className={cn(animatedLinkVariants({ variant }), className)}
    >
      {children}
      <span className={underlineVariants({ variant })} />
    </TransitionLink>
  );
}

export { animatedLinkVariants };
