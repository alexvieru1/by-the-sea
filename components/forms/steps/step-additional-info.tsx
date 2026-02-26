'use client';

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';

interface StepAdditionalInfoProps {
  register: UseFormRegister<EvaluationFormData>;
  watch: UseFormWatch<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
}

const inputClass =
  'w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#4a9ead]';
const labelClass =
  'mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700';
const errorClass = 'mt-1 text-xs text-red-500';

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
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-gray-900">{label}</span>
        <div className="flex shrink-0 gap-1">
          <label className="cursor-pointer">
            <input type="radio" value="yes" {...register(id)} className="peer sr-only" />
            <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-[#4a9ead] peer-checked:bg-[#4a9ead] peer-checked:text-white">
              {tYes}
            </span>
          </label>
          <label className="cursor-pointer">
            <input type="radio" value="no" {...register(id)} className="peer sr-only" />
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

export default function StepAdditionalInfo({ register, watch, errors }: StepAdditionalInfoProps) {
  const t = useTranslations('evaluation.step4');
  const tCommon = useTranslations('evaluation');
  const tErr = useTranslations('evaluation.errors');

  const isPregnant = watch('pregnancy');

  const tYes = tCommon('yes');
  const tNo = tCommon('no');

  return (
    <div className="space-y-1">
      <div>
        <YesNoField
          id="cultural_restrictions"
          label={t('culturalRestrictions')}
          register={register}
          error={!!errors.cultural_restrictions}
          tYes={tYes}
          tNo={tNo}
        />
        {errors.cultural_restrictions && <p className={errorClass}>{tErr('required')}</p>}
      </div>

      <div>
        <YesNoField
          id="recent_infectious_contact"
          label={t('recentInfectiousContact')}
          register={register}
          error={!!errors.recent_infectious_contact}
          tYes={tYes}
          tNo={tNo}
        />
        {errors.recent_infectious_contact && <p className={errorClass}>{tErr('required')}</p>}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <YesNoField
          id="pregnancy"
          label={t('pregnancy')}
          register={register}
          error={!!errors.pregnancy}
          tYes={tYes}
          tNo={tNo}
        />
        {errors.pregnancy && <p className={errorClass}>{tErr('required')}</p>}

        {isPregnant === 'yes' && (
          <div className="py-2 pl-4">
            <label htmlFor="pregnancy_weeks" className={labelClass}>
              {t('pregnancyWeeks')} *
            </label>
            <input
              id="pregnancy_weeks"
              type="number"
              min={1}
              max={42}
              {...register('pregnancy_weeks')}
              onWheel={(e) => e.currentTarget.blur()}
              className={inputClass}
            />
            {errors.pregnancy_weeks && <p className={errorClass}>{tErr('required')}</p>}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label htmlFor="medication_last_month" className={labelClass}>
          {t('medicationLastMonth')}
        </label>
        <textarea
          id="medication_last_month"
          rows={3}
          {...register('medication_last_month')}
          className={inputClass + ' resize-none'}
          placeholder={t('medicationPlaceholder')}
        />
      </div>

      <div>
        <YesNoField
          id="previous_surgeries"
          label={t('previousSurgeries')}
          register={register}
          error={!!errors.previous_surgeries}
          tYes={tYes}
          tNo={tNo}
        />
        {errors.previous_surgeries && <p className={errorClass}>{tErr('required')}</p>}
      </div>
    </div>
  );
}
