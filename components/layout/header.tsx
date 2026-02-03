'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './language-switcher';
import AnimatedButton from '@/components/ui/animated-button';
import AnimatedLink from '@/components/ui/animated-link';
import SlicedText from '../ui/sliced-text';

// Sliding stairs animation variants
const stairAnimation = {
  initial: { height: 0 },
  enter: (i: number) => ({
    height: '100%',
    transition: { duration: 0.5, delay: 0.05 * i, ease: [0.33, 1, 0.68, 1] },
  }),
  exit: (i: number) => ({
    height: 0,
    transition: { duration: 0.3, delay: 0.05 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

const menuContentAnimation = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
  },
};

const linkAnimation = {
  initial: { opacity: 0, y: 20 },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.33, 1, 0.68, 1] },
  }),
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
  },
};

export default function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;
      const viewportHeight = window.innerHeight;

      // Detect if we're in the hero section (first viewport)
      setIsInHero(currentScrollY < viewportHeight * 0.8);

      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    // Initial check
    handleScroll();

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

  const colorVariant = isInHero ? 'light' : 'dark';
  const textColor = isInHero ? 'text-white' : 'text-gray-900';
  const hamburgerBg = isInHero ? 'bg-white' : 'bg-gray-900';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="flex items-start justify-between lg:items-center">
          {/* Logo - always visible */}
          <Link href="/" className="shrink-0 px-6 py-5 lg:px-10">
            <SlicedText
              text="VM by the Sea"
              className={`text-2xl transition-colors duration-300 ${textColor}`}
              splitSpacing={3}
            />
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
                <AnimatedLink key={link.href} href={link.href} variant={colorVariant}>
                  {link.label}
                </AnimatedLink>
              ))}
            </motion.div>

            {/* Language Switcher - always visible on desktop */}
            <div className="hidden pr-6 lg:block">
              <LanguageSwitcher variant={colorVariant} />
            </div>

            {/* CTA Button - always visible on desktop */}
            <div className="hidden lg:block">
              <AnimatedButton
                href="/book"
                bgColor="#C6A979"
                textColor="#ffffff"
                hoverTextColor="#ffffff"
                borderColor="#7B5F42"
                initialText={tCommon('bookScan')}
                hoverText={tCommon('bookScanHover')}
                className="py-6"
              />
            </div>

            {/* Mobile: CTA + Menu Button */}
            <Link
              href="/book"
              className="flex h-14 items-center bg-[#C2A87A] px-5 text-sm font-medium text-white lg:hidden"
            >
              {tCommon('bookScan')}
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex h-14 w-14 items-center justify-center transition-colors duration-300 lg:hidden ${
                isInHero ? 'bg-gray-800/90' : 'bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5">
                <motion.span
                  className={`block h-0.5 w-5 transition-colors duration-300 ${hamburgerBg}`}
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={`block h-0.5 w-5 transition-colors duration-300 ${hamburgerBg}`}
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={`block h-0.5 w-5 transition-colors duration-300 ${hamburgerBg}`}
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu with Sliding Stairs Effect */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            {/* Sliding Stairs Background */}
            <div className="pointer-events-none fixed inset-0 z-40 flex lg:hidden">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  className="h-full w-[20vw] origin-top bg-[#4a9ead]"
                  variants={stairAnimation}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  custom={4 - index}
                />
              ))}
            </div>

            {/* Menu Content */}
            <motion.div
              className="fixed inset-0 z-40 flex flex-col pt-20 lg:hidden"
              variants={menuContentAnimation}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {/* Navigation Links */}
              <nav className="flex flex-1 flex-col justify-center px-10">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={linkAnimation}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    custom={index}
                    className="border-b border-white/20 py-4"
                  >
                    <Link
                      href={link.href}
                      className="font-(family-name:--font-playfair) text-3xl font-light italic text-white transition-opacity hover:opacity-70"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <motion.div
                className="px-10 pb-10"
                variants={linkAnimation}
                initial="initial"
                animate="enter"
                exit="exit"
                custom={navLinks.length}
              >
                <LanguageSwitcher variant="light" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
