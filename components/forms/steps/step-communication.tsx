'use client';

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';

interface StepCommunicationProps {
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
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-gray-900">{label}</span>
      <div className="flex shrink-0 gap-1">
        <label className="cursor-pointer">
          <input
            type="radio"
            value="yes"
            {...register(id)}
            className="peer sr-only"
          />
          <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-[#4a9ead] peer-checked:bg-[#4a9ead] peer-checked:text-white">
            {tYes}
          </span>
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            value="no"
            {...register(id)}
            className="peer sr-only"
          />
          <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white">
            {tNo}
          </span>
        </label>
      </div>
      {error && <p className={errorClass}></p>}
    </div>
  );
}

export default function StepCommunication({ register, watch, errors }: StepCommunicationProps) {
  const t = useTranslations('evaluation.step2');
  const tCommon = useTranslations('evaluation');
  const tErr = useTranslations('evaluation.errors');
  const speaksRomanian = watch('speaks_romanian');

  const tYes = tCommon('yes');
  const tNo = tCommon('no');

  return (
    <div className="space-y-1">
      <div>
        <YesNoField
          id="speaks_romanian"
          label={t('speaksRomanian')}
          register={register}
          error={!!errors.speaks_romanian}
          tYes={tYes}
          tNo={tNo}
        />
        {errors.speaks_romanian && <p className={errorClass}>{tErr('required')}</p>}
      </div>

      {speaksRomanian === 'no' && (
        <div className="pb-2 pl-0">
          <label htmlFor="other_language" className={labelClass}>
            {t('otherLanguage')} *
          </label>
          <input
            id="other_language"
            type="text"
            {...register('other_language')}
            className={inputClass}
            placeholder={t('otherLanguagePlaceholder')}
          />
          {errors.other_language && <p className={errorClass}>{tErr('required')}</p>}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-700">
          {t('impairments')}
        </p>

        <div>
          <YesNoField
            id="visual_impairment"
            label={t('visualImpairment')}
            register={register}
            tYes={tYes}
            tNo={tNo}
          />
          {errors.visual_impairment && <p className={errorClass}>{tErr('required')}</p>}
        </div>

        <div>
          <YesNoField
            id="hearing_impairment"
            label={t('hearingImpairment')}
            register={register}
            tYes={tYes}
            tNo={tNo}
          />
          {errors.hearing_impairment && <p className={errorClass}>{tErr('required')}</p>}
        </div>

        <div>
          <YesNoField
            id="speech_impairment"
            label={t('speechImpairment')}
            register={register}
            tYes={tYes}
            tNo={tNo}
          />
          {errors.speech_impairment && <p className={errorClass}>{tErr('required')}</p>}
        </div>
      </div>
    </div>
  );
}
