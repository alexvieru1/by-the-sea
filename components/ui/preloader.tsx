'use client';

import { SpinningText } from "./spinning-text";

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 bg-gray-50 z-[100] flex items-center justify-center opacity-100 transition-opacity duration-500"
    >
      <SpinningText>VRΛJΛ MΛRII • by the Sea • Health Oasis •</SpinningText>
    </div>
  );
}
