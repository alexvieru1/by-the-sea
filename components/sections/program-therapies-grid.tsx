'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface Therapy {
  name: string;
  description: string;
}

interface ProgramTherapiesGridProps {
  title: string;
  therapies: Therapy[];
  accentColor: string;
}

export default function ProgramTherapiesGrid({
  title,
  therapies,
  accentColor,
}: ProgramTherapiesGridProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-gray-50 px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic text-gray-900 sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {therapies.map((therapy, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <div
                className="mb-4 h-1 w-10"
                style={{ backgroundColor: accentColor }}
              />
              <h3 className="text-base font-medium text-gray-900">
                {therapy.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {therapy.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
