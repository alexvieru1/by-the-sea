'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './language-switcher';
import AnimatedButton from '@/components/ui/animated-button';
import AnimatedLink from '@/components/ui/animated-link';

export default function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;

      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/body-scan', label: t('bodyScan') },
    { href: '/support', label: t('support') },
    { href: '/about', label: t('about') },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="flex items-start justify-between lg:items-center">
          {/* Logo - always visible */}
          <Link href="/" className="shrink-0 px-6 py-5 lg:px-10">
            <motion.span
              className="text-sm font-medium tracking-[0.3em] text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              VRAJA MARII
            </motion.span>
          </Link>

          {/* Right side: Nav links + CTA Button grouped together */}
          <div className="flex items-center">
            {/* Desktop Navigation - hides/shows based on scroll */}
            <motion.div
              className="hidden items-center gap-8 pr-6 lg:flex"
              initial={{ opacity: 1, y: 0 }}
              animate={{
                opacity: isNavVisible ? 1 : 0,
                y: isNavVisible ? 0 : -10,
                pointerEvents: isNavVisible ? 'auto' : 'none',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {navLinks.map((link) => (
                <AnimatedLink key={link.href} href={link.href}>
                  {link.label}
                </AnimatedLink>
              ))}
            </motion.div>

            {/* Language Switcher - always visible on desktop */}
            <div className="hidden pr-6 lg:block">
              <LanguageSwitcher />
            </div>

            {/* CTA Button - always visible on desktop */}
            <div className="hidden lg:block">
              <AnimatedButton
                href="/book"
                bgColor="#00a5c9"
                textColor="#ffffff"
                hoverTextColor="#ffffff"
                borderColor="#007A9F"
                initialText={tCommon('bookScan')}
                hoverText={tCommon('bookScanHover')}
                className="py-6"
              />
            </div>

            {/* Mobile: CTA + Menu Button */}
            <Link
              href="/book"
              className="flex h-14 items-center bg-[#00a5c9] px-5 text-sm font-medium text-white lg:hidden"
            >
              {tCommon('bookScan')}
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-14 w-14 items-center justify-center bg-gray-800/90 lg:hidden"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5">
                <motion.span
                  className="block h-0.5 w-5 bg-white"
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-5 bg-white"
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-5 bg-white"
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center"
                    aria-label="Close menu"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="mt-8 flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="text-lg text-gray-900"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-8">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
