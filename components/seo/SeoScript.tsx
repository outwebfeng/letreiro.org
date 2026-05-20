'use client';

import Script from 'next/script';

import { GOOGLE_TRACKING_ID } from '@/lib/env';
import { useCookieConsent } from '@/components/cookie/CookieConsentProvider';

export default function SeoScript() {
  const { consent } = useCookieConsent();
  if (consent !== 'accepted') return null;

  return (
    <>
      <Script strategy='afterInteractive' src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TRACKING_ID}`} />
      <script defer data-domain='letreiro.org' src='https://app.pageview.app/js/script.js' />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TRACKING_ID}', {
            page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
