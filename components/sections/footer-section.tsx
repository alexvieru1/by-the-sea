'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import TransitionLink from '@/components/layout/transition-link';
import { useAuth } from '@/components/providers/auth-provider';
import { resetConsent } from '@/components/cookie-consent';

export default function FooterSection() {
  const t = useTranslations('footer');
  const tCookie = useTranslations('cookieConsent');
  const { user } = useAuth();

  return (
    <footer className="bg-[#F2E4D1]">
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
                      href="/stays"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('stays')}
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
                      href="/contact#faq"
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
                      href="https://instagram.com/vrajamariibythesea"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('instagram')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/profile.php?id=61574970605951"
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
                    <a
                      href="https://complexvrajamarii.ro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('locations.park')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://constanta.complexvrajamarii.ro/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('locations.city')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://complexvrajamarii.ro/vraja-marii-by-the-lake/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {t('locations.lake')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-gray-300/50 pt-8 sm:flex-row sm:items-center">
              {/* Copyright and Legal TransitionLinks */}
              <div className="text-sm text-gray-500">
                <span>{t('copyright')}</span>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <TransitionLink
                    href="/cookies"
                    className="transition-colors hover:text-gray-900"
                  >
                    {t('cookieNotice')}
                  </TransitionLink>
                  <span aria-hidden="true" className="text-[6px]">●</span>
                  <TransitionLink
                    href="/privacy"
                    className="transition-colors hover:text-gray-900"
                  >
                    {t('privacyPolicy')}
                  </TransitionLink>
                  <span aria-hidden="true" className="text-[6px]">●</span>
                  <TransitionLink
                    href="/terms"
                    className="transition-colors hover:text-gray-900"
                  >
                    {t('termsOfService')}
                  </TransitionLink>
                  <span aria-hidden="true" className="text-[6px]">●</span>
                  <button
                    type="button"
                    onClick={resetConsent}
                    className="transition-colors hover:text-gray-900"
                  >
                    {tCookie('manageCookies')}
                  </button>
                </div>
              </div>

              {/* Country Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span>{t('country')}</span>
              </div>
            </div>

            {/* Legal Compliance Bar */}
            <div className="flex flex-col items-start justify-between gap-4 border-t border-gray-300/50 pt-6 pb-2 sm:flex-row sm:items-center">
              <p className="text-xs text-gray-400">
                ASCLEPIOS S.R.L. — CUI: 1864633 — Reg. Com.: J1992000693137
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://anpc.ro/ce-este-sal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 transition-opacity hover:opacity-100"
                >
                  <Image
                    src="/images/anpc-sal.webp"
                    alt="ANPC — SAL"
                    width={150}
                    height={50}
                    className="h-8 w-auto"
                  />
                </a>
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 transition-opacity hover:opacity-100"
                >
                  <Image
                    src="/images/anpc-sol.webp"
                    alt="ANPC — SOL"
                    width={150}
                    height={50}
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right side - Support Card (extends full height) */}
          <div className="lg:w-[340px] xl:w-[380px]">
            <div className="flex h-full min-h-[400px] flex-col bg-[#D1CCC7] p-8 lg:p-10">
              <h3 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900">
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
              <p className="mt-4 text-sm text-gray-700 lg:mt-2">
                {t('hours')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
