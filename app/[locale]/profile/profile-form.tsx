'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { romanianPhoneSchema } from '@/lib/validation/phone';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from '@/i18n/routing';
import { counties, getCitiesByCounty } from '@/lib/data/romania-locations';
import { Check, X } from 'lucide-react';
import { POLICY_VERSIONS } from '@/lib/constants/policy-versions';
import { updateProfile, revokeGdprConsent, acceptConsents } from './actions';
import ConsentModal from './consent-modal';
import WaitlistStatusBanner from './waitlist-status-banner';
import type { WaitlistStatus } from './page';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: romanianPhoneSchema,
  county: z.string().optional(),
  city: z.string().optional(),
  isCommunityMember: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  county: string | null;
  city: string | null;
  is_community_member: boolean;
  gdpr_consent: boolean;
  gdpr_consent_at: string | null;
  gdpr_policy_version: string | null;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  terms_version: string | null;
  medical_data_consent: boolean;
  medical_data_consent_at: string | null;
  marketing_consent_at: string | null;
}

interface ProfileFormProps {
  profile: Profile | null;
  email: string;
  waitlistStatus: WaitlistStatus;
  phoneRequired: boolean;
  children?: React.ReactNode;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}

export default function ProfileForm({ profile, email, waitlistStatus, phoneRequired, children }: ProfileFormProps) {
  const t = useTranslations('auth.profile');
  const { signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const completePhone = searchParams.get('completePhone') === '1';
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isReaccepting, setIsReaccepting] = useState(false);
  const gdprRevoked = profile?.gdpr_consent === false;
  const needsConsent = !profile?.gdpr_consent || !profile?.terms_accepted;
  const hasOutdatedConsent = profile?.gdpr_consent && profile?.terms_accepted && (
    profile.gdpr_policy_version !== POLICY_VERSIONS.gdpr ||
    profile.terms_version !== POLICY_VERSIONS.terms
  );
  const showConsentModal = needsConsent || hasOutdatedConsent;
  const showEvaluationSection = (waitlistStatus === 'confirmed' || waitlistStatus === 'evaluated') && !gdprRevoked;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.first_name ?? '',
      lastName: profile?.last_name ?? '',
      phone: profile?.phone ?? '',
      county: profile?.county ?? '',
      city: profile?.city ?? '',
      isCommunityMember: profile?.is_community_member ?? false,
    },
  });

  const countyValue = watch('county');
  const cities = countyValue ? getCitiesByCounty(countyValue) : [];

  const handleCountyChange = (newCounty: string) => {
    setValue('county', newCounty);
    setValue('city', '');
  };

  const onSubmit = async (data: ProfileFormData) => {
    setMessage('');
    setServerError('');

    const formData = new FormData();
    formData.set('first_name', data.firstName ?? '');
    formData.set('last_name', data.lastName ?? '');
    formData.set('phone', data.phone ?? '');
    formData.set('county', data.county ?? '');
    formData.set('city', data.city ?? '');
    formData.set('is_community_member', data.isCommunityMember.toString());
    formData.set('was_community_member', (profile?.is_community_member ?? false).toString());

    const result = await updateProfile(formData);

    if (result.error) {
      setServerError(t('error'));
    } else {
      setMessage(t('saved'));
      router.refresh();
    }
  };

  const handleRevokeGdpr = async () => {
    setIsRevoking(true);
    const result = await revokeGdprConsent();
    if (result.success) {
      router.refresh();
    }
    setIsRevoking(false);
    setShowRevokeConfirm(false);
  };

  const handleReaccept = async () => {
    setIsReaccepting(true);
    const result = await acceptConsents();
    if (result.success) {
      router.refresh();
    }
    setIsReaccepting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showConsentModal && <ConsentModal isUpdate={!!hasOutdatedConsent} />}
      <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('subtitle')}
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>
        </div>
      </div>

      <div className="px-6 py-16 lg:px-12 lg:py-24">
        <div className={`mx-auto ${showEvaluationSection ? 'grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16' : 'max-w-2xl'}`}>
          {/* Left column — Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-700">
              {t('personalInfo')}
            </h2>

            <WaitlistStatusBanner status={waitlistStatus} />

            {phoneRequired && (
              <div className="mb-6 border border-amber-300 bg-amber-50 px-4 py-3">
                <p className="text-sm font-medium text-amber-800">{t('phoneRequiredTitle')}</p>
                <p className="mt-1 text-xs text-amber-700">{t('phoneRequiredDescription')}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                    {t('firstName')}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                    {t('lastName')}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                  {t('email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                  {t('phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="07XXXXXXXX"
                  className={`w-full border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7] ${
                    completePhone && !profile?.phone ? 'border-amber-400' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{t('invalidPhone')}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="county" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                    {t('county')}
                  </label>
                  <select
                    id="county"
                    value={countyValue}
                    onChange={(e) => handleCountyChange(e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
                  >
                    <option value="">{t('selectCounty')}</option>
                    {counties.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                    {t('city')}
                  </label>
                  <select
                    id="city"
                    {...register('city')}
                    disabled={!countyValue}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7] disabled:opacity-50"
                  >
                    <option value="">{t('selectCity')}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Community member toggle */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="community"
                  type="checkbox"
                  {...register('isCommunityMember')}
                  className="mt-1 h-4 w-4 border-gray-300 accent-[#0097a7]"
                />
                <div>
                  <label htmlFor="community" className="text-sm font-medium text-gray-900 cursor-pointer">
                    {t('communityMember')}
                  </label>
                  <p className="text-xs text-gray-500">{t('communityDescription')}</p>
                </div>
              </div>

              {/* Consent status display */}
              {profile && (
                <div className="border-t border-gray-200 pt-4 mt-2 space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('consentsTitle')}
                  </h3>

                  {/* GDPR revoked banner */}
                  {gdprRevoked && (
                    <div className="border border-amber-300 bg-amber-50 px-4 py-3">
                      <p className="text-sm text-amber-800">{t('gdprRevoked')}</p>
                      <button
                        type="button"
                        onClick={handleReaccept}
                        disabled={isReaccepting}
                        className="mt-2 bg-[#0097a7] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#00838f] disabled:opacity-50"
                      >
                        {isReaccepting ? '...' : t('reaccept')}
                      </button>
                    </div>
                  )}

                  {/* GDPR row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {profile.gdpr_consent ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-700">{t('gdprStatus')}</p>
                        {profile.gdpr_consent && profile.gdpr_consent_at && (
                          <p className="text-xs text-gray-500">
                            {t('acceptedOn', { date: formatDate(profile.gdpr_consent_at) })}
                            {profile.gdpr_policy_version && (
                              <span className="ml-1 text-gray-400">
                                ({t('consentVersion', { version: profile.gdpr_policy_version })})
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    {profile.gdpr_consent && !showRevokeConfirm && (
                      <button
                        type="button"
                        onClick={() => setShowRevokeConfirm(true)}
                        className="text-xs text-red-600 underline"
                      >
                        {t('revokeGdpr')}
                      </button>
                    )}
                  </div>

                  {/* Revoke confirmation */}
                  {showRevokeConfirm && (
                    <div className="border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-xs text-red-700">{t('revokeGdprWarning')}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleRevokeGdpr}
                          disabled={isRevoking}
                          className="bg-red-600 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {isRevoking ? '...' : t('revokeGdprConfirm')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRevokeConfirm(false)}
                          className="border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          {t('revokeGdprCancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Terms row */}
                  <div className="flex items-center gap-2">
                    {profile.terms_accepted ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm text-gray-700">{t('termsStatus')}</p>
                      {profile.terms_accepted && profile.terms_accepted_at && (
                        <p className="text-xs text-gray-500">
                          {t('acceptedOn', { date: formatDate(profile.terms_accepted_at) })}
                          {profile.terms_version && (
                            <span className="ml-1 text-gray-400">
                              ({t('consentVersion', { version: profile.terms_version })})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medical consent row */}
                  {profile.medical_data_consent && profile.medical_data_consent_at && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-700">{t('medicalConsentStatus')}</p>
                        <p className="text-xs text-gray-500">
                          {t('acceptedOn', { date: formatDate(profile.medical_data_consent_at) })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Marketing consent row */}
                  {profile.is_community_member && profile.marketing_consent_at && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-700">{t('marketingConsentDate')}</p>
                        <p className="text-xs text-gray-500">
                          {t('acceptedOn', { date: formatDate(profile.marketing_consent_at) })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {message && (
                <motion.p className="text-sm text-green-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {message}
                </motion.p>
              )}

              {serverError && (
                <motion.p className="text-sm text-red-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {serverError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? '...' : t('save')}
              </button>
            </form>

            {/* Sign out */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <button
                type="button"
                onClick={signOut}
                className="w-full border border-gray-300 bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t('signOut')}
              </button>
            </div>
          </motion.div>

          {/* Right column — Evaluation Summary */}
          {showEvaluationSection && (
            <div>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
