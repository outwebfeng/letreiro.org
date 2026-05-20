'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Consent = 'accepted' | 'rejected' | null;

const STORAGE_KEY = 'cookie-consent';

const CookieConsentContext = createContext<{
  consent: Consent;
  setConsent: (value: 'accepted' | 'rejected') => void;
  resetConsent: () => void;
}>({
  consent: null,
  setConsent: () => {},
  resetConsent: () => {},
});

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'accepted' || saved === 'rejected') {
      setConsentState(saved);
    }
    setHydrated(true);
  }, []);

  const setConsent = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsentState(value);
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentState(null);
  };

  return (
    <CookieConsentContext.Provider value={{ consent: hydrated ? consent : null, setConsent, resetConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export const useCookieConsent = () => useContext(CookieConsentContext);

export function useHasUserChosen() {
  const { consent } = useCookieConsent();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && consent !== null;
}
