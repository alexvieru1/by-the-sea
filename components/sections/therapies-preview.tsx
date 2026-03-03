'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';

const therapies = [
  {
    key: 'infertility',
    slug: 'infertility',
    image: '/images/therapies/infertility.webp',
    bg: 'bg-[#0097a7]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
  },
  {
    key: 'rheumatology',
    slug: 'rheumatology',
    image: '/images/therapies/rheumatology.webp',
    bg: 'bg-[#BCA390]',
    textColor: 'text-white',
    mutedColor: 'text-white/70',
  },
  {
    key: 'wellness',
    slug: 'wellness',
    image: '/images/therapies/wellness.webp',
    bg: 'bg-[#e8d8d4]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
  },
  {
    key: 'postChemotherapy',
    slug: 'post-chemotherapy',
    image: '/images/therapies/post-chemotherapy.webp',
    bg: 'bg-[#c5d5d8]',
    textColor: 'text-gray-900',
    mutedColor: 'text-gray-600',
  },
];

export default function TherapiesPreview() {
  const t = useTranslations('therapies');
  const tCommon = useTranslations('common');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {therapies.map((therapy, i) => (
        <TransitionLink
          key={therapy.key}
          href={`/therapies/${therapy.slug}`}
          className="group flex"
        >
          <motion.div
            className={`${therapy.bg} relative flex w-full flex-col overflow-hidden px-6 py-14 lg:px-10 lg:py-16`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
          >
            {/* Image area */}
            <div className="relative mb-6 aspect-video w-full overflow-hidden">
              <Image
                src={therapy.image}
                alt={t(`${therapy.key}.title`)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <p
              className={`mb-2 text-xs font-medium uppercase tracking-wider ${therapy.mutedColor}`}
            >
              {t(`${therapy.key}.subtitle`)}
            </p>

            <h3
              className={`font-[family-name:var(--font-playfair)] text-2xl font-normal italic sm:text-3xl ${therapy.textColor}`}
            >
              {t(`${therapy.key}.title`)}
            </h3>

            <p className={`mt-3 text-sm leading-relaxed ${therapy.mutedColor}`}>
              {t(`${therapy.key}.description`)}
            </p>

            <div className="mt-auto flex items-end justify-end pt-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider ${therapy.mutedColor} transition-colors`}
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
