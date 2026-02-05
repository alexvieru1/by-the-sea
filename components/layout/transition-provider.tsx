'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const startTransition = useCallback((href: string) => {
    setIsTransitioning(true);
    setPendingHref(href);
  }, []);

  const completeTransition = useCallback(() => {
    if (pendingHref) {
      router.push(pendingHref);
      setPendingHref(null);
    }
    // Small delay to let the page load before showing exit animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, [pendingHref, router]);

  return (
    <TransitionContext.Provider
      value={{ isTransitioning, startTransition, completeTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
