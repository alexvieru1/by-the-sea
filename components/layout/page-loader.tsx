'use client';

import { useEffect } from 'react';
import Preloader from '@/components/ui/preloader';

export default function PageLoader() {
  useEffect(() => {
    // Show preloader for a minimum of 500ms after all resources are loaded
    const hidePreloader = () => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        // Remove from DOM after fade out
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }
    };

    // Wait for all resources to load
    if (document.readyState === 'complete') {
      // Page already loaded
      setTimeout(hidePreloader, 500);
    } else {
      // Wait for load event
      const handleLoad = () => {
        setTimeout(hidePreloader, 500);
      };
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  return <Preloader />;
}
