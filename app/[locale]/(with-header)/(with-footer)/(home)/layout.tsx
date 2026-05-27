import { getTranslations } from 'next-intl/server';

import { BASE_URL } from '@/lib/env';

import generateMetadata from './metadata';

export { generateMetadata };

const DEFAULT_LOCALE = 'pt';

function localePath(locale: string) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

const IN_LANGUAGE: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Metadata.home' });
  const canonicalUrl = `${BASE_URL}${localePath(locale)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Letreiro.org',
    alternateName: 'Letreiro Digital',
    url: canonicalUrl,
    inLanguage: IN_LANGUAGE[locale] ?? 'pt-BR',
    description: t('description'),
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Letreiro.org',
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
