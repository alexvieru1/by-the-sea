'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import ClaudeButton from '@/components/ui/claude-button';

export default function HeroSection() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get the main scroll container
  useEffect(() => {
    scrollContainerRef.current = document.querySelector('main');
  }, []);

  // Handle video autoplay for Safari
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Try to play the video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented - video will show poster
        });
      }
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start start', 'end start'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <section
      ref={containerRef}
      className="hero-section snap-section relative overflow-hidden bg-[#c5d5d8]"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster="/images/hero-poster.webp"
        >
          <source src="https://pub-df344bc27b69486fa2190081e1a1fade.r2.dev/hero.MP4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[#c5d5d8]/20" />
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 mx-auto hidden h-full max-w-[1600px] lg:grid lg:grid-cols-[1fr_1.2fr_1fr] lg:items-center lg:gap-8 lg:px-12 xl:px-20">
        {/* Left: Headline */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-normal italic leading-[1.1] tracking-tight text-white xl:text-6xl 2xl:text-7xl">
            {t('title1')}
            <br />
            <span className="mt-2 block text-white/90">{t('title2')}</span>
          </h1>
        </motion.div>

        {/* Center: Empty space for video focus */}
        <div />

        {/* Right: Description + CTA */}
        <motion.div
          className="max-w-sm"
          style={{ opacity: contentOpacity, y: contentY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="text-lg leading-relaxed text-gray-300">
            {t('description')}
          </p>
          <div className="mt-8">
            <ClaudeButton href="/book" variant="primary" size="lg">
              {tCommon('bookScan')}
            </ClaudeButton>
          </div>
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="relative z-10 flex h-full flex-col px-6 pb-8 pt-24 lg:hidden">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic leading-[1.15] tracking-tight text-white sm:text-5xl">
            {t('title1')}
            <br />
            <span className="text-white/90">{t('title2')}</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-sm text-base leading-relaxed text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {t('description')}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ClaudeButton href="/book" variant="primary" size="md">
            {tCommon('bookScan')}
          </ClaudeButton>
        </motion.div>
      </div>
    </section>
  );
}
