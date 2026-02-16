'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import OffersGrid from '@/components/sections/offers-grid';

export default function OffersPage() {
  const t = useTranslations('offers');

  return (
    <div className="min-h-screen bg-gray-50">
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
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('heroDescription')}
          </motion.p>
        </div>
      </div>

      {/* Offers Grid */}
      <OffersGrid />
    </div>
  );
}
