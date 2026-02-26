'use client';

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';
import { medicalSubsections } from '@/lib/schemas/evaluation-form-schema';

interface StepMedicalHistoryProps {
  register: UseFormRegister<EvaluationFormData>;
  watch: UseFormWatch<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
  setValue: UseFormSetValue<EvaluationFormData>;
}

const inputClass =
  'w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#4a9ead]';
const labelClass =
  'mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700';
const errorClass = 'mt-1 text-xs text-red-500';
const sectionTitleClass =
  'text-xs font-semibold uppercase tracking-widest text-[#4a9ead]';

function YesNoField({
  id,
  label,
  register,
  error,
  tYes,
  tNo,
}: {
  id: keyof EvaluationFormData;
  label: string;
  register: UseFormRegister<EvaluationFormData>;
  error?: boolean;
  tYes: string;
  tNo: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 py-1.5">
        <span className="text-sm text-gray-900">{label}</span>
        <div className="flex shrink-0 gap-1">
          <label className="cursor-pointer">
            <input type="radio" value="yes" {...register(id)} className="peer sr-only !fixed" />
            <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-[#4a9ead] peer-checked:bg-[#4a9ead] peer-checked:text-white">
              {tYes}
            </span>
          </label>
          <label className="cursor-pointer">
            <input type="radio" value="no" {...register(id)} className="peer sr-only !fixed" />
            <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white">
              {tNo}
            </span>
          </label>
        </div>
      </div>
      {error && <p className={errorClass}>*</p>}
    </div>
  );
}

function SectionHeader({
  title,
  fields,
  setValue,
  noneLabel,
}: {
  title: string;
  fields: readonly string[];
  setValue: UseFormSetValue<EvaluationFormData>;
  noneLabel: string;
}) {
  const handleNone = () => {
    for (const field of fields) {
      setValue(field as keyof EvaluationFormData, 'no' as never, { shouldValidate: true });
    }
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <p className={sectionTitleClass}>{title}</p>
      <button
        type="button"
        onClick={handleNone}
        className="text-[10px] font-medium uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-700"
      >
        {noneLabel}
      </button>
    </div>
  );
}

export default function StepMedicalHistory({ register, watch, errors, setValue }: StepMedicalHistoryProps) {
  const t = useTranslations('evaluation.step3');
  const tCommon = useTranslations('evaluation');
  const tErr = useTranslations('evaluation.errors');

  const hasPacemaker = watch('cardiac_pacemaker');
  const isSmoker = watch('smoker');

  const tYes = tCommon('yes');
  const tNo = tCommon('no');
  const noneLabel = tCommon('none');

  return (
    <div className="space-y-6">
      {/* Neurological */}
      <div>
        <SectionHeader title={t('neurological')} fields={medicalSubsections.neurological} setValue={setValue} noneLabel={noneLabel} />
        <div className="space-y-0">
          <YesNoField id="stroke" label={t('stroke')} register={register} error={!!errors.stroke} tYes={tYes} tNo={tNo} />
          <YesNoField id="seizures" label={t('seizures')} register={register} error={!!errors.seizures} tYes={tYes} tNo={tNo} />
          <YesNoField id="hemiparesis" label={t('hemiparesis')} register={register} error={!!errors.hemiparesis} tYes={tYes} tNo={tNo} />
        </div>
      </div>

      {/* Cardiovascular */}
      <div className="border-t border-gray-200 pt-5">
        <SectionHeader title={t('cardiovascular')} fields={medicalSubsections.cardiovascular} setValue={setValue} noneLabel={noneLabel} />
        <div className="space-y-0">
          <YesNoField id="hypertension" label={t('hypertension')} register={register} error={!!errors.hypertension} tYes={tYes} tNo={tNo} />
          <YesNoField id="cardiopathy" label={t('cardiopathy')} register={register} error={!!errors.cardiopathy} tYes={tYes} tNo={tNo} />
          <YesNoField id="swollen_feet" label={t('swollenFeet')} register={register} error={!!errors.swollen_feet} tYes={tYes} tNo={tNo} />
          <YesNoField id="fatigue_stairs" label={t('fatigueStairs')} register={register} error={!!errors.fatigue_stairs} tYes={tYes} tNo={tNo} />
          <YesNoField id="varicose_veins" label={t('varicoseVeins')} register={register} error={!!errors.varicose_veins} tYes={tYes} tNo={tNo} />
          <YesNoField id="myocardial_infarction" label={t('myocardialInfarction')} register={register} error={!!errors.myocardial_infarction} tYes={tYes} tNo={tNo} />
          <YesNoField id="chest_pain" label={t('chestPain')} register={register} error={!!errors.chest_pain} tYes={tYes} tNo={tNo} />
          <YesNoField id="irregular_heartbeat" label={t('irregularHeartbeat')} register={register} error={!!errors.irregular_heartbeat} tYes={tYes} tNo={tNo} />
          <YesNoField id="cardiac_pacemaker" label={t('cardiacPacemaker')} register={register} error={!!errors.cardiac_pacemaker} tYes={tYes} tNo={tNo} />

          {hasPacemaker === 'yes' && (
            <div className="py-2 pl-4">
              <label htmlFor="pacemaker_type" className={labelClass}>
                {t('pacemakerType')} *
              </label>
              <input
                id="pacemaker_type"
                type="text"
                {...register('pacemaker_type')}
                className={inputClass}
                placeholder={t('pacemakerTypePlaceholder')}
              />
              {errors.pacemaker_type && <p className={errorClass}>{tErr('required')}</p>}
            </div>
          )}

          <YesNoField id="valvulopathy" label={t('valvulopathy')} register={register} error={!!errors.valvulopathy} tYes={tYes} tNo={tNo} />
        </div>
      </div>

      {/* Pulmonary */}
      <div className="border-t border-gray-200 pt-5">
        <SectionHeader title={t('pulmonary')} fields={medicalSubsections.pulmonary} setValue={setValue} noneLabel={noneLabel} />
        <div className="space-y-0">
          <YesNoField id="bronchitis" label={t('bronchitis')} register={register} error={!!errors.bronchitis} tYes={tYes} tNo={tNo} />
          <YesNoField id="respiratory_virus" label={t('respiratoryVirus')} register={register} error={!!errors.respiratory_virus} tYes={tYes} tNo={tNo} />
          <YesNoField id="shortness_of_breath" label={t('shortnessOfBreath')} register={register} error={!!errors.shortness_of_breath} tYes={tYes} tNo={tNo} />
          <YesNoField id="tuberculosis" label={t('tuberculosis')} register={register} error={!!errors.tuberculosis} tYes={tYes} tNo={tNo} />
          <YesNoField id="smoker" label={t('smoker')} register={register} error={!!errors.smoker} tYes={tYes} tNo={tNo} />

          {isSmoker === 'yes' && (
            <div className="py-2 pl-4">
              <label htmlFor="cigarettes_per_day" className={labelClass}>
                {t('cigarettesPerDay')} *
              </label>
              <input
                id="cigarettes_per_day"
                type="number"
                min={1}
                {...register('cigarettes_per_day')}
                className={inputClass}
              />
              {errors.cigarettes_per_day && <p className={errorClass}>{tErr('required')}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Hepatic / Gastric */}
      <div className="border-t border-gray-200 pt-5">
        <SectionHeader title={t('hepaticGastric')} fields={medicalSubsections.hepaticGastric} setValue={setValue} noneLabel={noneLabel} />
        <div className="space-y-0">
          <YesNoField id="hepatitis" label={t('hepatitis')} register={register} error={!!errors.hepatitis} tYes={tYes} tNo={tNo} />
          <YesNoField id="gastric_ulcer" label={t('gastricUlcer')} register={register} error={!!errors.gastric_ulcer} tYes={tYes} tNo={tNo} />
          <YesNoField id="diabetes" label={t('diabetes')} register={register} error={!!errors.diabetes} tYes={tYes} tNo={tNo} />
        </div>
      </div>

      {/* Hematological */}
      <div className="border-t border-gray-200 pt-5">
        <SectionHeader title={t('hematological')} fields={medicalSubsections.hematological} setValue={setValue} noneLabel={noneLabel} />
        <div className="space-y-0">
          <YesNoField id="hemophilia" label={t('hemophilia')} register={register} error={!!errors.hemophilia} tYes={tYes} tNo={tNo} />
          <YesNoField id="recent_bleeding" label={t('recentBleeding')} register={register} error={!!errors.recent_bleeding} tYes={tYes} tNo={tNo} />
          <YesNoField id="anemia" label={t('anemia')} register={register} error={!!errors.anemia} tYes={tYes} tNo={tNo} />
          <YesNoField id="hiv_infection" label={t('hivInfection')} register={register} error={!!errors.hiv_infection} tYes={tYes} tNo={tNo} />
        </div>
      </div>

      {/* Other Conditions */}
      <div className="border-t border-gray-200 pt-5">
        <SectionHeader title={t('other')} fields={medicalSubsections.other} setValue={setValue} noneLabel={noneLabel} />
        <div className="space-y-0">
          <YesNoField id="spinal_problems" label={t('spinalProblems')} register={register} error={!!errors.spinal_problems} tYes={tYes} tNo={tNo} />
          <YesNoField id="kidney_disease" label={t('kidneyDisease')} register={register} error={!!errors.kidney_disease} tYes={tYes} tNo={tNo} />
          <YesNoField id="thyroid_disease" label={t('thyroidDisease')} register={register} error={!!errors.thyroid_disease} tYes={tYes} tNo={tNo} />
          <YesNoField id="myasthenia_gravis" label={t('myastheniaGravis')} register={register} error={!!errors.myasthenia_gravis} tYes={tYes} tNo={tNo} />
          <YesNoField id="duchenne_disease" label={t('duchenneDisease')} register={register} error={!!errors.duchenne_disease} tYes={tYes} tNo={tNo} />
          <YesNoField id="rheumatic_diseases" label={t('rheumaticDiseases')} register={register} error={!!errors.rheumatic_diseases} tYes={tYes} tNo={tNo} />
          <YesNoField id="accidents_trauma" label={t('accidentsTrauma')} register={register} error={!!errors.accidents_trauma} tYes={tYes} tNo={tNo} />
          <YesNoField id="psychiatric_conditions" label={t('psychiatricConditions')} register={register} error={!!errors.psychiatric_conditions} tYes={tYes} tNo={tNo} />
        </div>

        <div className="pt-3">
          <label htmlFor="other_conditions" className={labelClass}>
            {t('otherConditions')}
          </label>
          <input
            id="other_conditions"
            type="text"
            {...register('other_conditions')}
            className={inputClass}
            placeholder={t('otherConditionsPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}
