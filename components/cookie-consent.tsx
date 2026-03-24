'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import TransitionLink from '@/components/layout/transition-link';

const CONSENT_KEY = 'cookie-consent';

export type ConsentValue = 'all' | 'essential' | null;

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'all' || value === 'essential') return value;
  return null;
}

export function setConsent(value: 'all' | 'essential') {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: value }));
}

export function resetConsent() {
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: null }));
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner if no consent stored
    const consent = getConsent();
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for reset events (from footer "Manage cookies" link)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === null) setVisible(true);
    };
    window.addEventListener('cookie-consent-change', handler);
    return () => window.removeEventListener('cookie-consent-change', handler);
  }, []);

  const handleAcceptAll = () => {
    setConsent('all');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    setConsent('essential');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[90] border-t border-gray-200 bg-white px-6 py-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:px-8"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-gray-600">
                {t('message')}{' '}
                <TransitionLink
                  href="/cookies"
                  className="underline decoration-gray-400 underline-offset-2 transition-colors hover:text-gray-900 hover:decoration-gray-900"
                >
                  {t('learnMore')}
                </TransitionLink>
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t('essentialOnly')}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="bg-[#002343] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003460]"
              >
                {t('acceptAll')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
