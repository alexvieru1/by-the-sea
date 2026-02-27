'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/auth-provider';
import { counties, getCitiesByCounty } from '@/lib/data/romania-locations';
import { updateProfile } from './actions';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
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
}

interface ProfileFormProps {
  profile: Profile | null;
  email: string;
  children?: React.ReactNode;
}

export default function ProfileForm({ profile, email, children }: ProfileFormProps) {
  const t = useTranslations('auth.profile');
  const { signOut } = useAuth();
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
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

    const result = await updateProfile(formData);

    if (result.error) {
      setServerError(t('error'));
    } else {
      setMessage(t('saved'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-700">
              {t('personalInfo')}
            </h2>

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
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0097a7]"
                />
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
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
