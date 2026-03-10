'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';

const therapyMap: Record<string, { translationNamespace: string; translationKey: string; bg: string }> = {
  'medical-rehabilitation': {
    translationNamespace: 'medicalPrograms',
    translationKey: 'medicalRehabilitation',
    bg: 'bg-[#D2B88B]',
  },
  'endometriosis-infertility': {
    translationNamespace: 'medicalPrograms',
    translationKey: 'endometriosisInfertility',
    bg: 'bg-[#D2B88B]',
  },
  longevity: {
    translationNamespace: 'medicalPrograms',
    translationKey: 'longevity',
    bg: 'bg-[#0097a7]',
  },
  rheumatology: {
    translationNamespace: 'medicalPrograms',
    translationKey: 'rheumatology',
    bg: 'bg-[#8FA3A8]',
  },
  wellness: {
    translationNamespace: 'therapies',
    translationKey: 'wellness',
    bg: 'bg-[#BCA390]',
  },
  'post-chemotherapy': {
    translationNamespace: 'medicalPrograms',
    translationKey: 'postChemotherapy',
    bg: 'bg-[#BCA390]',
  },
};

const darkTextSlugs = new Set(['wellness']);

export default function TherapyPageClient({ slug }: { slug: string }) {
  const therapy = therapyMap[slug];
  const isDark = darkTextSlugs.has(slug);
  const textColor = isDark ? 'text-gray-900' : 'text-white';
  const mutedColor = isDark ? 'text-gray-700' : 'text-white/80';

  const t = useTranslations(therapy.translationNamespace);
  const tCommon = useTranslations('common');
  const prefix = therapy.translationKey ? `${therapy.translationKey}.` : '';

  const title = t(`${prefix}title`);
  const description = t(`${prefix}description`);
  const subtitle = t(`${prefix}subtitle`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`relative overflow-hidden ${therapy.bg} px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {subtitle && (
            <motion.p
              className={`mb-4 text-sm font-medium uppercase tracking-wider ${mutedColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            className={`font-[family-name:var(--font-playfair)] text-4xl font-normal italic sm:text-5xl lg:text-6xl ${textColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className={`mx-auto mt-6 max-w-2xl text-lg ${mutedColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Coming Soon + CTA */}
      <div className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            className="mb-8 inline-flex items-center gap-2 border border-gray-200 bg-white px-6 py-3 shadow-sm"
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

          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TransitionLink
              href="/medical-programs"
              className="inline-flex items-center gap-2 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {tCommon('allPrograms')}
            </TransitionLink>

            <TransitionLink
              href="/waitlist"
              className="inline-flex items-center gap-2 border border-gray-900 bg-transparent px-8 py-4 text-sm font-medium uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              {tCommon('requestStay')}
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
