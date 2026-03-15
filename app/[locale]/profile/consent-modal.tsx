'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { acceptConsents } from './actions';

interface ConsentModalProps {
  isUpdate?: boolean;
}

export default function ConsentModal({ isUpdate = false }: ConsentModalProps) {
  const t = useTranslations('auth.profile');
  const router = useRouter();
  const [gdprChecked, setGdprChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [gdprError, setGdprError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const hasGdprError = !gdprChecked;
    const hasTermsError = !termsChecked;
    setGdprError(hasGdprError);
    setTermsError(hasTermsError);

    if (hasGdprError || hasTermsError) return;

    setIsSubmitting(true);
    const result = await acceptConsents();
    if (result.success) {
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-md bg-white p-8">
        <h2 className="mb-2 font-[family-name:var(--font-quicksand)] text-2xl font-thin text-gray-900">
          {isUpdate ? t('consentUpdateTitle') : t('consentModalTitle')}
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          {isUpdate ? t('consentUpdateDescription') : t('consentModalDescription')}
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              id="modal-gdpr"
              type="checkbox"
              checked={gdprChecked}
              onChange={(e) => {
                setGdprChecked(e.target.checked);
                if (e.target.checked) setGdprError(false);
              }}
              className="mt-1 h-4 w-4 border-gray-300 accent-[#002343]"
            />
            <label htmlFor="modal-gdpr" className="cursor-pointer text-sm text-gray-700">
              {t('gdprConsent')}{' '}
              <Link href="/privacy" className="text-[#002343] underline" target="_blank">
                {t('gdprLink')}
              </Link>
            </label>
          </div>
          {gdprError && (
            <p className="ml-7 text-xs text-red-600">{t('gdprRequired')}</p>
          )}

          <div className="flex items-start gap-3">
            <input
              id="modal-terms"
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => {
                setTermsChecked(e.target.checked);
                if (e.target.checked) setTermsError(false);
              }}
              className="mt-1 h-4 w-4 border-gray-300 accent-[#002343]"
            />
            <label htmlFor="modal-terms" className="cursor-pointer text-sm text-gray-700">
              {t('termsConsent')}{' '}
              <Link href="/terms" className="text-[#002343] underline" target="_blank">
                {t('termsLink')}
              </Link>
            </label>
          </div>
          {termsError && (
            <p className="ml-7 text-xs text-red-600">{t('termsRequired')}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-8 w-full bg-[#002343] px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#172C33] disabled:opacity-50"
        >
          {isSubmitting ? '...' : t('acceptAndContinue')}
        </button>
      </div>
    </div>
  );
}
