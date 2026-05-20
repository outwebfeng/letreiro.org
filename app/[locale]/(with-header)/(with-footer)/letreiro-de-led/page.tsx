import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import LEDModeContent from './LEDModeContent';

import { BASE_URL } from '@/lib/env';

const DEFAULT_LOCALE = 'pt';
const ROUTE_PATH = '/letreiro-de-led';

const OG_LOCALE_MAP: Record<string, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
};

function localePath(locale: string) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata.letreiroDeLed' });

  const canonicalUrl = `${BASE_URL}${localePath(locale)}${ROUTE_PATH}`;
  const ogImageUrl = `${BASE_URL}/images/og-image-${locale}.png`;
  const ogLocale = OG_LOCALE_MAP[locale] || 'pt_BR';
  const alternateLocale = Object.values(OG_LOCALE_MAP).filter((l) => l !== ogLocale);

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'pt-BR': `${BASE_URL}${ROUTE_PATH}`,
        'en': `${BASE_URL}/en${ROUTE_PATH}`,
        'es': `${BASE_URL}/es${ROUTE_PATH}`,
        'x-default': `${BASE_URL}${ROUTE_PATH}`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      siteName: 'Letreiro.org',
      locale: ogLocale,
      alternateLocale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: t('title'),
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [ogImageUrl],
    },
  };
}

export default function LEDModePage() {
  return <LEDModeContent />;
}
