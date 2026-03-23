'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransitionLink from './transition-link';

interface NavDropdownProps {
  label: string;
  items?: { href: string; label: string }[];
  variant?: 'light' | 'dark';
  isExpanded?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export default function NavDropdown({ label, variant = 'light', isExpanded, onHoverStart, onHoverEnd }: NavDropdownProps) {
  const isOpen = isExpanded ?? false;

  const textClass = variant === 'light'
    ? 'text-white/70 hover:text-white'
    : 'text-gray-800 hover:text-gray-950';

  const chevronClass = variant === 'light'
    ? 'text-white/50'
    : 'text-gray-500';

  return (
    <div
      className="relative"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <button
        type="button"
        className={cn(
          'group relative inline-flex items-center gap-1 text-sm transition-colors duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
          textClass,
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            chevronClass,
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Invisible hover bridge to catch mouse between trigger and strip */}
      {isOpen && (
        <div className="absolute left-1/2 top-full h-10 w-32 -translate-x-1/2" />
      )}
    </div>
  );
}

// Separate component for the full-width strip rendered in the header
export function NavDropdownStrip({
  items,
  isOpen,
  variant = 'light',
  onMouseEnter,
  onMouseLeave,
}: {
  items: { href: string; label: string }[];
  isOpen: boolean;
  variant?: 'light' | 'dark';
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const itemClass = variant === 'light'
    ? 'text-white/70 hover:text-white'
    : 'text-gray-700 hover:text-gray-950';

  const borderClass = variant === 'light'
    ? 'border-t-white/10'
    : 'border-t-gray-200/30';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn('hidden w-full overflow-hidden border-t lg:block', borderClass)}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-3">
            {items.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm transition-colors duration-200',
                  itemClass,
                )}
              >
                {item.label}
              </TransitionLink>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
