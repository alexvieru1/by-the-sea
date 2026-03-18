'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import PrimaryButton from '@/components/ui/primary-button';
import { TextRoll } from '@/components/ui/text-roll';

interface VideoShowcaseSectionProps {
  translationKey: string;
  videoSrc: string;
  cardBg: string;
  sectionBg: string;
  videoSide: 'left' | 'right';
  ctaKey?: string;
  ctaHref: string;
  lightHeader?: boolean;
}

export default function VideoShowcaseSection({
  translationKey,
  videoSrc,
  cardBg,
  sectionBg,
  videoSide,
  ctaKey = 'learnMore',
  ctaHref,
  lightHeader = false,
}: VideoShowcaseSectionProps) {
  const t = useTranslations(translationKey);
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [showBox, setShowBox] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  useEffect(() => {
    if (isInView) {
      const timer0 = setTimeout(() => setShowBox(true), 100);
      const timer1 = setTimeout(() => setShowText(true), 800);
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

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  const isVideoLeft = videoSide === 'left';
  const slideFrom = isVideoLeft ? 800 : -800;

  const cardContent = (
    <div className={cn(
      'order-1 flex items-center px-6 py-14 lg:w-1/2 lg:px-0 lg:py-0',
      isVideoLeft ? 'justify-end lg:order-2' : 'justify-start lg:order-1',
      sectionBg,
    )}>
      <div className={cn('flex flex-col', isVideoLeft ? 'items-end' : 'items-start')}>
        <motion.div
          className={cn('w-[90vw] max-w-2xl px-8 py-10 shadow-2xl sm:px-12 sm:py-14 lg:px-16 lg:py-16', cardBg)}
          initial={{ x: slideFrom }}
          animate={{ x: showBox ? 0 : slideFrom }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="mb-3 text-xs font-medium uppercase tracking-wider text-white/70 sm:text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
            transition={{ duration: 0.4 }}
          >
            {t('subtitle')}
          </motion.p>

          <h2 className="font-[family-name:var(--font-quicksand)] text-4xl font-thin leading-tight text-white sm:text-5xl lg:text-6xl">
            {showText ? (
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
            ) : (
              <span className="invisible">{t('title')}</span>
            )}
          </h2>

          {['description', 'description-2', 'description-3', 'description-4'].map((key, i) => {
            const text = t.has(key) ? t(key) : null;
            if (!text) return null;
            return (
              <motion.p
                key={key}
                className="mt-6 text-base leading-relaxed text-white/90 first:sm:mt-8 sm:text-lg lg:text-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              >
                {text}
              </motion.p>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <PrimaryButton href={ctaHref} variant="dark" size="xl" arrow>
            {tCommon(ctaKey)}
          </PrimaryButton>
        </motion.div>
      </div>
    </div>
  );

  const videoContent = (
    <div className={cn(
      'order-2 relative min-h-[50vh] overflow-hidden lg:min-h-0 lg:w-1/2',
      isVideoLeft ? 'lg:order-1' : 'lg:order-2',
    )}>
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </motion.div>
    </div>
  );

  return (
    <section ref={sectionRef} className={cn('snap-section relative min-h-screen', lightHeader && 'light-header-section')}>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {cardContent}
        {videoContent}
      </div>
    </section>
  );
}
