'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { FlaskConical, Heart, Waves, CircleDot } from 'lucide-react';
import ParallaxImage from '@/components/ui/parallax-image';
import TransitionLink from '@/components/layout/transition-link';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const values = [
  { key: 'evidenceBased', icon: FlaskConical },
  { key: 'personalizedCare', icon: Heart },
  { key: 'natureHealing', icon: Waves },
  { key: 'holisticApproach', icon: CircleDot },
] as const;

const team = [
  { name: 'Dr. Tatiana Tulea' },
  { name: 'Dr. Daniel Rafti' },
  { name: 'Dr. Alexandra Pastramă' },
  { name: 'Dr. Camelia Ciobotaru' },
];

export default function AboutContent() {
  const t = useTranslations('aboutContent');
  const tCommon = useTranslations('common');

  return (
    <>
      {/* Section 1: Intro Block A — Image left, text right */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ParallaxImage label="About Vraja Marii" src="/images/about/about-1.webp" />
            <div>
              <p className="text-gray-700 leading-relaxed">
                {t('description')}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('description-2')}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Intro Block B — Text left, image right */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-gray-700 leading-relaxed">
                {t('description-3')}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('description-4')}
              </p>
            </div>
            <ParallaxImage label="Seaside Healing" src="/images/about/about-2.webp" />
          </div>
        </div>
      </motion.section>

      {/* Section 3: Vision & Mission */}
      <motion.section {...fadeInUp} className="bg-[#F2E4D1]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision Card */}
            <div className="border-t-4 border-[#002343] bg-white p-8 lg:p-10">
              <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('visionTitle')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">{t('visionDescription')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('visionDescription-2')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('visionDescription-3')}</p>
            </div>
            {/* Mission Card */}
            <div className="border-t-4 border-[#CF9C7C] bg-white p-8 lg:p-10">
              <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('missionTitle')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">{t('missionDescription')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('missionDescription-2')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('missionDescription-3')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 4: Core Values */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="text-center font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
            {t('valuesTitle')}
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {values.map(({ key, icon: Icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <Icon size={24} className="mx-auto text-[#002343]" />
                <h3 className="mt-4 font-semibold text-gray-900">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t(`values.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 5: Team */}
      {/* <section className="bg-[#F2E4D1]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
              {t('teamTitle')}
            </h2>
            <p className="mt-4 text-gray-600">{t('teamDescription')}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {team.map(({ name }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="aspect-square w-full bg-gray-200" />
                <h3 className="mt-4 font-semibold text-gray-900">{name}</h3>
                <p className="mt-1 text-sm text-gray-600">Medic Specialist</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Section 6: Timeline (commented out — awaiting management decision) */}
      
      {/* <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="text-center font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
            Timeline Title
          </h2>
          <div className="relative mt-12">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#D1CCC7]" />
          </div>
        </div>
      </motion.section> */}
     

      {/* Section 7: CTA */}
      <section className="bg-[#002343] px-6 py-20 lg:px-12 lg:py-28 light-header-section">
        <motion.div {...fadeInUp} className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-white sm:text-4xl">
            {t('ctaTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            {t('ctaDescription')}
          </p>
          <TransitionLink
            href="/book"
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-[#002343] transition-colors hover:bg-gray-100"
          >
            {tCommon('requestStay')}
          </TransitionLink>
        </motion.div>
      </section>
    </>
  );
}
