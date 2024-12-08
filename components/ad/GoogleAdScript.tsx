import Script from 'next/script';

import { GOOGLE_ADSENSE_URL } from '@/lib/env';

export default function GoogleAdScript() {
  return (
    <>
      <Script async src={GOOGLE_ADSENSE_URL} crossOrigin='anonymous' />
      <Script
        src='https://alwingulla.com/88/tag.min.js'
        data-zone='118553'
        async
        data-cfasync='false'
        strategy='afterInteractive'
      />
    </>
  );
}
