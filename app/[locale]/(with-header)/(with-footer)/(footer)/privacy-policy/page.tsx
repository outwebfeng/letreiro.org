import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

import { BASE_URL } from '@/lib/env';
import CookieConsentManager from '@/components/cookie/CookieConsentManager';

const DEFAULT_LOCALE = 'pt';
const ROUTE_PATH = '/privacy-policy';

function localePath(locale: string) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'FooterNavigation.privacyPolicy' });

  const canonicalUrl = `${BASE_URL}${localePath(locale)}${ROUTE_PATH}`;

  return {
    title: t('1-h1'),
    description: t('1-p'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'pt-BR': `${BASE_URL}${ROUTE_PATH}`,
        en: `${BASE_URL}/en${ROUTE_PATH}`,
        es: `${BASE_URL}/es${ROUTE_PATH}`,
        'x-default': `${BASE_URL}${ROUTE_PATH}`,
      },
    },
  };
}

export default function Page() {
  const t = useTranslations('FooterNavigation.privacyPolicy');

  return (
    <div className='mx-auto max-w-full p-4 leading-relaxed text-black/80 sm:max-w-3xl sm:p-6'>
      <h1 className='mb-4 text-2xl font-bold sm:text-3xl'>{t('1-h1')}</h1>
      <p className='mb-4 text-sm sm:text-base'>{t('1-p')}</p>

      <h2 className='mb-3 text-xl font-semibold sm:text-2xl'>{t('2-h2')}</h2>
      <h3 className='mb-2 text-lg font-medium sm:text-xl'>{t('2-h3-1')}</h3>
      <p className='mb-3 text-sm sm:text-base'>{t('2-p-1')}</p>
      <h3 className='mb-2 text-lg font-medium sm:text-xl'>{t('2-h3-2')}</h3>
      <p className='mb-4 text-sm sm:text-base'>{t('2-p-3')}</p>

      <h2 className='mb-3 text-xl font-semibold sm:text-2xl'>{t('3-h2')}</h2>
      <p className='mb-4 text-sm sm:text-base'>{t('3-p')}</p>

      <h2 className='mb-3 text-xl font-semibold sm:text-2xl'>{t('4-h2')}</h2>

      <h2 className='mb-3 text-xl font-semibold sm:text-2xl'>{t('6-h2')}</h2>
      <p className='mb-4 text-sm sm:text-base'>{t('6-p')}</p>

      <CookieConsentManager />
    </div>
  );
}
