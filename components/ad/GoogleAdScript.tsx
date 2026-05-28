'use client';

import Script from 'next/script';

import { useCookieConsent } from '@/components/cookie/CookieConsentProvider';

type GoogleAdScriptProps = {
  src?: string;
};

export default function GoogleAdScript({ src }: GoogleAdScriptProps) {
  const { consent, hydrated } = useCookieConsent();
  if (!hydrated || consent === 'rejected' || !src) return null;
  return <Script async src={src} crossOrigin='anonymous' />;
}
