'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { CheckCircle, ExternalLink } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const absoluteKeys = [
  'pacemaker',
  'epilepsy',
  'psychiatric',
  'anemia',
  'malignantTumors',
  'infectious',
  'recentStroke',
  'recentHeartAttack',
  'mobilityImpaired',
  'pregnancy',
  'recentTrauma',
  'recentBleeding',
  'dialysis',
  'childrenUnder4',
] as const;

const relativeCategories = [
  { key: 'cardiac', items: ['atrialFibrillation', 'decompensatedCardiopathy', 'recentCoronary', 'uncontrolledHypertension'] },
  { key: 'neurological', items: ['stroke', 'alzheimer'] },
  { key: 'respiratory', items: ['activeTB', 'activeCOPD', 'decompensatedAsthma'] },
  { key: 'digestive', items: ['activeUlcer', 'recentHepatitis', 'hepaticCirrhosis'] },
  { key: 'renal', items: ['limitedFunction', 'decompensatedFailure'] },
  { key: 'dermatological', items: ['bedsores', 'purulentWounds', 'eczema', 'unhealedPostOp'] },
  { key: 'endocrine', items: ['addisons', 'unbalancedDiabetes', 'decompensatedHyperthyroidism'] },
  { key: 'oncological', items: ['malignantTumors'] },
] as const;

const documentKeys = ['referral', 'healthCard', 'id', 'employment'] as const;

function PlaceholderImage({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-gray-200 ${className ?? 'aspect-[4/3]'}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
          Photo: {label}
        </span>
      </div>
    </div>
  );
}

export default function PatientGuideContent() {
  const t = useTranslations('patientGuide');

  return (
    <>
      {/* Section 1: Admission Process */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <PlaceholderImage label="Reception Area" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#0097a7]">
                {t('admission.title')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl">
                {t('admission.title')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                {t('admission.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Insurance Check CTA */}
      <motion.section {...fadeInUp} className="bg-[#0097a7] px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-white sm:text-4xl">
            {t('insuranceCheck.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            {t('insuranceCheck.description')}
          </p>
          <div className="mt-6 bg-white/10 p-6">
            <p className="text-sm leading-relaxed text-white/80">
              {t('insuranceCheck.warning')}
            </p>
          </div>
          <a
            href="https://siui.casan.ro/asigurati/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-[#0097a7] transition-colors hover:bg-gray-100"
          >
            {t('insuranceCheck.cta')}
            <ExternalLink size={16} />
          </a>
        </div>
      </motion.section>

      {/* Section 3: Required Documents */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#0097a7]">
                {t('documents.title')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl">
                {t('documents.title')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                {t('documents.description')}
              </p>
              <div className="mt-8 space-y-4">
                {documentKeys.map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <CheckCircle size={20} className="mt-0.5 shrink-0 text-[#0097a7]" />
                    <span className="text-gray-700">{t(`documents.items.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <PlaceholderImage label="Lobby" />
          </div>
        </div>
      </motion.section>

      {/* Section 4: Your Stay */}
      <motion.section {...fadeInUp} className="bg-[#f8f5f3]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <PlaceholderImage label="Treatment Room" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#0097a7]">
                {t('yourStay.title')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl">
                {t('yourStay.title')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                {t('yourStay.p1')}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('yourStay.p2')}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 5: Important Notices */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="text-center font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl">
            {t('notices.title')}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(['refusal', 'dailyVisit', 'discharge'] as const).map((key) => (
              <div key={key} className="border-l-4 border-[#f07060] bg-white p-8">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {t(`notices.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {t(`notices.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 6: Absolute Contraindications */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl">
            {t('contraindications.absoluteTitle')}
          </h2>
          <div className="mt-6 border-l-4 border-[#f07060] bg-[#f07060]/10 p-6">
            <p className="text-gray-800">
              {t('contraindications.absoluteWarning')}
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {absoluteKeys.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 bg-[#f07060]" style={{ borderRadius: '9999px' }} />
                <span className="text-gray-700">{t(`contraindications.absolute.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 7: Photo Divider */}
      <PlaceholderImage label="Sea View" className="h-64 lg:h-96" />

      {/* Section 8: Relative Contraindications */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl">
            {t('contraindications.relativeTitle')}
          </h2>
          <div className="mt-6 border-l-4 border-amber-400 bg-amber-50 p-6">
            <p className="text-sm leading-relaxed text-gray-800">
              {t('contraindications.relativeNote')}
            </p>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {relativeCategories.map(({ key, items }) => (
              <div key={key}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
                  {t(`contraindications.relative.${key}.category`)}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-amber-400" style={{ borderRadius: '9999px' }} />
                      <span className="text-gray-700">
                        {t(`contraindications.relative.${key}.items.${item}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 9: Closing Note */}
      <section className="bg-[#c5d5d8] px-6 py-20 lg:px-12 lg:py-28">
        <motion.div {...fadeInUp} className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-playfair)] text-2xl font-normal italic leading-relaxed text-gray-800 sm:text-3xl">
            {t('closingNote')}
          </p>
        </motion.div>
      </section>
    </>
  );
}
