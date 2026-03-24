'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import ParallaxImage from '@/components/ui/parallax-image';

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


export default function PatientGuideContent() {
  const t = useTranslations('patientGuide');

  return (
    <>
      {/* Section 1: Admission Process */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ParallaxImage label="Reception Area" src="/images/patient-guide/reception-area.webp" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#002343]">
                {t('admission.label')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
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
      <motion.section {...fadeInUp} className="bg-[#002343] px-6 py-16 lg:px-12 lg:py-20 light-header-section">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-white sm:text-4xl">
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
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-[#002343] transition-colors hover:bg-gray-100"
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
              <p className="text-sm font-medium uppercase tracking-wider text-[#002343]">
                {t('documents.label')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('documents.title')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                {t('documents.description')}
              </p>
              <div className="mt-8 space-y-4">
                {documentKeys.map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <CheckCircle size={20} className="mt-0.5 shrink-0 text-[#002343]" />
                    <span className="text-gray-700">{t(`documents.items.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <ParallaxImage label="Lobby" src="/images/patient-guide/lobby.webp" />
          </div>
        </div>
      </motion.section>

      {/* Section 4: Your Stay */}
      <motion.section {...fadeInUp} className="bg-[#F2E4D1]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ParallaxImage label="Treatment Room" src="/images/patient-guide/treatment-room-2.webp" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#002343]">
                {t('yourStay.label')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('yourStay.title')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                {t('yourStay.p1')}
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                {(['documents', 'contract', 'room', 'consultation'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#CF9C7C]" />
                    <span className="leading-relaxed">{t(`yourStay.steps.${key}`)}</span>
                  </li>
                ))}
              </ul>
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
          <h2 className="text-center font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
            {t('notices.title')}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(['refusal', 'dailyVisit', 'discharge'] as const).map((key) => (
              <div key={key} className="border-l-4 border-[#CF9C7C] bg-white p-8">
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
      {/* <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
            {t('contraindications.absoluteTitle')}
          </h2>
          <div className="mt-6 border-l-4 border-[#CF9C7C] bg-[#CF9C7C]/10 p-6">
            <p className="text-gray-800">
              {t('contraindications.absoluteWarning')}
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {absoluteKeys.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 bg-[#CF9C7C]" style={{ borderRadius: '9999px' }} />
                <span className="text-gray-700">{t(`contraindications.absolute.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section> */}

      {/* Section 7: Photo Divider */}
      <ParallaxImage label="Sea View" className="h-64 lg:h-96" src="/images/patient-guide/sea-view.webp" y={['-50%', '50%']}/>

      {/* Section 8: Relative Contraindications */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
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
      <section className="bg-[#F2E4D1] px-6 py-20 lg:px-12 lg:py-28">
        <motion.div {...fadeInUp} className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-quicksand)] text-2xl font-thin leading-relaxed text-gray-800 sm:text-3xl">
            {t('closingNote')}
          </p>
        </motion.div>
      </section>
    </>
  );
}
