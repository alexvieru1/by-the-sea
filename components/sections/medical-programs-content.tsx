'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import TransitionLink from '@/components/layout/transition-link';
import PageHero from '@/components/layout/page-hero';

const programs = [
  {
    key: 'medicalRehabilitation',
    slug: 'medical-rehabilitation',
    image: '/images/your_body.webp',
    gridClass: 'lg:col-span-2',
  },
  {
    key: 'endometriosisInfertility',
    slug: 'endometriosis-infertility',
    image: '/images/therapies/infertility.webp',
    gridClass: 'lg:col-span-1',
  },
  {
    key: 'longevity',
    slug: 'longevity',
    image: '/images/your_future.webp',
    gridClass: 'lg:col-span-1',
  },
  {
    key: 'rheumatology',
    slug: 'rheumatology',
    image: '/images/therapies/rheumatology.webp',
    gridClass: 'lg:col-span-2',
  },
  {
    key: 'postChemotherapy',
    slug: 'post-chemotherapy',
    image: '/images/therapies/post-chemotherapy.webp',
    gridClass: 'lg:col-span-3',
  },
];

function ProgramCard({
  programKey,
  slug,
  image,
  gridClass,
  index,
}: {
  programKey: string;
  slug: string;
  image: string;
  gridClass: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const t = useTranslations('medicalPrograms');
  const tTherapies = useTranslations('therapies');
  const tCommon = useTranslations('common');

  const prefix = `${programKey}.`;
  const title = t(`${prefix}title`);
  const subtitle = t(`${prefix}subtitle`);
  const description = t(`${prefix}description`);

  const therapyIds = t.has(`${prefix}page.therapyIds`)
    ? t(`${prefix}page.therapyIds`).split(',')
    : [];
  const therapyNames = therapyIds.map((id) => tTherapies(`${id}.name`));

  return (
    <motion.div
      ref={ref}
      className={gridClass}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <TransitionLink
        href={`/medical-programs/${slug}`}
        className="group relative block h-full min-h-[400px] overflow-hidden lg:min-h-[500px]"
      >
        {/* Background image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-colors duration-500 group-hover:from-black/85 group-hover:via-black/50" />

        {/* Content */}
        <div className="relative flex h-full min-h-[400px] flex-col justify-end p-6 lg:min-h-[500px] lg:p-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/60">
            {subtitle}
          </p>

          <h2 className="font-(family-name:--font-quicksand) text-3xl font-thin text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 lg:text-base">
            {description}
          </p>

          {therapyNames.length > 0 && (
            <p className="mt-4 text-xs text-white/50 lg:text-sm">
              {therapyNames.join(' · ')}
            </p>
          )}

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white transition-all group-hover:gap-3">
            {tCommon('learnMore')}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </TransitionLink>
    </motion.div>
  );
}

export default function MedicalProgramsContent() {
  const t = useTranslations('pages.medicalPrograms');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

      <div className="grid gap-1 lg:grid-cols-3 light-header-section">
        {programs.map((program, index) => (
          <ProgramCard
            key={program.slug}
            programKey={program.key}
            slug={program.slug}
            image={program.image}
            gridClass={program.gridClass}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
