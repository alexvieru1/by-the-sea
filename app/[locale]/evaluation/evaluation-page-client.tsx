'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import EvaluationForm from '@/components/forms/evaluation-form';

interface EvaluationPageClientProps {
  defaultValues: Record<string, unknown>;
}

export default function EvaluationPageClient({ defaultValues }: EvaluationPageClientProps) {
  const t = useTranslations('evaluation');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-16 pt-32 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('subtitle')}
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>
        </div>
      </div>

      <div className="px-6 py-16 lg:px-12 lg:py-24">
        <EvaluationForm defaultValues={defaultValues} />
      </div>
    </div>
  );
}
