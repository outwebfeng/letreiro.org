import { NextIntlClientProvider, useMessages } from 'next-intl';
import { DotGothic16, Press_Start_2P, Silkscreen, VT323 } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

import { Suspense } from 'react';

import { GOOGLE_ADSENSE_ACCOUNT } from '@/lib/env';
import GoogleAdScript from '@/components/ad/GoogleAdScript';
import SeoScript from '@/components/seo/SeoScript';
import { CookieConsentProvider } from '@/components/cookie/CookieConsentProvider';
import CookieBanner from '@/components/cookie/CookieBanner';

import Loading from './loading';

// LED 跑马灯字体选项;preload: false 避免影响首屏 LCP,用户选了之后才下载字体文件
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
  preload: false,
});
const pressStart2p = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-press-start-2p',
  preload: false,
});
const silkscreen = Silkscreen({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-silkscreen',
  preload: false,
});
const dotGothic16 = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dotgothic16',
  preload: false,
});

const FONT_VARS = `${vt323.variable} ${pressStart2p.variable} ${silkscreen.variable} ${dotGothic16.variable}`;

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name='google-adsense-account' content={GOOGLE_ADSENSE_ACCOUNT} />
      </head>
      <body className={`relative mx-auto flex min-h-screen flex-col bg-[#f8f9fb] text-black ${FONT_VARS}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookieConsentProvider>
            <Toaster
              position='top-center'
              toastOptions={{
                classNames: {
                  error: 'bg-red-400',
                  success: 'text-green-400',
                  warning: 'text-yellow-400',
                  info: 'bg-blue-400',
                },
              }}
            />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <CookieBanner />
            <GoogleAdScript />
            <SeoScript />
          </CookieConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
