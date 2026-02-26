'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';
import { bloodTypeOptions } from '@/lib/schemas/evaluation-form-schema';

interface StepPersonalDataProps {
  register: UseFormRegister<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
}

const inputClass =
  'w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#4a9ead]';
const labelClass =
  'mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700';
const errorClass = 'mt-1 text-xs text-red-500';

export default function StepPersonalData({ register, errors }: StepPersonalDataProps) {
  const t = useTranslations('evaluation.step1');
  const tErr = useTranslations('evaluation.errors');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className={labelClass}>
            {t('firstName')} *
          </label>
          <input id="first_name" type="text" {...register('first_name')} className={inputClass} />
          {errors.first_name && <p className={errorClass}>{tErr('required')}</p>}
        </div>
        <div>
          <label htmlFor="last_name" className={labelClass}>
            {t('lastName')} *
          </label>
          <input id="last_name" type="text" {...register('last_name')} className={inputClass} />
          {errors.last_name && <p className={errorClass}>{tErr('required')}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="age" className={labelClass}>
            {t('age')} *
          </label>
          <input id="age" type="number" min={1} max={150} {...register('age')} onWheel={(e) => e.currentTarget.blur()} className={inputClass} />
          {errors.age && <p className={errorClass}>{tErr('required')}</p>}
        </div>
        <div>
          <label htmlFor="date_of_birth" className={labelClass}>
            {t('dateOfBirth')} *
          </label>
          <input id="date_of_birth" type="date" {...register('date_of_birth')} className={inputClass} />
          {errors.date_of_birth && <p className={errorClass}>{tErr('required')}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="profession" className={labelClass}>
          {t('profession')}
        </label>
        <input id="profession" type="text" {...register('profession')} className={inputClass} />
      </div>

      <div>
        <label htmlFor="blood_type" className={labelClass}>
          {t('bloodType')} *
        </label>
        <select id="blood_type" {...register('blood_type')} className={inputClass}>
          {bloodTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'unknown' ? t('bloodTypeUnknown') : opt}
            </option>
          ))}
        </select>
        {errors.blood_type && <p className={errorClass}>{tErr('required')}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="weight" className={labelClass}>
            {t('weight')} *
          </label>
          <input id="weight" type="number" min={1} max={500} {...register('weight')} onWheel={(e) => e.currentTarget.blur()} className={inputClass} />
          {errors.weight && <p className={errorClass}>{tErr('required')}</p>}
        </div>
        <div>
          <label htmlFor="height" className={labelClass}>
            {t('height')} *
          </label>
          <input id="height" type="number" min={1} max={300} {...register('height')} onWheel={(e) => e.currentTarget.blur()} className={inputClass} />
          {errors.height && <p className={errorClass}>{tErr('required')}</p>}
        </div>
      </div>
    </div>
  );
}
