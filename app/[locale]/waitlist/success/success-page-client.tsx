'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessPageClientProps {
  isLoggedIn: boolean;
  hasEvaluation: boolean;
}

export default function SuccessPageClient({ isLoggedIn, hasEvaluation }: SuccessPageClientProps) {
  const t = useTranslations('waitlist.success');

  return (
    <section className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        <CheckCircle className="h-16 w-16 text-[#6B5B4E] mx-auto mb-6" />

        <h1 className="font-serif text-3xl sm:text-4xl italic font-light text-gray-900 mb-4">
          {t('title')}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          {t('description')}
        </p>

        {!isLoggedIn && (
          <div className="space-y-4">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-3 w-full bg-[#6B5B4E] text-white px-8 py-4 text-sm font-semibold transition-colors hover:bg-[#5A4A3E]"
            >
              {t('createAccount')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-gray-500">
              {t('createAccountDescription')}
            </p>
            <p className="text-sm text-gray-500 pt-2">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-[#6B5B4E] underline hover:text-[#5A4A3E]">
                {t('login')}
              </Link>
            </p>
          </div>
        )}

        {isLoggedIn && !hasEvaluation && (
          <div className="space-y-4">
            <Link
              href="/evaluation"
              className="flex items-center justify-center gap-3 w-full bg-[#6B5B4E] text-white px-8 py-4 text-sm font-semibold transition-colors hover:bg-[#5A4A3E]"
            >
              {t('completeEvaluation')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-gray-500">
              {t('completeEvaluationDescription')}
            </p>
          </div>
        )}

        {isLoggedIn && hasEvaluation && (
          <div className="space-y-2">
            <p className="text-lg font-medium text-[#6B5B4E]">
              {t('allSet')}
            </p>
            <p className="text-sm text-gray-500">
              {t('allSetDescription')}
            </p>
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
          >
            {t('backHome')}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
