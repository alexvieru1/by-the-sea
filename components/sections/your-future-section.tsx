'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import ClaudeButton from '@/components/ui/claude-button';

export default function YourFutureSection() {
  const t = useTranslations('yourFuture');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Get the main scroll container
  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  const cardX = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

  return (
    <section
      ref={sectionRef}
      className="snap-section relative overflow-hidden bg-[#d8f0f2] py-16 lg:py-0"
    >
      <div className="mx-auto flex h-full min-h-screen max-w-7xl flex-col-reverse items-center px-6 lg:flex-row lg:items-stretch lg:px-12">
        {/* Left side - Image with scanning effect */}
        <div className="relative flex w-full items-center justify-center lg:w-1/2">
          <motion.div
            className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl lg:aspect-auto lg:h-[80vh] lg:max-w-none lg:rounded-none"
            style={{ scale: imageScale }}
          >
            {/* Placeholder for person image - using gradient as placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c8e8eb] to-[#b5dce0]" />
            
            {/* Scanning dots overlay effect */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Animated scanning line */}
              <motion.div
                className="absolute left-0 h-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{
                  top: ['100%', '0%', '100%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Dot grid overlay */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(0,151,167,0.6) 1px, transparent 1px)`,
                  backgroundSize: '18px 18px',
                }}
              />
              
              {/* Pulsing highlight */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0097a7]/10 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Content Card */}
        <motion.div
          className="z-10 flex w-full items-center py-12 lg:w-1/2 lg:justify-end lg:py-24"
          style={{ x: cardX, opacity: cardOpacity }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#0097a7] p-8 shadow-2xl lg:p-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic leading-tight text-white lg:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/90 lg:text-lg">
              {t('description')}
            </p>
            <div className="mt-8">
              <ClaudeButton href="/book" variant="dark" size="lg">
                {tCommon('bookScan')}
              </ClaudeButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
