'use client';

import { motion } from 'motion/react';
import { SpinningText } from "./spinning-text";

const stairsEase = [0.33, 1, 0.68, 1] as const;

const stairAnimation = {
  initial: { height: "100%" },
  exit: (i: number) => ({
    height: 0,
    transition: { duration: 0.5, delay: 0.05 * i, ease: stairsEase },
  }),
};

const contentAnimation = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: stairsEase },
  },
};

export default function Preloader() {
  return (
    <>
      {/* Sliding Stairs Background */}
      <div className="pointer-events-none fixed inset-0 z-[100] flex">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="h-full w-[20vw] origin-top bg-gray-50"
            variants={stairAnimation}
            initial="initial"
            exit="exit"
            custom={4 - index}
          />
        ))}
      </div>

      {/* Preloader Content */}
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        variants={contentAnimation}
        initial="initial"
        exit="exit"
      >
        <SpinningText> VRΛJΛ MΛRII • by the Sea • Health Oasis •</SpinningText>
      </motion.div>
    </>
  );
}
