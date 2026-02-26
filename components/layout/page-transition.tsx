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

function LoadingOverlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <span className="text-3xl font-normal tracking-wide text-gray-900 sm:text-4xl">
        VRΛJΛ MΛRII
      </span>
      <span className="text-xs font-light uppercase tracking-[0.3em] text-gray-400">
        by the sea
      </span>
      <div className="mt-2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

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
                if (definition === 'enter' && index === 4) {
                  completeTransition();
                }
              }}
            />
          ))}
          <LoadingOverlay />
        </div>
      )}
    </AnimatePresence>
  );
}
