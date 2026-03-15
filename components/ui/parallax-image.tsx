'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PlaceholderImage from '@/components/ui/placeholder-image';

interface ParallaxImageProps {
  label: string;
  src: string;
  className?: string;
  y?: [string, string];
  scale?: [number, number, number];
}

export default function ParallaxImage({
  label,
  src,
  className,
  y: yRange = ['-20%', '20%'],
  scale: scaleRange = [1.1, 1.05, 1.1],
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleRange);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? 'aspect-4/3'}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <PlaceholderImage label={label} src={src} className="h-full w-full" />
      </motion.div>
    </div>
  );
}
