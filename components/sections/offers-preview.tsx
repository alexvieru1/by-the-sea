'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';

const offers = [
  {
    key: 'offer1',
    bg: 'bg-[#0097a7]',
    gradient: 'from-[#00838f] to-[#0097a7]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
  },
  {
    key: 'offer2',
    bg: 'bg-[#BCA390]',
    gradient: 'from-[#FFF8D8] to-[#BCA390]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
  },
  {
    key: 'offer3',
    bg: 'bg-[#e8d8d4]',
    gradient: 'from-[#d4bfb8] to-[#e8d8d4]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
  },
  {
    key: 'offer4',
    bg: 'bg-[#c5d5d8]',
    gradient: 'from-[#a8c4c9] to-[#c5d5d8]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
  },
];

export default function OffersPreview() {
  const t = useTranslations('offers');
  const tCommon = useTranslations('common');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {offers.map((offer, i) => (
        <TransitionLink
          key={offer.key}
          href="/offers"
          className="group block"
        >
          <motion.div
            className={`${offer.bg} relative overflow-hidden px-6 py-14 lg:px-10 lg:py-16`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
          >
            {/* Gradient visual area */}
            <div
              className={`relative mb-6 aspect-[16/9] w-full overflow-hidden bg-gradient-to-br ${offer.gradient} transition-transform duration-500 group-hover:scale-[1.02]`}
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

            <h3
              className={`font-[family-name:var(--font-playfair)] text-2xl font-normal italic sm:text-3xl ${offer.textColor}`}
            >
              {t(`${offer.key}.title`)}
            </h3>

            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xl font-semibold ${offer.textColor}`}>
                {t(`${offer.key}.price`)}
                {offer.key === 'offer4' && (
                  <span className={`text-sm font-normal ${offer.mutedColor}`}>
                    {t('perMonth')}
                  </span>
                )}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider ${offer.mutedColor} transition-colors group-hover:${offer.textColor}`}
              >
                {tCommon('learnMore')}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>
        </TransitionLink>
      ))}
    </div>
  );
}
