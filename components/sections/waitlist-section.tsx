'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { submitWaitlist } from '@/app/[locale]/waitlist/actions';
import {
  ExpandableScreen,
  ExpandableScreenTrigger,
  ExpandableScreenContent,
} from '@/components/ui/expandable-screen';
import { ArrowRight, CheckCircle } from 'lucide-react';

const offerKeys = ['offer1', 'offer2', 'offer3', 'offer4'] as const;

const waitlistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  selectedOffers: z.array(z.string()),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export default function WaitlistSection() {
  const t = useTranslations('waitlist');
  const tOffers = useTranslations('offers');
  const { user } = useAuth();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'already_registered'>('idle');

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
      selectedOffers: [],
    },
  });

  const selectedOffers = watch('selectedOffers');

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    supabase
      .from('profiles')
      .select('first_name, last_name, email, phone')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.first_name) setValue('firstName', data.first_name);
          if (data.last_name) setValue('lastName', data.last_name);
          setValue('email', data.email || user.email || '');
          if (data.phone) setValue('phone', data.phone);
        } else {
          setValue('email', user.email || '');
        }
      });
  }, [user, setValue]);

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
    } else if (result.error) {
      setSubmitStatus('error');
    } else {
      setSubmitStatus('success');
    }
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center mb-12"
      >
        <p className="text-sm uppercase tracking-widest text-[#8B7D6E] mb-4">
          {t('heroSubtitle')}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl italic font-light text-gray-900 mb-6">
          {t('heroTitle')}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t('heroDescription')}
        </p>
      </motion.div>

      <ExpandableScreen
        triggerRadius="0px"
        contentRadius="0px"
        animationDuration={0.35}
      >
        <ExpandableScreenTrigger>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-[#6B5B4E] text-white px-8 py-4 text-lg font-medium transition-colors hover:bg-[#5A4A3E]"
          >
            {t('triggerButton')}
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </ExpandableScreenTrigger>

        <ExpandableScreenContent
          className="bg-[#A89279]"
          closeButtonClassName="text-white bg-transparent hover:bg-black/10"
        >
          <div className="flex flex-col lg:flex-row min-h-full w-full">
            {/* Left panel - Benefits */}
            <div className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:w-5/12">
              <h2 className="font-serif text-3xl sm:text-4xl italic font-light text-white mb-8">
                {t('formTitle')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-[#E8DDD0] mt-0.5 shrink-0" />
                  <p className="text-white/90 text-lg leading-relaxed">
                    {t('benefit1')}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-[#E8DDD0] mt-0.5 shrink-0" />
                  <p className="text-white/90 text-lg leading-relaxed">
                    {t('benefit2')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right panel - Form */}
            <div className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:w-7/12 bg-[#C4B5A5]">
              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 text-center py-12"
                >
                  <CheckCircle className="h-12 w-12 text-[#4A3F35]" />
                  <p className="text-lg font-medium text-[#3A2F25]">
                    {t('successTitle')}
                  </p>
                  <p className="text-sm text-[#6B5B4E]">
                    {t('successDescription')}
                  </p>
                </motion.div>
              ) : (
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
                      className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
                    />
                  </div>

                  <fieldset>
                    <legend className="block text-sm text-[#4A3F35] mb-3">
                      {t('offersInterest')}
                    </legend>
                    <div className="space-y-2.5">
                      {offerKeys.map((key) => (
                        <label
                          key={key}
                          htmlFor={`waitlist-offer-${key}`}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            id={`waitlist-offer-${key}`}
                            type="checkbox"
                            checked={selectedOffers.includes(key)}
                            onChange={(e) => handleOfferToggle(key, e.target.checked)}
                            className="sr-only peer"
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
                            {tOffers(`${key}.title`)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {submitStatus === 'already_registered' && (
                    <p className="text-sm text-amber-800">{t('alreadyRegistered')}</p>
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
              )}
            </div>
          </div>
        </ExpandableScreenContent>
      </ExpandableScreen>
    </section>
  );
}
