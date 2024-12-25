import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import GetStartedContent from './GetStartedContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata.getstarted' });

  const canonicalUrl = locale === 'en' 
    ? 'https://letreiro.org/getstarted'
    : `https://letreiro.org/${locale}/getstarted`;

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function GetStartedPage() {
  return <GetStartedContent />;
} 