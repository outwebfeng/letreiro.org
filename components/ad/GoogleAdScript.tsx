'use client';

import Script from 'next/script';

import { GOOGLE_ADSENSE_URL } from '@/lib/env';
import { useCookieConsent } from '@/components/cookie/CookieConsentProvider';

export default function GoogleAdScript() {
  const { consent } = useCookieConsent();
  if (consent !== 'accepted') return null;
  return <Script async src={GOOGLE_ADSENSE_URL} crossOrigin='anonymous' />;
}
