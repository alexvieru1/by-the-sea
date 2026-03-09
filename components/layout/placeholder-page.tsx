'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';
import PageHero from '@/components/layout/page-hero';

interface PlaceholderPageProps {
  translationKey: string;
}

export default function PlaceholderPage({ translationKey }: PlaceholderPageProps) {
  const t = useTranslations(`pages.${translationKey}`);
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

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
              <ArrowLeft className="h-4 w-4" />
              {tCommon('backHome')}
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
