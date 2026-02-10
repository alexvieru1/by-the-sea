'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useAuth } from '@/components/providers/auth-provider';
import { counties, getCitiesByCounty } from '@/lib/data/romania-locations';
import { updateProfile } from './actions';

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
}

export default function ProfileForm({ profile, email }: ProfileFormProps) {
  const t = useTranslations('auth.profile');
  const { signOut } = useAuth();

  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [lastName, setLastName] = useState(profile?.last_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [county, setCounty] = useState(profile?.county ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [isCommunityMember, setIsCommunityMember] = useState(profile?.is_community_member ?? false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cities = county ? getCitiesByCounty(county) : [];

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty);
    setCity('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.set('first_name', firstName);
    formData.set('last_name', lastName);
    formData.set('phone', phone);
    formData.set('county', county);
    formData.set('city', city);
    formData.set('is_community_member', isCommunityMember.toString());

    const result = await updateProfile(formData);

    if (result.error) {
      setError(t('error'));
    } else {
      setMessage(t('saved'));
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
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
        <motion.div
          className="mx-auto max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-700">
            {t('personalInfo')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium uppercase tracking-wider text-gray-700">
                  {t('firstName')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                  value={county}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!county}
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
                checked={isCommunityMember}
                onChange={(e) => setIsCommunityMember(e.target.checked)}
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

            {error && (
              <motion.p className="text-sm text-red-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? '...' : t('save')}
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
      </div>
    </main>
  );
}
