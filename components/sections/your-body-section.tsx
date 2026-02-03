'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import ClaudeButton from '@/components/ui/claude-button';
import { TextRoll } from '@/components/ui/text-roll';
import Image from 'next/image';

export default function YourBodySection() {
  const t = useTranslations('yourBody');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [showText, setShowText] = useState(false);

  // Get the main scroll container
  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  // Trigger text animation after card animation completes
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowText(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtler parallax that works well with snap scroll
  const imageScale = useTransform(scrollYProgress, [0.2, 0.8], [1.03, 1]);
  const imageY = useTransform(scrollYProgress, [0.2, 0.8], ['-2%', '2%']);

  return (
    <section
      ref={sectionRef}
      className="snap-section relative overflow-hidden bg-[#e8d8d4] py-16 lg:py-0"
    >
      <div className="mx-auto flex h-full min-h-screen max-w-7xl flex-col items-center px-6 lg:flex-row lg:items-stretch lg:px-12">
        {/* Left side - Content Card */}
        <div className="z-10 flex w-full items-center py-12 lg:w-1/2 lg:py-24">
          <motion.div
            ref={cardRef}
            className="w-full max-w-lg bg-[#f07060] p-8 shadow-2xl lg:p-12"
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic leading-tight text-white lg:text-5xl">
              {showText ? (
                <TextRoll
                  duration={0.3}
                  getEnterDelay={(i) => i * 0.03}
                  getExitDelay={(i) => i * 0.03 + 0.1}
                >
                  {t('title')}
                </TextRoll>
              ) : (
                <span className="invisible">{t('title')}</span>
              )}
            </h2>
            <motion.p
              className="mt-6 text-base leading-relaxed text-white/90 lg:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {t('description')}
            </motion.p>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <ClaudeButton href="/book" variant="dark" size="lg">
                {tCommon('bookScan')}
              </ClaudeButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Image with floating orbs */}
        <div className="relative flex w-full items-center justify-center lg:w-1/2">
          <motion.div
            className="relative aspect-[3/4] w-full max-w-md overflow-hidden lg:aspect-auto lg:h-[80vh] lg:max-w-none"
            style={{ scale: imageScale, y: imageY }}
          >
            {/* Placeholder for person image */}
            <Image className="absolute inset-0 bg-gradient-to-br from-[#d4c4c0] to-[#c5b5b1]" src="/images/your_body.webp" alt="Person" fill />

            {/* Floating orbs effect */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Large soft orb 1 */}
              <motion.div
                className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl"
                style={{ top: '10%', left: '20%' }}
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -40, 20, 0],
                  scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Large soft orb 2 */}
              <motion.div
                className="absolute h-48 w-48 rounded-full bg-[#f07060]/15 blur-3xl"
                style={{ bottom: '20%', right: '10%' }}
                animate={{
                  x: [0, -25, 15, 0],
                  y: [0, 30, -25, 0],
                  scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Medium orb */}
              <motion.div
                className="absolute h-32 w-32 rounded-full bg-white/8 blur-2xl"
                style={{ top: '50%', left: '60%' }}
                animate={{
                  x: [0, 40, -30, 0],
                  y: [0, -20, 35, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Small accent orb */}
              <motion.div
                className="absolute h-20 w-20 rounded-full bg-[#f07060]/10 blur-xl"
                style={{ top: '30%', right: '30%' }}
                animate={{
                  x: [0, -20, 25, 0],
                  y: [0, 25, -15, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
