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
          <source src="https://pub-df344bc27b69486fa2190081e1a1fade.r2.dev/hero.mp4" type="video/mp4" />
        </video>
        {/* Subtle gradient overlay at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content - Bottom Left Grouped Layout */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 sm:pb-32 lg:px-12 lg:pb-36 xl:px-20 xl:pb-40"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-2xl">
          {/* Headline */}
          <motion.h1
            className="font-(family-name:--font-playfair) text-4xl font-normal italic leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {t('title1')}
            <br />
            <span className="text-white/90">{t('title2')}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-md text-base leading-relaxed text-gray-200 lg:mt-8 lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {t('description')}
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-6 lg:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <ClaudeButton href="/book" variant="primary" size="lg">
              {tCommon('bookScan')}
            </ClaudeButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
