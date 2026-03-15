'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';
import PageHero from '@/components/layout/page-hero';
import ProgramTherapiesGrid from '@/components/sections/program-therapies-grid';

const allTherapyIds = [
  'physiotherapy',
  'balneotherapy',
  'electrotherapy',
  'kinesiotherapy',
  'massageTherapy',
  'functionalMedicineAssessment',
  'pelvicPhysiotherapy',
  'stressReductionProgram',
  'nutritionalCounselling',
  'cryotherapy',
  'ivNutrientTherapy',
  'biomarkerAnalysis',
  'hyperbaricOxygenTherapy',
  'infraredSauna',
  'mudTherapy',
  'hydrotherapy',
  'antiInflammatoryNutrition',
  'immuneSupportTherapy',
  'gentlePhysiotherapy',
  'nutritionalRehabilitation',
  'relaxationTherapy',
  'lymphaticDrainage',
];

export default function TherapiesContent() {
  const t = useTranslations('pages.therapies');
  const tTherapies = useTranslations('therapies');
  const tCommon = useTranslations('common');

  const therapies = allTherapyIds.map((id) => ({
    name: tTherapies(`${id}.name`),
    description: tTherapies(`${id}.description`),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

      <ProgramTherapiesGrid
        title={t('title')}
        therapies={therapies}
        accentColor="#002343"
      />

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
              href="/waitlist"
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
