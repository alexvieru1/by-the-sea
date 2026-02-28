'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import type { WaitlistStatus } from './page';

interface WaitlistStatusBannerProps {
  status: WaitlistStatus;
}

export default function WaitlistStatusBanner({ status }: WaitlistStatusBannerProps) {
  const t = useTranslations('auth.profile.waitlistStatus');

  if (status === 'evaluated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-green-200 bg-green-50 p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">{t('evaluatedTitle')}</p>
            <p className="mt-1 text-sm text-green-700">{t('evaluatedDescription')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-[#0097a7]/20 bg-[#d8f0f2] p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0097a7]" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{t('confirmedTitle')}</p>
            <p className="mt-1 text-sm text-gray-700">{t('confirmedDescription')}</p>
            <Link
              href="/evaluation"
              className="mt-3 inline-flex items-center gap-2 bg-gray-900 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {t('confirmedAction')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-amber-200 bg-amber-50 p-5"
      >
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">{t('pendingTitle')}</p>
            <p className="mt-1 text-sm text-amber-700">{t('pendingDescription')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // status === 'none'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 border border-gray-200 bg-gray-50 p-5"
    >
      <div>
        <p className="text-sm font-semibold text-gray-900">{t('noneTitle')}</p>
        <p className="mt-1 text-sm text-gray-600">{t('noneDescription')}</p>
        <Link
          href="/book"
          className="mt-3 inline-flex items-center gap-2 border border-gray-300 bg-white px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t('noneAction')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
