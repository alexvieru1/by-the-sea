'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';
import PageHero from '@/components/layout/page-hero';

const allTherapyIds = [
  'magnetotherapy',
  'mudWraps',
  'laserTherapy',
  'electrostimulation',
  'decontractingMassage',
  'ultrasoundTherapy',
  'mudBath',
  'tecarTherapy',
  'kinesiotherapy',
  'shortwaveTherapy',
  'deepOscillation',
  'pressotherapy',
  'therapeuticMassage',
  'galvanicBaths',
  'paraffinWraps',
  'painReliefElectrotherapy',
  'herbalBaths',
  'vichyShower',
  'emsella',
  'infraredMask',
  'ozoneSauna',
  'ozoneTherapy',
];

const COLUMNS = { sm: 2, lg: 3 };

function TherapyCard({
  id,
  index,
  isActive,
  onToggle,
}: {
  id: string;
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const tTherapies = useTranslations('therapies');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const name = tTherapies(`${id}.name`);
  const description = tTherapies(`${id}.description`);

  return (
    <motion.div
      ref={ref}
      className={`cursor-pointer bg-white p-6 shadow-sm transition-all duration-300 ${
        isActive ? 'ring-2 ring-[#002343]' : 'hover:shadow-md'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      onClick={onToggle}
    >
      <div className="mb-4 h-1 w-10 bg-[#002343]" />
      <h3 className="text-base font-medium text-gray-900">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
    </motion.div>
  );
}

function DetailPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const tTherapies = useTranslations('therapies');

  const name = tTherapies(`${id}.name`);
  const longDescription = tTherapies.has(`${id}.longDescription`)
    ? tTherapies(`${id}.longDescription`)
    : null;

  if (!longDescription) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full overflow-hidden"
    >
      <div className="bg-white p-8 shadow-sm lg:p-10">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-3xl">
            <h3 className="font-[family-name:var(--font-quicksand)] text-2xl font-thin text-gray-900 lg:text-3xl">
              {name}
            </h3>
            <div className="mt-6 space-y-4">
              {longDescription.split('\n\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-gray-600 lg:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 text-gray-400 transition-colors hover:text-gray-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TherapiesContent() {
  const t = useTranslations('pages.therapies');
  const tCommon = useTranslations('common');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Build rows with cards and detail panels inserted after the correct row
  const expandedIndex = expandedId ? allTherapyIds.indexOf(expandedId) : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

      <section ref={sectionRef} className="bg-gray-50 px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {t('title')}
          </motion.h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTherapyIds.map((id, i) => {
              // Determine if detail panel should appear after this card
              // Panel goes after the last card in the expanded card's row
              const rowEndLg = Math.ceil((expandedIndex + 1) / COLUMNS.lg) * COLUMNS.lg - 1;
              const rowEndSm = Math.ceil((expandedIndex + 1) / COLUMNS.sm) * COLUMNS.sm - 1;
              const isRowEndLg = expandedId && i === Math.min(rowEndLg, allTherapyIds.length - 1);
              const isRowEndSm = expandedId && i === Math.min(rowEndSm, allTherapyIds.length - 1);
              // On mobile (1 col), show after the expanded card itself
              const isRowEndMobile = expandedId && i === expandedIndex;

              return (
                <div key={id} className="contents">
                  <TherapyCard
                    id={id}
                    index={i}
                    isActive={expandedId === id}
                    onToggle={() => handleToggle(id)}
                  />
                  {/* Mobile: 1 col - show after expanded card */}
                  <AnimatePresence>
                    {isRowEndMobile && (
                      <div className="sm:hidden col-span-full">
                        <DetailPanel id={expandedId} onClose={() => setExpandedId(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                  {/* SM: 2 cols */}
                  <AnimatePresence>
                    {isRowEndSm && (
                      <div className="hidden sm:block lg:hidden col-span-full">
                        <DetailPanel id={expandedId} onClose={() => setExpandedId(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                  {/* LG: 3 cols */}
                  <AnimatePresence>
                    {isRowEndLg && (
                      <div className="hidden lg:block col-span-full">
                        <DetailPanel id={expandedId} onClose={() => setExpandedId(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <div className="bg-white px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <TransitionLink
              href="/medical-programs"
              className="inline-flex items-center gap-2 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {tCommon('allPrograms')}
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>

            <TransitionLink
              href="/book"
              className="inline-flex items-center gap-2 border border-gray-900 bg-transparent px-8 py-4 text-sm font-medium uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              {tCommon('requestStay')}
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}
