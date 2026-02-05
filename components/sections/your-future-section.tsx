'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Link } from '@/i18n/routing';
import { TextRoll } from '@/components/ui/text-roll';
import Image from 'next/image';

export default function YourFutureSection() {
  const t = useTranslations('yourFuture');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [showBox, setShowBox] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Get the main scroll container
  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  // Sequential animation stages
  useEffect(() => {
    if (isInView) {
      // Stage 1: Box slides in
      const timer0 = setTimeout(() => setShowBox(true), 100);

      // Stage 2: Text appears with roll animation (after box animation)
      const timer1 = setTimeout(() => setShowText(true), 800);

      // Stage 3: Button appears (after text roll animation)
      const timer2 = setTimeout(() => setShowButton(true), 1400);

      return () => {
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax on background image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen"
    >
      {/* Full Background Image - this one has overflow hidden */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src="/images/your_future.webp"
            alt="Your future background"
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </div>

      {/* Content Container - NO overflow hidden here */}
      <div className="relative z-10 flex min-h-screen items-center justify-end">
        {/* Content Card + Button Container - flush right */}
        <div className="flex flex-col items-end">
          {/* Large Text Box - slides in from right */}
          <motion.div
            ref={cardRef}
            className="w-[90vw] max-w-2xl bg-[#0097a7] px-8 py-10 shadow-2xl sm:px-12 sm:py-14 lg:px-16 lg:py-16"
            initial={{ x: 800 }}
            animate={{ x: showBox ? 0 : 800 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Title with text effect - rolls in as it appears */}
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic leading-tight text-white sm:text-5xl lg:text-6xl">
              {showText && (
                <TextRoll
                  duration={0.4}
                  getEnterDelay={() => 0}
                  getExitDelay={(i) => i * 0.025}
                  variants={{
                    enter: {
                      initial: { rotateX: -90, opacity: 0 },
                      animate: { rotateX: -90, opacity: 0 },
                    },
                    exit: {
                      initial: { rotateX: 90, opacity: 0 },
                      animate: { rotateX: 0, opacity: 1 },
                    },
                  }}
                >
                  {t('title')}
                </TextRoll>
              )}
            </h2>

            {/* Description */}
            <motion.p
              className="mt-6 text-base leading-relaxed text-white/90 sm:mt-8 sm:text-lg lg:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {t('description')}
            </motion.p>
          </motion.div>

          {/* CTA Button - appears below the box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link
              href="/book"
              className="group inline-flex items-center gap-3 bg-gray-900 px-8 py-5 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-gray-800"
            >
              {tCommon('bookScan')}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Static decorative orbs - optimized for Chrome performance */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        <div
          className="absolute h-64 w-64 rounded-full bg-white/10 blur-2xl"
          style={{ top: '15%', left: '20%' }}
        />
        <div
          className="absolute h-48 w-48 rounded-full bg-[#0097a7]/15 blur-2xl"
          style={{ bottom: '25%', left: '15%' }}
        />
      </div>
    </section>
  );
}
