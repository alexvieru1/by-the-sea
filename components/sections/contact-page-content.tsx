'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Car,
  TrainFront,
  CircleParking,
  Plus,
} from 'lucide-react';
import ParallaxImage from '../ui/parallax-image';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

const inputClasses =
  'w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#002343] focus:outline-none focus:ring-1 focus:ring-[#002343] transition-colors';

export default function ContactPageContent() {
  const t = useTranslations('contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Section A: Contact Info + Map */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Info */}
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#002343]">
                {t('info.label')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('info.title')}
              </h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Phone size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('info.phone')}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Mail size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('info.email')}</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('info.address')}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="shrink-0 text-[#002343]" />
                  <div className="text-gray-700">
                    <p>{t('info.hours')}</p>
                    <p>{t('info.hoursSaturday')}</p>
                    <p>{t('info.hoursSunday')}</p>
                  </div>
                </div>
              </div>
              {/* Social links */}
              <div className="mt-8 flex gap-6">
                <a
                  href="https://instagram.com/vrajamariibythesea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#002343] transition-colors hover:text-[#172C33]"
                >
                  {t('social.instagram')}
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61574970605951"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#002343] transition-colors hover:text-[#172C33]"
                >
                  {t('social.facebook')}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            {/* Right: Map */}
            <div className="relative min-h-[400px] overflow-hidden bg-gray-200">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=Vraja+Mării+by+the+Sea,Eforie+Sud,Romania&zoom=16`}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vraja Marii location"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section B: Getting There */}
      <motion.section {...fadeInUp} className="bg-[#F2E4D1]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#002343]">
                {t('directions.label')}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('directions.title')}
              </h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Car size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('directions.fromConstanta')}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Car size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('directions.fromBucharest')}</span>
                </div>
                <div className="flex items-start gap-4">
                  <TrainFront size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('directions.train')}</span>
                </div>
                <div className="flex items-start gap-4">
                  <CircleParking size={20} className="shrink-0 text-[#002343]" />
                  <span className="text-gray-700">{t('directions.parking')}</span>
                </div>
              </div>
            </div>
            {/* Placeholder image */}
            <ParallaxImage label="Building Entrance" src="/images/contact/building-entrance-2.webp" />
          </div>
        </div>
      </motion.section>

      {/* Section C: Contact Form */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-2xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
              {t('form.title')}
            </h2>
            <p className="mt-4 text-gray-700">{t('form.description')}</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder={t('form.name')}
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={inputClasses}
                required
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <input
                type="email"
                name="email"
                placeholder={t('form.email')}
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={inputClasses}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder={t('form.phone')}
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="subject" className="sr-only">
                {t('form.subject')}
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                className={inputClasses}
              >
                <option value="general">{t('form.subjects.general')}</option>
                <option value="booking">{t('form.subjects.booking')}</option>
                <option value="medical">{t('form.subjects.medical')}</option>
                <option value="other">{t('form.subjects.other')}</option>
              </select>
            </div>
            <div>
              <textarea
                name="message"
                rows={5}
                placeholder={t('form.messagePlaceholder')}
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                className={inputClasses}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {t('form.submit')}
            </button>
            {submitted && (
              <div className="mt-6 bg-[#002343]/10 p-4 text-center text-[#002343]">
                {t('form.success')}
              </div>
            )}
          </form>
        </div>
      </motion.section>

      {/* Section D: FAQ */}
      <section id="faq" className="bg-gray-100 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <motion.h2
            {...fadeInUp}
            className="text-center font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl"
          >
            {t('faq.title')}
          </motion.h2>
          <div className="mt-12 divide-y divide-gray-200">
            {faqKeys.map((key) => (
              <details key={key} className="group">
                <summary className="flex cursor-pointer items-center justify-between py-6 text-left font-medium text-gray-900">
                  {t(`faq.items.${key}.question`)}
                  <Plus size={18} className="shrink-0 text-gray-500 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="pb-6 leading-relaxed text-gray-700">
                  {t(`faq.items.${key}.answer`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
