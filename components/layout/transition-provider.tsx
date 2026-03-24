'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname as useNextPathname } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: (href: string) => void;
  completeTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within TransitionProvider');
  }
  return context;
}

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const waitingForRoute = useRef(false);
  const router = useRouter();
  const pathname = useNextPathname();

  // When the pathname changes after navigation, dismiss the overlay
  useEffect(() => {
    if (waitingForRoute.current) {
      waitingForRoute.current = false;
      // Give one frame for the new page to paint before revealing
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }
  }, [pathname]);

  const startTransition = useCallback((href: string) => {
    setIsTransitioning(true);
    setPendingHref(href);
  }, []);

  const completeTransition = useCallback(() => {
    if (pendingHref) {
      waitingForRoute.current = true;
      router.push(pendingHref);
      setPendingHref(null);
    }
  }, [pendingHref, router]);

  return (
    <TransitionContext.Provider
      value={{ isTransitioning, startTransition, completeTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
