import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import LEDModeContent from './LEDModeContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata.letreiroonlineled' });

  const canonicalUrl = locale === 'en' 
    ? 'https://letreiro.org/letreiroonlineled'
    : `https://letreiro.org/${locale}/letreiroonlineled`;

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function LEDModePage() {
  return <LEDModeContent />;
} 