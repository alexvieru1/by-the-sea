"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import TransitionLink from "./transition-link";
import LanguageSwitcher from "./language-switcher";
import AnimatedButton from "@/components/ui/animated-button";
import AnimatedLink from "@/components/ui/animated-link";
import SlicedText from "../ui/sliced-text";
import UserMenu from "@/components/ui/user-menu";
import { useAuth } from "@/components/providers/auth-provider";

// Sliding stairs animation variants
const stairsEase = [0.33, 1, 0.68, 1] as const;

const stairAnimation = {
  initial: { height: 0 },
  enter: (i: number) => ({
    height: "100%",
    transition: { duration: 0.5, delay: 0.05 * i, ease: stairsEase },
  }),
  exit: (i: number) => ({
    height: 0,
    transition: { duration: 0.3, delay: 0.05 * i, ease: stairsEase },
  }),
};

const menuContentAnimation = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: stairsEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: stairsEase },
  },
};

const linkAnimation = {
  initial: { opacity: 0, y: 20 },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.4 + i * 0.1, ease: stairsEase },
  }),
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: stairsEase },
  },
};

export default function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInHero, setIsInHero] = useState(isHomepage);
  const lastScrollY = useRef(0);

  // Reset isInHero when navigating between pages
  useEffect(() => {
    setIsInHero(isHomepage);
  }, [isHomepage]);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;
      const viewportHeight = window.innerHeight;

      // Only use light (white) text when on the homepage and within the hero viewport
      setIsInHero(isHomepage && currentScrollY < viewportHeight * 0.8);

      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    // Initial check
    handleScroll();

    mainElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/about", label: t("about") },
    { href: "/offers", label: t("offers") },
    { href: "/contact", label: t("contact") },
  ];

  const mobileNavLinks = [
    ...navLinks,
    {
      href: user ? "/profile" : "/login",
      label: user ? t("profile") : t("login"),
    },
  ];

  const colorVariant = isInHero ? "light" : "dark";
  const textColor = isInHero ? "text-white" : "text-gray-900";
  const hamburgerBg = isInHero ? "bg-white" : "bg-gray-900";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="flex items-start justify-between lg:items-center">
          {/* Logo - Desktop */}
          <motion.div
            className="hidden items-center gap-8 pr-6 lg:flex"
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: isNavVisible ? 1 : 0,
              y: isNavVisible ? 0 : -10,
              pointerEvents: isNavVisible ? "auto" : "none",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <TransitionLink href="/" className="shrink-0 px-6 py-5 lg:px-10">
              <SlicedText
                text="VRΛJΛ MΛRII"
                className={cn("text-2xl transition-colors duration-300", textColor)}
                splitSpacing={3}
              />
            </TransitionLink>
          </motion.div>

          {/* Logo - Mobile (slides left on scroll down) */}
          <motion.div
            className="flex items-center lg:hidden"
            initial={{ opacity: 1, x: 0 }}
            animate={{
              opacity: isNavVisible ? 1 : 0,
              x: isNavVisible ? 0 : -100,
              pointerEvents: isNavVisible ? "auto" : "none",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <TransitionLink href="/" className="shrink-0 px-4 py-4">
              <SlicedText
                text="VRΛJΛ MΛRII"
                className={cn("text-lg transition-colors duration-300", textColor)}
                splitSpacing={2}
              />
            </TransitionLink>
          </motion.div>

          {/* Right side: Nav links + CTA Button grouped together */}
          <div className="flex items-center">
            {/* Desktop Navigation - hides/shows based on scroll */}
            <motion.div
              className="hidden items-center gap-8 pr-6 lg:flex"
              initial={{ opacity: 1, y: 0 }}
              animate={{
                opacity: isNavVisible ? 1 : 0,
                y: isNavVisible ? 0 : -10,
                pointerEvents: isNavVisible ? "auto" : "none",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {navLinks.map((link) => (
                <AnimatedLink
                  key={link.href}
                  href={link.href}
                  variant={colorVariant}
                >
                  {link.label}
                </AnimatedLink>
              ))}
            </motion.div>

            {/* Language Switcher - always visible on desktop */}
            <div className="hidden pr-6 lg:block">
              <LanguageSwitcher variant={colorVariant} />
            </div>

            {/* Auth - Login link or User menu */}
            {!authLoading && (
              <div className="hidden pr-6 lg:block">
                {user ? (
                  <UserMenu variant={colorVariant} />
                ) : (
                  <AnimatedLink href="/login" variant={colorVariant}>
                    {t("login")}
                  </AnimatedLink>
                )}
              </div>
            )}

            {/* CTA Button - always visible on desktop */}
            <div className="hidden lg:block">
              <AnimatedButton
                href="/book"
                bgColor="#C6A979"
                textColor="#ffffff"
                hoverTextColor="#ffffff"
                borderColor="#7B5F42"
                initialText={tCommon("bookScan")}
                hoverText={tCommon("bookScanHover")}
                className="px-10 py-7"
              />
            </div>

            {/* Mobile: CTA Button (slides right when hamburger hides) */}
            <motion.div
              className="lg:hidden"
              initial={{ x: 0 }}
              animate={{
                x: isNavVisible ? 0 : 64, // 64px = hamburger width (w-16)
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <TransitionLink
                href="/book"
                className="flex h-16 items-center bg-[#C2A87A] px-6 text-sm font-medium uppercase tracking-wider text-white"
              >
                {tCommon("bookScan")}
              </TransitionLink>
            </motion.div>

            {/* Mobile: Menu Button (slides right on scroll down) */}
            <motion.div
              className="flex items-center lg:hidden"
              initial={{ opacity: 1, x: 0 }}
              animate={{
                opacity: isNavVisible ? 1 : 0,
                x: isNavVisible ? 0 : 100,
                pointerEvents: isNavVisible ? "auto" : "none",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "flex h-16 w-16 items-center justify-center transition-colors duration-300 lg:hidden",
                  isInHero ? "bg-gray-800/90" : "bg-gray-100"
                )}
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1.5">
                  <motion.span
                    className={cn("block h-0.5 w-5 transition-colors duration-300", hamburgerBg)}
                    animate={
                      isMobileMenuOpen
                        ? { rotate: 45, y: 8 }
                        : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className={cn("block h-0.5 w-5 transition-colors duration-300", hamburgerBg)}
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className={cn("block h-0.5 w-5 transition-colors duration-300", hamburgerBg)}
                    animate={
                      isMobileMenuOpen
                        ? { rotate: -45, y: -8 }
                        : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </button>
            </motion.div>
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
                  className="h-full w-[20vw] origin-top bg-gray-500"
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
                {mobileNavLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={linkAnimation}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    custom={index}
                    className="border-b border-white/20 py-4"
                  >
                    <TransitionLink
                      href={link.href}
                      className="font-(family-name:--font-playfair) text-3xl font-light italic text-white transition-opacity hover:opacity-70"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </TransitionLink>
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
