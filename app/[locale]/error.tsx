'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('error');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-[family-name:var(--font-quicksand)] text-[150px] font-thin leading-none text-gray-200 sm:text-[200px]">
            !
          </span>
        </motion.div>

        <motion.h1
          className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('title')}
        </motion.h1>

        <motion.p
          className="mx-auto mt-4 max-w-md text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
          >
            <RotateCcw className="h-4 w-4" />
            {t('retry')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
