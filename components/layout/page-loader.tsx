'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Preloader from '@/components/ui/preloader';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hidePreloader = () => {
      setIsLoading(false);
    };

    // Wait for all resources to load
    if (document.readyState === 'complete') {
      // Page already loaded, wait 500ms
      setTimeout(hidePreloader, 500);
    } else {
      // Wait for load event + 500ms
      const handleLoad = () => {
        setTimeout(hidePreloader, 500);
      };
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && <Preloader />}
    </AnimatePresence>
  );
}
