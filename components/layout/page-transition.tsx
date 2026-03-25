'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePageTransition } from './transition-provider';

const transitionEase = [0.76, 0, 0.24, 1] as const;

export default function PageTransition() {
  const { isTransitioning, completeTransition } = usePageTransition();

  // After the fade-in animation (~400ms), navigate to the new page
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(completeTransition, 500);
    return () => clearTimeout(timer);
  }, [isTransitioning, completeTransition]);

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[#002343]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: transitionEase }}
        >
          <motion.span
            className="text-3xl font-normal tracking-wide text-white sm:text-4xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, delay: 0.15, ease: transitionEase }}
          >
            VRΛJΛ MΛRII
          </motion.span>
          <motion.span
            className="mt-2 text-xs font-light uppercase tracking-[0.3em] text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.25, ease: transitionEase }}
          >
            by the sea
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
