'use client';

import { motion } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-[#C2A87A] text-white hover:bg-[#007a9e]',
        secondary: 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200',
        dark: 'bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-wider',
      },
      size: {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-8 py-5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface PrimaryButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  arrow?: boolean;
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  variant,
  size,
  className,
  arrow = false,
}: PrimaryButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), arrow && 'group gap-3', className);

  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="inline-block"
      >
        <TransitionLink href={href} className={classes}>
          {content}
        </TransitionLink>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {content}
    </motion.button>
  );
}

export { buttonVariants };
