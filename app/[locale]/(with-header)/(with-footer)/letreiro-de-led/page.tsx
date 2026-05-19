import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import LEDModeContent from './LEDModeContent';

import { BASE_URL } from '@/lib/env';

const DEFAULT_LOCALE = 'pt';
const ROUTE_PATH = '/letreiro-de-led';

function localePath(locale: string) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata.letreiroDeLed' });

  const canonicalUrl = `${BASE_URL}${localePath(locale)}${ROUTE_PATH}`;

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
  };
}

export default function LEDModePage() {
  return <LEDModeContent />;
}
