'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/components/providers/auth-provider';
import TransitionLink from '@/components/layout/transition-link';

interface UserMenuProps {
  variant?: 'light' | 'dark';
}

export default function UserMenu({ variant = 'dark' }: UserMenuProps) {
  const t = useTranslations('auth.userMenu');
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture;
  const firstName = user.user_metadata?.first_name ?? user.user_metadata?.full_name?.split(' ')[0];
  const lastName = user.user_metadata?.last_name ?? user.user_metadata?.full_name?.split(' ').slice(1).join(' ');
  const initials = [firstName?.[0], lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || user.email?.[0]?.toUpperCase() || '?';

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const borderColor = variant === 'light' ? 'border-white/30' : 'border-gray-300';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border text-sm font-medium transition-colors ${textColor} ${borderColor}`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-48 border border-gray-200 bg-white shadow-lg"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <TransitionLink
              href="/profile"
              className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              {t('profile')}
            </TransitionLink>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="block w-full px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t('signOut')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
