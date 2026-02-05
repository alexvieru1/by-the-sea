'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import Image from 'next/image';

// Label positions for the floating badges - desktop positions
const labelPositionsDesktop = [
  { key: 'heartRhythm', x: -30, y: 55 },
  { key: 'skinMapping', x: 15, y: 45 },
  { key: 'diabetesFactors', x: -5, y: 60 },
  { key: 'metabolism', x: 25, y: 70 },
  { key: 'immuneSystem', x: -20, y: 75 },
  { key: 'bodyMeasurements', x: 5, y: 85 },
];

// Label positions for mobile - adjusted for vertical image, shifted left to center
const labelPositionsMobile = [
  { key: 'skinMapping', x: -15, y: 35 },
  { key: 'heartRhythm', x: -30, y: 50 },
  { key: 'diabetesFactors', x: -10, y: 58 },
  { key: 'immuneSystem', x: -25, y: 68 },
  { key: 'metabolism', x: -15, y: 78 },
  { key: 'bodyMeasurements', x: -20, y: 88 },
];

export default function DataPointsSection() {
  const t = useTranslations('dataPoints');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [visibleLabels, setVisibleLabels] = useState<Set<string>>(new Set());

  // Only animate waves when section is in view (performance optimization for Chrome)
  const isInView = useInView(sectionRef, { amount: 0.1 });

  // Get the main scroll container
  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  // Adjusted for smoother snap scroll experience
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.1, 0.25], [30, 0]);

  // GSAP ScrollTrigger for labels - dynamically imported for better bundle size
  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: ReturnType<typeof import('gsap').gsap.context> | null = null;

    const initGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const mainElement = document.querySelector('main');

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          scroller: mainElement,
          start: 'top 60%',
          end: 'bottom 40%',
          onUpdate: (self) => {
            const progress = self.progress;
            const maxLabels = Math.max(labelPositionsDesktop.length, labelPositionsMobile.length);
            const labelsToShow = Math.floor(progress * maxLabels * 1.5);
            const newVisibleLabels = new Set<string>();

            for (let i = 0; i < Math.min(labelsToShow, labelPositionsDesktop.length); i++) {
              newVisibleLabels.add(labelPositionsDesktop[i].key);
            }
            for (let i = 0; i < Math.min(labelsToShow, labelPositionsMobile.length); i++) {
              newVisibleLabels.add(labelPositionsMobile[i].key);
            }

            setVisibleLabels(newVisibleLabels);
          },
        });
      }, sectionRef);
    };

    initGsap();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="snap-section relative flex h-screen flex-col justify-center overflow-hidden bg-white"
    >
      {/* Headline */}
      <motion.div
        className="mb-8 px-6 pt-28 text-center lg:px-12 lg:pt-48"
        style={{ opacity: titleOpacity, y: titleY }}
      >
        <h2 className="font-(family-name:--font-playfair) text-3xl font-normal italic leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
          {t('title1')}
          <br />
          <span className="text-[#7eb8c4]">{t('title2')}</span>
        </h2>
      </motion.div>

      {/* Point Cloud Visualization - Full Width */}
      <div className="relative w-full">
        {/* Base image - Desktop */}
        <div className="relative hidden aspect-[21/7] w-full md:block">
          <Image
            src="/images/bg_desktop.png"
            alt="Data points visualization"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        
        {/* Base image - Mobile */}
        <div className="relative aspect-square w-full md:hidden">
          <Image
            src="/images/bg_mobile.png"
            alt="Data points visualization"
            fill
            className="object-cover object-bottom"
            priority
          />
        </div>

        {/* Animated wave highlight effect - only runs when in view */}
        {isInView && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Wave 1 - CSS animation for better performance */}
            <div
              className="absolute h-full w-full animate-wave-slow blur-[60px]"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%, transparent 100%)',
              }}
            />
            {/* Wave 2 - offset and slower */}
            <div
              className="absolute h-full w-full animate-wave-slower blur-[80px]"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, transparent 25%, rgba(0,165,201,0.08) 50%, transparent 75%, transparent 100%)',
              }}
            />
          </div>
        )}
        
        {/* Floating Labels - Desktop */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {labelPositionsDesktop.map(({ key, x, y }, index) => (
            <motion.div
              key={key}
              className="absolute"
              style={{
                left: `${50 + x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{
                opacity: visibleLabels.has(key) ? 1 : 0,
                scale: visibleLabels.has(key) ? 1 : 0.8,
                y: visibleLabels.has(key) ? 0 : 10,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: 'easeOut',
              }}
            >
              <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#00a5c9]" />
                <span className="text-xs font-medium tracking-wider text-gray-900">
                  {t(`labels.${key}`)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Labels - Mobile */}
        <div className="pointer-events-none absolute inset-0 md:hidden">
          {labelPositionsMobile.map(({ key, x, y }, index) => (
            <motion.div
              key={key}
              className="absolute"
              style={{
                left: `${50 + x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{
                opacity: visibleLabels.has(key) ? 1 : 0,
                scale: visibleLabels.has(key) ? 1 : 0.8,
                y: visibleLabels.has(key) ? 0 : 10,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: 'easeOut',
              }}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#00a5c9]" />
                <span className="text-[10px] font-medium tracking-wider text-gray-900">
                  {t(`labels.${key}`)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}