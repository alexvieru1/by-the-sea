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
    align: 'left' as const,
  },
  {
    key: 'offer2',
    bg: 'bg-[#BCA390]',
    gradient: 'from-[#FFF8D8] to-[#BCA390]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
    btnBg: 'bg-white text-gray-900 hover:bg-white/90',
    align: 'right' as const,
  },
  {
    key: 'offer3',
    bg: 'bg-[#e8d8d4]',
    gradient: 'from-[#d4bfb8] to-[#e8d8d4]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
    btnBg: 'bg-gray-900 text-white hover:bg-gray-800',
    align: 'left' as const,
  },
  {
    key: 'offer4',
    bg: 'bg-[#c5d5d8]',
    gradient: 'from-[#a8c4c9] to-[#c5d5d8]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
    btnBg: 'bg-gray-900 text-white hover:bg-gray-800',
    align: 'right' as const,
  },
];

export default function OffersGrid() {
  const t = useTranslations('offers');

  return (
    <div>
      {offers.map((offer) => (
        <section
          key={offer.key}
          className={`${offer.bg} relative overflow-hidden`}
        >
          <div
            className={`mx-auto flex max-w-7xl flex-col px-6 py-24 lg:flex-row lg:items-center lg:gap-20 lg:px-12 lg:py-32 ${
              offer.align === 'right' ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Gradient visual area */}
            <motion.div
              className={`relative mb-10 aspect-[4/3] w-full overflow-hidden bg-gradient-to-br ${offer.gradient} lg:mb-0 lg:w-1/2`}
              initial={{ opacity: 0, x: offer.align === 'left' ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
                <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p
                className={`mb-3 text-sm font-medium uppercase tracking-wider ${offer.mutedColor}`}
              >
                {t(`${offer.key}.subtitle`)}
              </p>

              <h2
                className={`font-[family-name:var(--font-playfair)] text-3xl font-normal italic sm:text-4xl lg:text-5xl ${offer.textColor}`}
              >
                {t(`${offer.key}.title`)}
              </h2>

              <p className={`mt-4 text-base leading-relaxed lg:text-lg ${offer.mutedColor}`}>
                {t(`${offer.key}.description`)}
              </p>

              <p className={`mt-4 text-sm ${offer.mutedColor}`}>
                <span className="font-medium">✓</span>{' '}
                {t(`${offer.key}.includes`)}
              </p>

              <div className="mt-8 flex items-center gap-6">
                <span className={`text-3xl font-semibold ${offer.textColor}`}>
                  {t(`${offer.key}.price`)}
                  {offer.key === 'offer4' && (
                    <span className={`text-base font-normal ${offer.mutedColor}`}>
                      {t('perMonth')}
                    </span>
                  )}
                </span>

                <motion.button
                  type="button"
                  className={`inline-flex items-center gap-2 px-7 py-3.5 text-xs font-medium uppercase tracking-wider transition-colors ${offer.btnBg}`}
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
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
}
