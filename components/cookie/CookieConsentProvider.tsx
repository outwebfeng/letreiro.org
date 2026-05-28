'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Consent = 'accepted' | 'rejected' | null;
type CookieConsentContextValue = {
  consent: Consent;
  hydrated: boolean;
  setConsent: (value: Exclude<Consent, null>) => void;
  resetConsent: () => void;
};

const STORAGE_KEY = 'cookie-consent';

const defaultCookieConsentContext: CookieConsentContextValue = {
  consent: null,
  hydrated: false,
  setConsent: () => {},
  resetConsent: () => {},
};

const CookieConsentContext = createContext(defaultCookieConsentContext);

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

  const setConsent = useCallback((value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsentState(value);
  }, []);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentState(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      consent: hydrated ? consent : null,
      hydrated,
      setConsent,
      resetConsent,
    }),
    [consent, hydrated, resetConsent, setConsent],
  );

  return (
    <CookieConsentContext.Provider value={contextValue}>{children}</CookieConsentContext.Provider>
  );
}

export const useCookieConsent = () => useContext(CookieConsentContext);

export function useHasUserChosen() {
  const { consent, hydrated } = useCookieConsent();
  return hydrated && consent !== null;
}
