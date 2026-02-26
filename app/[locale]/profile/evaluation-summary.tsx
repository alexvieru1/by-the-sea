'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@/i18n/routing';

interface EvaluationData {
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: string;
  profession: string | null;
  blood_type: string;
  weight: number;
  height: number;
  speaks_romanian: boolean;
  other_language: string | null;
  visual_impairment: boolean;
  hearing_impairment: boolean;
  speech_impairment: boolean;
  stroke: boolean;
  seizures: boolean;
  hemiparesis: boolean;
  hypertension: boolean;
  cardiopathy: boolean;
  swollen_feet: boolean;
  fatigue_stairs: boolean;
  varicose_veins: boolean;
  myocardial_infarction: boolean;
  chest_pain: boolean;
  irregular_heartbeat: boolean;
  cardiac_pacemaker: boolean;
  pacemaker_type: string | null;
  valvulopathy: boolean;
  bronchitis: boolean;
  respiratory_virus: boolean;
  shortness_of_breath: boolean;
  tuberculosis: boolean;
  smoker: boolean;
  cigarettes_per_day: number | null;
  hepatitis: boolean;
  gastric_ulcer: boolean;
  diabetes: boolean;
  hemophilia: boolean;
  recent_bleeding: boolean;
  anemia: boolean;
  hiv_infection: boolean;
  spinal_problems: boolean;
  kidney_disease: boolean;
  thyroid_disease: boolean;
  myasthenia_gravis: boolean;
  duchenne_disease: boolean;
  rheumatic_diseases: boolean;
  accidents_trauma: boolean;
  psychiatric_conditions: boolean;
  other_conditions: string | null;
  cultural_restrictions: boolean;
  recent_infectious_contact: boolean;
  pregnancy: boolean;
  pregnancy_weeks: number | null;
  medication_last_month: string | null;
  previous_surgeries: boolean;
  created_at: string;
}

interface EvaluationSummaryProps {
  evaluation: EvaluationData | null;
}

const sectionTitleClass = 'mb-3 text-xs font-semibold uppercase tracking-widest text-[#4a9ead]';
const subsectionTitleClass = 'mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-gray-400 first:mt-0';
const valueClass = 'text-sm text-gray-900';
const labelSmClass = 'text-xs uppercase tracking-wider text-gray-500';

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className={labelSmClass}>{label}</p>
      <p className={valueClass}>{value ?? '—'}</p>
    </div>
  );
}

function BooleanBadge({ value, label }: { value: boolean; label: string }) {
  if (!value) return null;
  return (
    <span className="inline-block border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
      {label}
    </span>
  );
}

function YesNoRow({ label, value, detail }: { label: string; value: boolean; detail?: string | null }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {detail && <span className="text-xs text-gray-500">{detail}</span>}
        <span className={`text-base ${value ? 'text-red-600' : 'text-gray-900'}`}>
          {value ? '●' : '○'}
        </span>
      </div>
    </div>
  );
}

function ExpandToggle({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="ml-auto flex h-5 w-5 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
      aria-label={expanded ? 'Collapse' : 'Expand'}
    >
      <motion.span
        className="block text-lg leading-none"
        animate={{ rotate: expanded ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        +
      </motion.span>
    </button>
  );
}

function ExpandableContent({ expanded, children }: { expanded: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function EvaluationSummary({ evaluation }: EvaluationSummaryProps) {
  const t = useTranslations('evaluation');
  const t1 = useTranslations('evaluation.step1');
  const t2 = useTranslations('evaluation.step2');
  const t3 = useTranslations('evaluation.step3');
  const t4 = useTranslations('evaluation.step4');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!evaluation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-700">
          {t('title')}
        </h2>
        <p className="mb-4 text-sm text-gray-500">{t('noEvaluation')}</p>
        <Link
          href="/evaluation"
          className="inline-block border border-gray-300 bg-white px-6 py-3 text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t('fillEvaluation')}
        </Link>
      </motion.div>
    );
  }

  const medicalConditions = [
    { key: 'stroke', label: t3('stroke'), value: evaluation.stroke },
    { key: 'seizures', label: t3('seizures'), value: evaluation.seizures },
    { key: 'hemiparesis', label: t3('hemiparesis'), value: evaluation.hemiparesis },
    { key: 'hypertension', label: t3('hypertension'), value: evaluation.hypertension },
    { key: 'cardiopathy', label: t3('cardiopathy'), value: evaluation.cardiopathy },
    { key: 'swollen_feet', label: t3('swollenFeet'), value: evaluation.swollen_feet },
    { key: 'fatigue_stairs', label: t3('fatigueStairs'), value: evaluation.fatigue_stairs },
    { key: 'varicose_veins', label: t3('varicoseVeins'), value: evaluation.varicose_veins },
    { key: 'myocardial_infarction', label: t3('myocardialInfarction'), value: evaluation.myocardial_infarction },
    { key: 'chest_pain', label: t3('chestPain'), value: evaluation.chest_pain },
    { key: 'irregular_heartbeat', label: t3('irregularHeartbeat'), value: evaluation.irregular_heartbeat },
    { key: 'cardiac_pacemaker', label: t3('cardiacPacemaker'), value: evaluation.cardiac_pacemaker },
    { key: 'valvulopathy', label: t3('valvulopathy'), value: evaluation.valvulopathy },
    { key: 'bronchitis', label: t3('bronchitis'), value: evaluation.bronchitis },
    { key: 'respiratory_virus', label: t3('respiratoryVirus'), value: evaluation.respiratory_virus },
    { key: 'shortness_of_breath', label: t3('shortnessOfBreath'), value: evaluation.shortness_of_breath },
    { key: 'tuberculosis', label: t3('tuberculosis'), value: evaluation.tuberculosis },
    { key: 'smoker', label: t3('smoker'), value: evaluation.smoker },
    { key: 'hepatitis', label: t3('hepatitis'), value: evaluation.hepatitis },
    { key: 'gastric_ulcer', label: t3('gastricUlcer'), value: evaluation.gastric_ulcer },
    { key: 'diabetes', label: t3('diabetes'), value: evaluation.diabetes },
    { key: 'hemophilia', label: t3('hemophilia'), value: evaluation.hemophilia },
    { key: 'recent_bleeding', label: t3('recentBleeding'), value: evaluation.recent_bleeding },
    { key: 'anemia', label: t3('anemia'), value: evaluation.anemia },
    { key: 'hiv_infection', label: t3('hivInfection'), value: evaluation.hiv_infection },
    { key: 'spinal_problems', label: t3('spinalProblems'), value: evaluation.spinal_problems },
    { key: 'kidney_disease', label: t3('kidneyDisease'), value: evaluation.kidney_disease },
    { key: 'thyroid_disease', label: t3('thyroidDisease'), value: evaluation.thyroid_disease },
    { key: 'myasthenia_gravis', label: t3('myastheniaGravis'), value: evaluation.myasthenia_gravis },
    { key: 'duchenne_disease', label: t3('duchenneDisease'), value: evaluation.duchenne_disease },
    { key: 'rheumatic_diseases', label: t3('rheumaticDiseases'), value: evaluation.rheumatic_diseases },
    { key: 'accidents_trauma', label: t3('accidentsTrauma'), value: evaluation.accidents_trauma },
    { key: 'psychiatric_conditions', label: t3('psychiatricConditions'), value: evaluation.psychiatric_conditions },
  ];

  const activeConditions = medicalConditions.filter((c) => c.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-700">
        {t('title')}
      </h2>

      {/* Personal Data */}
      <div className="mb-6">
        <p className={sectionTitleClass}>{t('stepLabel1')}</p>
        <div className="grid grid-cols-2 gap-3">
          <InfoRow label={t1('firstName')} value={evaluation.first_name} />
          <InfoRow label={t1('lastName')} value={evaluation.last_name} />
          <InfoRow label={t1('age')} value={evaluation.age} />
          <InfoRow label={t1('dateOfBirth')} value={evaluation.date_of_birth} />
          <InfoRow label={t1('profession')} value={evaluation.profession} />
          <InfoRow label={t1('bloodType')} value={evaluation.blood_type} />
          <InfoRow label={t1('weight')} value={`${evaluation.weight} kg`} />
          <InfoRow label={t1('height')} value={`${evaluation.height} cm`} />
        </div>
      </div>

      {/* Communication */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4a9ead]">{t('stepLabel2')}</p>
          <ExpandToggle expanded={!!expandedSections.communication} onToggle={() => toggle('communication')} />
        </div>
        <div className="space-y-2">
          <p className={valueClass}>
            {evaluation.speaks_romanian ? t2('speaksRomanian') : `${t2('otherLanguage')}: ${evaluation.other_language}`}
          </p>
          <div className="flex flex-wrap gap-2">
            <BooleanBadge value={evaluation.visual_impairment} label={t2('visualImpairment')} />
            <BooleanBadge value={evaluation.hearing_impairment} label={t2('hearingImpairment')} />
            <BooleanBadge value={evaluation.speech_impairment} label={t2('speechImpairment')} />
          </div>
        </div>

        <ExpandableContent expanded={!!expandedSections.communication}>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t2('visualImpairment')} value={evaluation.visual_impairment} />
            <YesNoRow label={t2('hearingImpairment')} value={evaluation.hearing_impairment} />
            <YesNoRow label={t2('speechImpairment')} value={evaluation.speech_impairment} />
          </div>
        </ExpandableContent>
      </div>

      {/* Medical History */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4a9ead]">{t('stepLabel3')}</p>
          <ExpandToggle expanded={!!expandedSections.medical} onToggle={() => toggle('medical')} />
        </div>

        {/* Compact view — always visible */}
        <div>
          {activeConditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeConditions.map((c) => (
                <span
                  key={c.key}
                  className="inline-block border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-700"
                >
                  {c.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('noConditions')}</p>
          )}

          {evaluation.cardiac_pacemaker && evaluation.pacemaker_type && (
            <p className="mt-2 text-xs text-gray-600">
              {t3('pacemakerType')}: {evaluation.pacemaker_type}
            </p>
          )}
          {evaluation.smoker && evaluation.cigarettes_per_day && (
            <p className="mt-1 text-xs text-gray-600">
              {t3('cigarettesPerDay')}: {evaluation.cigarettes_per_day}
            </p>
          )}
          {evaluation.other_conditions && (
            <p className="mt-1 text-xs text-gray-600">
              {t3('otherConditions')}: {evaluation.other_conditions}
            </p>
          )}
        </div>

        {/* Expanded view — all fields grouped by subsection */}
        <ExpandableContent expanded={!!expandedSections.medical}>
          <p className={subsectionTitleClass}>{t3('neurological')}</p>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t3('stroke')} value={evaluation.stroke} />
            <YesNoRow label={t3('seizures')} value={evaluation.seizures} />
            <YesNoRow label={t3('hemiparesis')} value={evaluation.hemiparesis} />
          </div>

          <p className={subsectionTitleClass}>{t3('cardiovascular')}</p>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t3('hypertension')} value={evaluation.hypertension} />
            <YesNoRow label={t3('cardiopathy')} value={evaluation.cardiopathy} />
            <YesNoRow label={t3('swollenFeet')} value={evaluation.swollen_feet} />
            <YesNoRow label={t3('fatigueStairs')} value={evaluation.fatigue_stairs} />
            <YesNoRow label={t3('varicoseVeins')} value={evaluation.varicose_veins} />
            <YesNoRow label={t3('myocardialInfarction')} value={evaluation.myocardial_infarction} />
            <YesNoRow label={t3('chestPain')} value={evaluation.chest_pain} />
            <YesNoRow label={t3('irregularHeartbeat')} value={evaluation.irregular_heartbeat} />
            <YesNoRow
              label={t3('cardiacPacemaker')}
              value={evaluation.cardiac_pacemaker}
              detail={evaluation.cardiac_pacemaker ? evaluation.pacemaker_type : null}
            />
            <YesNoRow label={t3('valvulopathy')} value={evaluation.valvulopathy} />
          </div>

          <p className={subsectionTitleClass}>{t3('pulmonary')}</p>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t3('bronchitis')} value={evaluation.bronchitis} />
            <YesNoRow label={t3('respiratoryVirus')} value={evaluation.respiratory_virus} />
            <YesNoRow label={t3('shortnessOfBreath')} value={evaluation.shortness_of_breath} />
            <YesNoRow label={t3('tuberculosis')} value={evaluation.tuberculosis} />
            <YesNoRow
              label={t3('smoker')}
              value={evaluation.smoker}
              detail={evaluation.smoker && evaluation.cigarettes_per_day ? `${evaluation.cigarettes_per_day} ${t3('cigarettesPerDay').toLowerCase()}` : null}
            />
          </div>

          <p className={subsectionTitleClass}>{t3('hepaticGastric')}</p>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t3('hepatitis')} value={evaluation.hepatitis} />
            <YesNoRow label={t3('gastricUlcer')} value={evaluation.gastric_ulcer} />
            <YesNoRow label={t3('diabetes')} value={evaluation.diabetes} />
          </div>

          <p className={subsectionTitleClass}>{t3('hematological')}</p>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t3('hemophilia')} value={evaluation.hemophilia} />
            <YesNoRow label={t3('recentBleeding')} value={evaluation.recent_bleeding} />
            <YesNoRow label={t3('anemia')} value={evaluation.anemia} />
            <YesNoRow label={t3('hivInfection')} value={evaluation.hiv_infection} />
          </div>

          <p className={subsectionTitleClass}>{t3('other')}</p>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t3('spinalProblems')} value={evaluation.spinal_problems} />
            <YesNoRow label={t3('kidneyDisease')} value={evaluation.kidney_disease} />
            <YesNoRow label={t3('thyroidDisease')} value={evaluation.thyroid_disease} />
            <YesNoRow label={t3('myastheniaGravis')} value={evaluation.myasthenia_gravis} />
            <YesNoRow label={t3('duchenneDisease')} value={evaluation.duchenne_disease} />
            <YesNoRow label={t3('rheumaticDiseases')} value={evaluation.rheumatic_diseases} />
            <YesNoRow label={t3('accidentsTrauma')} value={evaluation.accidents_trauma} />
            <YesNoRow label={t3('psychiatricConditions')} value={evaluation.psychiatric_conditions} />
          </div>

          {evaluation.other_conditions && (
            <div className="mt-3">
              <InfoRow label={t3('otherConditions')} value={evaluation.other_conditions} />
            </div>
          )}
        </ExpandableContent>
      </div>

      {/* Additional Info */}
      <div>
        <div className="mb-3 flex items-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4a9ead]">{t('stepLabel4')}</p>
          <ExpandToggle expanded={!!expandedSections.additional} onToggle={() => toggle('additional')} />
        </div>

        {/* Compact view */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <BooleanBadge value={evaluation.cultural_restrictions} label={t4('culturalRestrictions')} />
            <BooleanBadge value={evaluation.recent_infectious_contact} label={t4('recentInfectiousContact')} />
            <BooleanBadge value={evaluation.previous_surgeries} label={t4('previousSurgeries')} />
            <BooleanBadge value={evaluation.pregnancy} label={t4('pregnancy')} />
          </div>
          {evaluation.pregnancy && evaluation.pregnancy_weeks && (
            <p className="text-xs text-gray-600">
              {t4('pregnancyWeeks')}: {evaluation.pregnancy_weeks}
            </p>
          )}
          {evaluation.medication_last_month && (
            <div className="mt-2">
              <p className={labelSmClass}>{t4('medicationLastMonth')}</p>
              <p className="text-sm text-gray-900">{evaluation.medication_last_month}</p>
            </div>
          )}
        </div>

        {/* Expanded view */}
        <ExpandableContent expanded={!!expandedSections.additional}>
          <div className="divide-y divide-gray-50">
            <YesNoRow label={t4('culturalRestrictions')} value={evaluation.cultural_restrictions} />
            <YesNoRow label={t4('recentInfectiousContact')} value={evaluation.recent_infectious_contact} />
            <YesNoRow
              label={t4('pregnancy')}
              value={evaluation.pregnancy}
              detail={evaluation.pregnancy && evaluation.pregnancy_weeks ? `${evaluation.pregnancy_weeks} ${t4('pregnancyWeeks').toLowerCase()}` : null}
            />
            <YesNoRow label={t4('previousSurgeries')} value={evaluation.previous_surgeries} />
          </div>
          {evaluation.medication_last_month && (
            <div className="mt-3">
              <InfoRow label={t4('medicationLastMonth')} value={evaluation.medication_last_month} />
            </div>
          )}
        </ExpandableContent>
      </div>
    </motion.div>
  );
}
