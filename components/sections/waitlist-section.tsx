'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone } from 'lucide-react';
import { romanianPhoneSchema } from '@/lib/validation/phone';
import { submitWaitlist } from '@/app/[locale]/waitlist/actions';
import { Link, useRouter } from '@/i18n/routing';
import Image from 'next/image';

const programKeys = [
  'medicalRehabilitation',
  'endometriosisInfertility',
  'longevity',
  'rheumatology',
  'postChemotherapy',
] as const;

function getAvailableMonths(t: (key: string) => string) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const months: { value: string; label: string }[] = [
    { value: 'asap', label: t('asap') },
  ];

  const monthKeys = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];

  for (let i = 1; i <= 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + (currentMonth + i >= 12 ? 1 : 0);
    months.push({
      value: `${monthKeys[monthIndex]}-${year}`,
      label: `${t(`months.${monthKeys[monthIndex]}`)} ${year}`,
    });
  }

  return months;
}

const waitlistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: romanianPhoneSchema,
  preferredMonth: z.string().min(1),
  selectedOffers: z.array(z.string()),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'required' }),
  }),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export default function WaitlistSection() {
  const t = useTranslations('waitlist');
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error' | 'already_registered' | 'phone_already_registered'>('idle');

  const availableMonths = useMemo(() => getAvailableMonths(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredMonth: '',
      selectedOffers: [],
      gdprConsent: false as unknown as true,
    },
  });

  const selectedOffers = watch('selectedOffers');
  const gdprConsent = watch('gdprConsent');

  const handleOfferToggle = (key: string, checked: boolean) => {
    const current = selectedOffers;
    setValue(
      'selectedOffers',
      checked ? [...current, key] : current.filter((k) => k !== key)
    );
  };

  const onSubmit = async (data: WaitlistFormData) => {
    setSubmitStatus('idle');
    const result = await submitWaitlist(data);

    if (result.error === 'already_registered') {
      setSubmitStatus('already_registered');
    } else if (result.error === 'phone_already_registered') {
      setSubmitStatus('phone_already_registered');
    } else if (result.error) {
      setSubmitStatus('error');
    } else {
      const params = new URLSearchParams({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      router.push(`/waitlist/success?${params.toString()}`);
    }
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center mx-auto px-4 py-24 sm:py-32"
      >
        <p className="text-sm uppercase tracking-widest text-[#8B7D6E] mb-4">
          {t('heroSubtitle')}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl  font-light text-gray-900 mb-6">
          {t('heroTitle')}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t('heroDescription')}
        </p>
      </motion.div>

      {/* Full-width split layout: image left + form right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full flex flex-col lg:flex-row flex-1"
      >
        {/* Left side - Image (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 relative min-h-[600px]">
          <Image
            src="/images/your_future.webp"
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
        </div>

        {/* Right side - Form */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-20 lg:w-1/2 bg-[#C4B5A5]">
          {/* Call to book */}
          <div className="mb-8 max-w-lg">
            <h2 className="font-serif text-3xl sm:text-4xl  font-light text-[#3A2F25] mb-2">
              {t('callTitle')}
            </h2>
            <p className="text-[#4A3F35]/80 text-sm leading-relaxed mb-4">
              {t('callDescription')}
            </p>
            <a
              href={`tel:${t('callPhone').replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 bg-[#3A2F25] text-white px-6 py-3 text-sm font-semibold hover:bg-[#2A1F15] transition-colors"
            >
              <Phone className="h-4 w-4" />
              {t('callButton')} — {t('callPhone')}
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8 max-w-lg">
            <div className="flex-1 h-px bg-[#8B7D6E]/40" />
            <span className="text-xs uppercase tracking-widest text-[#6B5B4E]">
              {t('orDivider')}
            </span>
            <div className="flex-1 h-px bg-[#8B7D6E]/40" />
          </div>

          {/* Form */}
          <h2 className="font-serif text-3xl sm:text-4xl  font-light text-[#3A2F25] mb-3">
            {t('formTitle')}
          </h2>
          <p className="text-[#4A3F35]/80 text-sm leading-relaxed mb-8">
            {t('formSubtitle')}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 max-w-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="waitlist-firstName" className="block text-sm text-[#4A3F35] mb-1.5">
                  {t('firstName')}
                </label>
                <input
                  id="waitlist-firstName"
                  type="text"
                  {...register('firstName')}
                  className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-700">{t('required')}</p>
                )}
              </div>
              <div>
                <label htmlFor="waitlist-lastName" className="block text-sm text-[#4A3F35] mb-1.5">
                  {t('lastName')}
                </label>
                <input
                  id="waitlist-lastName"
                  type="text"
                  {...register('lastName')}
                  className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-700">{t('required')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="waitlist-email" className="block text-sm text-[#4A3F35] mb-1.5">
                {t('email')}
              </label>
              <input
                id="waitlist-email"
                type="email"
                {...register('email')}
                className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-700">{t('invalidEmail')}</p>
              )}
            </div>

            <div>
              <label htmlFor="waitlist-phone" className="block text-sm text-[#4A3F35] mb-1.5">
                {t('phone')}
              </label>
              <input
                id="waitlist-phone"
                type="tel"
                {...register('phone')}
                placeholder="07XXXXXXXX"
                className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-700">{t('invalidPhone')}</p>
              )}
            </div>

            <div>
              <label htmlFor="waitlist-preferredMonth" className="block text-sm text-[#4A3F35] mb-1.5">
                {t('preferredMonth')}
              </label>
              <select
                id="waitlist-preferredMonth"
                {...register('preferredMonth')}
                className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
              >
                <option value="">{t('selectMonth')}</option>
                {availableMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              {errors.preferredMonth && (
                <p className="mt-1 text-xs text-red-700">{t('required')}</p>
              )}
            </div>

            <fieldset>
              <legend className="block text-sm text-[#4A3F35] mb-3">
                {t('programsInterest')}
              </legend>
              <div className="space-y-2.5">
                {programKeys.map((key) => (
                  <label
                    key={key}
                    htmlFor={`waitlist-program-${key}`}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      id={`waitlist-program-${key}`}
                      type="checkbox"
                      checked={selectedOffers.includes(key)}
                      onChange={(e) => handleOfferToggle(key, e.target.checked)}
                      className="peer sr-only !fixed"
                    />
                    <div
                      className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                        selectedOffers.includes(key)
                          ? 'bg-[#6B5B4E] border-[#6B5B4E]'
                          : 'border-[#8B7D6E] group-hover:border-[#6B5B4E]'
                      }`}
                    >
                      {selectedOffers.includes(key) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-[#3A2F25]">
                      {t(`programs.${key}`)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label
              htmlFor="waitlist-gdpr"
              className="flex items-start gap-3 cursor-pointer group"
            >
              <input
                id="waitlist-gdpr"
                type="checkbox"
                checked={gdprConsent === true}
                onChange={(e) => setValue('gdprConsent', e.target.checked as unknown as true)}
                className="sr-only !fixed"
              />
              <div
                className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  gdprConsent
                    ? 'bg-[#6B5B4E] border-[#6B5B4E]'
                    : errors.gdprConsent
                      ? 'border-red-600'
                      : 'border-[#8B7D6E] group-hover:border-[#6B5B4E]'
                }`}
              >
                {gdprConsent && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#3A2F25] leading-relaxed">
                {t('gdprLabel')}{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline hover:text-[#6B5B4E]"
                >
                  {t('gdprLink')}
                </Link>
              </span>
            </label>
            {errors.gdprConsent && (
              <p className="text-xs text-red-700">{t('gdprRequired')}</p>
            )}

            {submitStatus === 'already_registered' && (
              <p className="text-sm text-amber-800">{t('alreadyRegistered')}</p>
            )}
            {submitStatus === 'phone_already_registered' && (
              <p className="text-sm text-amber-800">{t('phoneAlreadyRegistered')}</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-sm text-red-700">{t('errorGeneric')}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6B5B4E] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#5A4A3E] transition-colors mt-2 disabled:opacity-50"
            >
              {isSubmitting ? '...' : t('submit')}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
