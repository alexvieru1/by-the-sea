'use client';

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';

interface StepCommunicationProps {
  register: UseFormRegister<EvaluationFormData>;
  watch: UseFormWatch<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
}

import { inputClass, labelClass, errorClass } from '@/lib/form-styles';
import YesNoField from '@/components/forms/yes-no-field';

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
