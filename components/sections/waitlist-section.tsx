'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useAuth } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';
import {
  ExpandableScreen,
  ExpandableScreenTrigger,
  ExpandableScreenContent,
} from '@/components/ui/expandable-screen';
import { ArrowRight, CheckCircle } from 'lucide-react';

const offerKeys = ['offer1', 'offer2', 'offer3', 'offer4'] as const;

export default function WaitlistSection() {
  const t = useTranslations('waitlist');
  const tOffers = useTranslations('offers');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedOffers: [] as string[],
  });

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
          setFormData((prev) => ({
            ...prev,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            email: user.email || '',
          }));
        }
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOfferToggle = (key: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedOffers: checked
        ? [...prev.selectedOffers, key]
        : prev.selectedOffers.filter((k) => k !== key),
    }));
  };

  return (
    <section className="min-h-screen bg-[#A8C5C7] flex flex-col items-center justify-center px-4 py-24 sm:py-32">
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
              <form
                onSubmit={(e) => e.preventDefault()}
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
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="waitlist-lastName" className="block text-sm text-[#4A3F35] mb-1.5">
                      {t('lastName')}
                    </label>
                    <input
                      id="waitlist-lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="waitlist-email" className="block text-sm text-[#4A3F35] mb-1.5">
                    {t('email')}
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#E8DDD0] border border-[#B8A898] text-[#3A2F25] placeholder-[#8B7D6E] px-4 py-3 text-sm focus:outline-none focus:border-[#6B5B4E] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="waitlist-phone" className="block text-sm text-[#4A3F35] mb-1.5">
                    {t('phone')}
                  </label>
                  <input
                    id="waitlist-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                          checked={formData.selectedOffers.includes(key)}
                          onChange={(e) => handleOfferToggle(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                            formData.selectedOffers.includes(key)
                              ? 'bg-[#6B5B4E] border-[#6B5B4E]'
                              : 'border-[#8B7D6E] group-hover:border-[#6B5B4E]'
                          }`}
                        >
                          {formData.selectedOffers.includes(key) && (
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

                <button
                  type="submit"
                  className="w-full bg-[#6B5B4E] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#5A4A3E] transition-colors mt-2"
                >
                  {t('submit')}
                </button>
              </form>
            </div>
          </div>
        </ExpandableScreenContent>
      </ExpandableScreen>
    </section>
  );
}
