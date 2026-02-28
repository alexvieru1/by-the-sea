'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TransitionLink from '@/components/layout/transition-link';
import { counties, getCitiesByCounty } from '@/lib/data/romania-locations';

const signupSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    county: z.string().optional(),
    city: z.string().optional(),
    password: z.string().min(6),
    confirmPassword: z.string().min(1),
    isCommunityMember: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwordMismatch',
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const t = useTranslations('auth.signup');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get('email');
  const lockedEmail = rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: lockedEmail ?? '',
      phone: '',
      county: '',
      city: '',
      password: '',
      confirmPassword: '',
      isCommunityMember: false,
    },
  });

  const countyValue = watch('county');
  const cities = countyValue ? getCitiesByCounty(countyValue) : [];

  const handleCountyChange = (newCounty: string) => {
    setValue('county', newCounty);
    setValue('city', '');
  };

  const onSubmit = async (data: SignupFormData) => {
    setServerError('');

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setServerError(t('error.emailInUse'));
      } else {
        setServerError(t('error.generic'));
      }
      return;
    }

    // Update profile with additional fields
    if (authData.user) {
      await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || null,
          county: data.county || null,
          city: data.city || null,
          is_community_member: data.isCommunityMember,
        });
    }

    setSuccess(true);
  };

  const handleGoogleSignup = async () => {
    setServerError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(t('error.generic'));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40">
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('title')}
            </motion.h1>
          </div>
        </div>
        <div className="px-6 py-16 lg:px-12 lg:py-24">
          <motion.div
            className="mx-auto max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" strokeWidth={2} />
            </div>
            <p className="text-lg text-gray-700">{t('success')}</p>
            <TransitionLink
              href="/login"
              className="mt-8 inline-block bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {t('logIn')}
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#0097a7]/10 blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
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
        <motion.div
          className="mx-auto max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex w-full items-center justify-center gap-3 border border-gray-300 bg-white px-6 py-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t('google')}
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-500">{t('orContinueWith')}</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name fields */}
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
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{t('error.required')}</p>
                )}
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
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{t('error.required')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                {t('email')}
              </label>
              <input
                id="signup-email"
                type="email"
                {...register('email')}
                readOnly={!!lockedEmail}
                className={`w-full border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#0097a7] ${
                  lockedEmail ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'
                }`}
              />
              {lockedEmail && (
                <p className="mt-1 text-xs text-gray-500">{t('emailLocked')}</p>
              )}
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{t('error.invalidEmail')}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-phone" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                {t('phone')}
              </label>
              <input
                id="signup-phone"
                type="tel"
                {...register('phone')}
                placeholder={t('phonePlaceholder')}
                className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
              />
            </div>

            {/* County & City */}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                  {t('password')}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  {...register('password')}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{t('error.weakPassword')}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                  {t('confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{t('error.passwordMismatch')}</p>
                )}
              </div>
            </div>

            {/* Community member checkbox */}
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

            {serverError && (
              <motion.p
                className="text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {serverError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? '...' : t('submit')}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {t('hasAccount')}{' '}
            <TransitionLink
              href="/login"
              className="font-medium text-[#0097a7] underline-offset-4 hover:underline"
            >
              {t('logIn')}
            </TransitionLink>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
