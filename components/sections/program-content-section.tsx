'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import Image from 'next/image';

interface ProgramContentSectionProps {
  photoSide: 'left' | 'right';
  imageSrc: string;
  imageAlt: string;
  subtitle: string;
  title: string;
  texts: string[];
}

export default function ProgramContentSection({
  photoSide,
  imageSrc,
  imageAlt,
  subtitle,
  title,
  texts,
}: ProgramContentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  const photoContent = (
    <div className="relative aspect-[3/4] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[600px]">
      <motion.div
        className="absolute inset-0 h-[120%] w-full"
        style={{ scale: imageScale, y: imageY, willChange: 'transform' }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  );

  const textContent = (
    <div className="flex items-center px-6 py-16 lg:px-16 lg:py-24">
      <div className="max-w-xl">
        <motion.p
          className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic leading-tight text-gray-900 sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h2>
        {texts.map((text, i) => (
          <motion.p
            key={i}
            className="mt-6 text-base leading-relaxed text-gray-600 lg:text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="grid lg:grid-cols-2">
        {photoSide === 'left' ? (
          <>
            {photoContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {photoContent}
          </>
        )}
      </div>
    </section>
  );
}
