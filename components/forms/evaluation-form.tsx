'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '@/i18n/routing';
import {
  evaluationFormSchema,
  stepFields,
  type EvaluationFormData,
} from '@/lib/schemas/evaluation-form-schema';
import { submitEvaluationForm } from '@/lib/actions/submit-evaluation-form';
import StepPersonalData from './steps/step-personal-data';
import StepCommunication from './steps/step-communication';
import StepMedicalHistory from './steps/step-medical-history';
import StepAdditionalInfo from './steps/step-additional-info';

interface EvaluationFormProps {
  defaultValues?: Partial<EvaluationFormData>;
}

const TOTAL_STEPS = 4;

export default function EvaluationForm({ defaultValues }: EvaluationFormProps) {
  const t = useTranslations('evaluation');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      age: undefined as unknown as number,
      date_of_birth: '',
      profession: '',
      blood_type: 'unknown',
      weight: undefined as unknown as number,
      height: undefined as unknown as number,
      other_language: '',
      pacemaker_type: '',
      cigarettes_per_day: undefined,
      other_conditions: '',
      pregnancy_weeks: undefined,
      medication_last_month: '',
      ...defaultValues,
    },
    mode: 'onTouched',
  });

  const stepLabels = [t('stepLabel1'), t('stepLabel2'), t('stepLabel3'), t('stepLabel4')];

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await trigger(fields as (keyof EvaluationFormData)[]);
    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data: EvaluationFormData) => {
    setSubmitting(true);
    setSubmitError('');

    const result = await submitEvaluationForm(data);

    if (result.success) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(result.error ?? t('submitError'));
    }

    setSubmitting(false);
  };

  if (submitSuccess) {
    return (
      <motion.div
        className="mx-auto max-w-md py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-[#4a9ead] text-[#4a9ead]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl font-normal italic text-gray-900">
          {t('successTitle')}
        </h2>
        <p className="mb-8 text-sm text-gray-600">{t('successDescription')}</p>
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="w-full bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
        >
          {t('goToProfile')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Stepper indicators */}
      <div className="mb-8 flex items-center justify-between">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center border-2 text-xs font-semibold transition-colors ${
                  i < currentStep
                    ? 'border-[#4a9ead] bg-[#4a9ead] text-white'
                    : i === currentStep
                      ? 'border-[#4a9ead] bg-white text-[#4a9ead]'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {i < currentStep ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-1.5 hidden h-8 w-16 text-center text-[10px] font-medium uppercase leading-tight tracking-wider sm:block ${
                  i <= currentStep ? 'text-[#4a9ead]' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={`mx-2 h-px w-8 sm:w-12 md:w-16 ${
                  i < currentStep ? 'bg-[#4a9ead]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step title */}
      <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-700">
        {stepLabels[currentStep]}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 0 && (
              <StepPersonalData register={register} errors={errors} />
            )}
            {currentStep === 1 && (
              <StepCommunication register={register} watch={watch} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepMedicalHistory register={register} watch={watch} errors={errors} setValue={setValue} />
            )}
            {currentStep === 3 && (
              <StepAdditionalInfo register={register} watch={watch} errors={errors} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error message */}
        {submitError && (
          <motion.p
            className="mt-4 text-sm text-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {submitError}
          </motion.p>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 border border-gray-300 bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t('back')}
            </button>
          )}

          {currentStep < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {t('next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? '...' : t('submit')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
