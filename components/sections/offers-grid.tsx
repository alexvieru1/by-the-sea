'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';

const offers = [
  {
    key: 'offer1',
    bg: 'bg-[#0097a7]',
    gradient: 'from-[#00838f] to-[#0097a7]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
    btnBg: 'bg-white text-gray-900 hover:bg-white/90',
  },
  {
    key: 'offer2',
    bg: 'bg-[#BCA390]',
    gradient: 'from-[#FFF8D8] to-[#BCA390]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
    btnBg: 'bg-white text-gray-900 hover:bg-white/90',
  },
  {
    key: 'offer3',
    bg: 'bg-[#e8d8d4]',
    gradient: 'from-[#d4bfb8] to-[#e8d8d4]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
    btnBg: 'bg-gray-900 text-white hover:bg-gray-800',
  },
  {
    key: 'offer4',
    bg: 'bg-[#c5d5d8]',
    gradient: 'from-[#a8c4c9] to-[#c5d5d8]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
    btnBg: 'bg-gray-900 text-white hover:bg-gray-800',
  },
];

export default function OffersGrid() {
  const t = useTranslations('offers');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {offers.map((offer, i) => (
        <motion.section
          key={offer.key}
          className={`${offer.bg} relative overflow-hidden px-6 py-16 lg:px-10 lg:py-20`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
        >
          {/* Gradient visual area */}
          <div
            className={`relative mb-8 aspect-[16/9] w-full overflow-hidden bg-gradient-to-br ${offer.gradient}`}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            </div>
          </div>

          {/* Content */}
          <p
            className={`mb-2 text-xs font-medium uppercase tracking-wider ${offer.mutedColor}`}
          >
            {t(`${offer.key}.subtitle`)}
          </p>

          <h2
            className={`font-[family-name:var(--font-playfair)] text-2xl font-normal italic sm:text-3xl lg:text-4xl ${offer.textColor}`}
          >
            {t(`${offer.key}.title`)}
          </h2>

          <p className={`mt-3 text-sm leading-relaxed lg:text-base ${offer.mutedColor}`}>
            {t(`${offer.key}.description`)}
          </p>

          <p className={`mt-3 text-xs ${offer.mutedColor}`}>
            <span className="font-medium">✓</span>{' '}
            {t(`${offer.key}.includes`)}
          </p>

          <div className="mt-6 flex items-center gap-5">
            <span className={`text-2xl font-semibold ${offer.textColor}`}>
              {t(`${offer.key}.price`)}
              {offer.key === 'offer4' && (
                <span className={`text-sm font-normal ${offer.mutedColor}`}>
                  {t('perMonth')}
                </span>
              )}
            </span>

            <motion.button
              type="button"
              className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${offer.btnBg}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {t('bookNow')}
              <svg
                className="h-3.5 w-3.5"
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
            </motion.button>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
