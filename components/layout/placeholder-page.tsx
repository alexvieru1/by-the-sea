'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import TransitionLink from '@/components/layout/transition-link';

interface PlaceholderPageProps {
  translationKey: string;
}

export default function PlaceholderPage({ translationKey }: PlaceholderPageProps) {
  const t = useTranslations(`pages.${translationKey}`);
  const tCommon = useTranslations('common');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#0097a7]/10 blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Subtitle */}
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('subtitle')}
          </motion.p>

          {/* Title */}
          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('description')}
          </motion.p>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0097a7] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0097a7]" />
            </span>
            <span className="text-sm font-medium text-gray-900">
              {tCommon('comingSoon')}
            </span>
          </motion.div>

          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Această pagină este în curs de dezvoltare. Revino în curând pentru conținut complet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <TransitionLink
              href="/"
              className="inline-flex items-center gap-2 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              <svg
                className="h-4 w-4 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
              {tCommon('backHome')}
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
