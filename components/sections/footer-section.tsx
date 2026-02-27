'use client';

import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';
import { useAuth } from '@/components/providers/auth-provider';

export default function FooterSection() {
  const t = useTranslations('footer');
  const { user } = useAuth();

  return (
    <footer className="bg-[#f5f5f0]">
      <div className="mx-auto max-w-7xl px-6 lg:px-0">
        {/* Main Footer Content - Full width flex container */}
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Logo, TransitionLinks and Bottom Bar */}
          <div className="flex-1 pb-8 pt-24 lg:pr-12 lg:pl-12">
            {/* Logo */}
            <div className="mb-16">
              <TransitionLink href="/" className="text-xl tracking-[0.2em] text-gray-900">
                VRΛJΛ MΛRII by the Sea
              </TransitionLink>
            </div>

            {/* TransitionLinks Grid */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16">
              {/* Company */}
              <div>
                <h3 className="mb-5 text-sm font-medium text-gray-900">
                  {t('company')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <TransitionLink
                      href="/about"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('about')}
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/careers"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('careers')}
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/press"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('pressRoom')}
                    </TransitionLink>
                  </li>
                </ul>
              </div>

              {/* Members */}
              <div>
                <h3 className="mb-5 text-sm font-medium text-gray-900">
                  {t('members')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <TransitionLink
                      href={user ? '/profile' : '/login'}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {user ? t('myAccount') : t('login')}
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/faq"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('faq')}
                    </TransitionLink>
                  </li>
                </ul>
              </div>

              {/* Follow */}
              <div>
                <h3 className="mb-5 text-sm font-medium text-gray-900">
                  {t('follow')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('instagram')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('facebook')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Health Centres */}
              <div>
                <h3 className="mb-5 text-sm font-medium text-gray-900">
                  {t('healthCentres')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <TransitionLink
                      href="/locations/constanta"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('locations.constanta')}
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/locations/eforie"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('locations.eforie')}
                    </TransitionLink>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-gray-300/50 pt-8 sm:flex-row sm:items-center">
              {/* Copyright and Legal TransitionLinks */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                <span>{t('copyright')}</span>
                <TransitionLink
                  href="/cookies"
                  className="transition-colors hover:text-gray-900"
                >
                  {t('cookieNotice')}
                </TransitionLink>
                <TransitionLink
                  href="/privacy"
                  className="transition-colors hover:text-gray-900"
                >
                  {t('privacyPolicy')}
                </TransitionLink>
                <TransitionLink
                  href="/terms"
                  className="transition-colors hover:text-gray-900"
                >
                  {t('termsOfService')}
                </TransitionLink>
              </div>

              {/* Country Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span>{t('country')}</span>
              </div>
            </div>
          </div>

          {/* Right side - Support Card (extends full height) */}
          <div className="lg:w-[340px] xl:w-[380px]">
            <div className="flex h-full min-h-[400px] flex-col bg-[#a8c5c8] p-8 lg:p-10">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900">
                {t('getSupport')}
              </h3>
              <div className="mt-8 space-y-2">
                <a
                  href={`mailto:${t('email')}`}
                  className="block text-sm font-medium text-gray-900 underline decoration-gray-900/30 underline-offset-4 transition-colors hover:decoration-gray-900"
                >
                  {t('email')}
                </a>
                <a
                  href={`tel:${t('phone').replace(/\s/g, '')}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('phone')}
                </a>
              </div>
              <p className="mt-auto text-sm text-gray-700">
                {t('hours')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
