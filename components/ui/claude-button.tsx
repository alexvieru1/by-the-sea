'use client';

import { motion } from 'motion/react';
import TransitionLink from '@/components/layout/transition-link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ClaudeButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';

  const variants = {
    primary: 'bg-[#C2A87A] text-white hover:bg-[#007a9e]',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200',
    dark: 'bg-[#2d3436] text-white hover:bg-[#1a1a1a]',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="inline-block"
      >
        <TransitionLink href={href} className={combinedClassName}>
          {children}
        </TransitionLink>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={combinedClassName}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
