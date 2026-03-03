'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/lib/gallery-data';

const orientationClasses: Record<string, string> = {
  landscape: 'col-span-2 row-span-1',
  portrait: 'col-span-1 row-span-2',
  square: 'col-span-1 row-span-1',
};

interface BentoGridProps {
  images: GalleryImage[];
}

export default function BentoGrid({ images }: BentoGridProps) {
  return (
    <div className="grid auto-rows-[200px] grid-flow-dense grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, i) => (
        <motion.div
          key={image.id}
          className={cn(
            'group relative overflow-hidden',
            orientationClasses[image.orientation] ?? orientationClasses.square
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </motion.div>
      ))}
    </div>
  );
}
