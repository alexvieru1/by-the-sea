'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransitionLink from '@/components/layout/transition-link';
import { TextRoll } from '@/components/ui/text-roll';
import Image from 'next/image';

interface ShowcaseSectionProps {
  translationKey: 'yourBody' | 'yourFuture';
  imageSrc: string;
  imageAlt: string;
  cardBg: string;
  align: 'left' | 'right';
  className?: string;
  orbs: Array<{
    size: string;
    position: React.CSSProperties;
  }>;
}

export default function ShowcaseSection({
  translationKey,
  imageSrc,
  imageAlt,
  cardBg,
  align,
  className,
  orbs,
}: ShowcaseSectionProps) {
  const t = useTranslations(translationKey);
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  const isRight = align === 'right';
  const slideFrom = isRight ? 800 : -800;

  return (
    <section
      ref={sectionRef}
      className={cn('relative min-h-screen', className)}
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className={cn(
        'relative z-10 flex min-h-screen items-center',
        isRight && 'justify-end'
      )}>
        <div className={cn(
          'flex flex-col',
          isRight ? 'items-end' : 'items-start'
        )}>
          {/* Text Box */}
          <motion.div
            ref={cardRef}
            className={cn('w-[90vw] max-w-2xl px-8 py-10 shadow-2xl sm:px-12 sm:py-14 lg:px-16 lg:py-16', cardBg)}
            initial={{ x: slideFrom }}
            animate={{ x: showBox ? 0 : slideFrom }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic leading-tight text-white sm:text-5xl lg:text-6xl">
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

            <motion.p
              className="mt-6 text-base leading-relaxed text-white/90 sm:mt-8 sm:text-lg lg:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {t('description')}
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <TransitionLink
              href="/book"
              className="group inline-flex items-center gap-3 bg-gray-900 px-8 py-5 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {tCommon('bookScan')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </TransitionLink>
          </motion.div>
        </div>
      </div>

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className={cn('absolute rounded-full', orb.size)}
            style={orb.position}
          />
        ))}
      </div>
    </section>
  );
}
