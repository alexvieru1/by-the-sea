'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';

export default function NotFound() {
  const t = useTranslations('notFound');
  const tCommon = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        {/* 404 Number */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-[family-name:var(--font-playfair)] text-[150px] font-normal italic leading-none text-gray-200 sm:text-[200px]">
            {t('code')}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('title')}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mx-auto mt-4 max-w-md text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('description')}
        </motion.p>

        {/* Back Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon('backHome')}
          </TransitionLink>
        </motion.div>
      </div>
    </div>
  );
}
