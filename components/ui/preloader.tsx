'use client';

import { motion } from 'motion/react';
import { SpinningText } from "./spinning-text";

const transitionEase = [0.76, 0, 0.24, 1] as const;

export default function Preloader() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#002343]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: transitionEase }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: transitionEase }}
      >
        <SpinningText className="text-white/80"> VRΛJΛ MΛRII • by the Sea • Health Oasis •</SpinningText>
      </motion.div>
    </motion.div>
  );
}
