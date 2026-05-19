import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { BASE_URL } from '@/lib/env';

const DEFAULT_LOCALE = 'pt';

function localePath(locale: string) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export default async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  const canonicalUrl = `${BASE_URL}${localePath(locale)}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'pt-BR': `${BASE_URL}`,
        'en': `${BASE_URL}/en`,
        'es': `${BASE_URL}/es`,
        'x-default': `${BASE_URL}`,
      },
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}
