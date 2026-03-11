'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransitionLink from './transition-link';

interface NavDropdownProps {
  label: string;
  items: { href: string; label: string }[];
  variant?: 'light' | 'dark';
}

export default function NavDropdown({ label, items, variant = 'light' }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const textClass = variant === 'light'
    ? 'text-white/70 hover:text-white'
    : 'text-gray-800 hover:text-gray-950';

  const chevronClass = variant === 'light'
    ? 'text-white/50'
    : 'text-gray-500';

  const panelBg = variant === 'light'
    ? 'bg-gray-900/80 backdrop-blur-xl border-white/10'
    : 'bg-white/80 backdrop-blur-xl border-gray-200/50';

  const itemClass = variant === 'light'
    ? 'text-white/70 hover:text-white hover:bg-white/10'
    : 'text-gray-700 hover:text-gray-950 hover:bg-gray-100/80';

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute top-full left-1/2 mt-2 -translate-x-1/2 border p-2',
              panelBg,
            )}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className={cn(
                      'block whitespace-nowrap px-3 py-2 text-sm transition-colors duration-200',
                      itemClass,
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
