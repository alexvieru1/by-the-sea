'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePageTransition } from './transition-provider';

const stairsEase = [0.76, 0, 0.24, 1] as const;

const stairVariants = {
  initial: (i: number) => ({
    scaleY: 0,
    transition: { duration: 0.4, delay: 0.05 * i, ease: stairsEase },
  }),
  enter: (i: number) => ({
    scaleY: 1,
    transition: { duration: 0.4, delay: 0.05 * i, ease: stairsEase },
  }),
  exit: (i: number) => ({
    scaleY: 0,
    transition: { duration: 0.4, delay: 0.05 * i, ease: stairsEase },
  }),
};

export default function PageTransition() {
  const { isTransitioning, completeTransition } = usePageTransition();

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <div className="pointer-events-none fixed inset-0 z-[99] flex">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className="h-full w-[20vw] origin-top bg-gray-50"
              custom={index}
              variants={stairVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              onAnimationComplete={(definition) => {
                // Trigger navigation when last stair finishes enter animation
                if (definition === 'enter' && index === 4) {
                  completeTransition();
                }
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
