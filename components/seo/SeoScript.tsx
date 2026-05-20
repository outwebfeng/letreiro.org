'use client';

import Script from 'next/script';

import { GOOGLE_TRACKING_ID } from '@/lib/env';
import { useCookieConsent } from '@/components/cookie/CookieConsentProvider';

export default function SeoScript() {
  const { consent } = useCookieConsent();

  return (
    <>
      {/* pageview.app (Plausible 兼容):cookieless analytics,LGPD/GDPR/CCPA 默认合规,
          不需要用户同意。无条件加载,这是隐私优先分析工具的核心卖点 */}
      <script defer data-domain='letreiro.org' src='https://app.pageview.app/js/script.js' />

      {/* GA4:使用 cookie 做跨会话识别,LGPD 要求明示同意 */}
      {consent === 'accepted' && (
        <>
          <Script strategy='afterInteractive' src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TRACKING_ID}`} />
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
      )}
    </>
  );
}
