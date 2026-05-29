// 场景页(letreiro-para-loja / letreiro-animado / etc.) 共享的 metadata + JSON-LD helper。
// 每个场景页 page.tsx 调用 generateSceneMetadata + buildSceneJsonLd 即可,无需复制代码。

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { BASE_URL } from '@/lib/env';

const DEFAULT_LOCALE = 'pt';

const OG_LOCALE_MAP: Record<string, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
};

const IN_LANGUAGE: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

function localePath(locale: string) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export interface SceneMetadataArgs {
  locale: string;
  /** 路由 path,如 '/letreiro-para-loja',前导 slash + 不带 locale 前缀 */
  routePath: string;
  /** i18n 命名空间,如 'Metadata.letreiroParaLoja' */
  metadataNamespace: string;
}

export async function generateSceneMetadata({
  locale,
  routePath,
  metadataNamespace,
}: SceneMetadataArgs): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: metadataNamespace });

  const canonicalUrl = `${BASE_URL}${localePath(locale)}${routePath}`;
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
        'pt-BR': `${BASE_URL}${routePath}`,
        en: `${BASE_URL}/en${routePath}`,
        es: `${BASE_URL}/es${routePath}`,
        'x-default': `${BASE_URL}${routePath}`,
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

export async function buildSceneJsonLd({ locale, routePath, metadataNamespace }: SceneMetadataArgs) {
  const t = await getTranslations({ locale, namespace: metadataNamespace });
  const canonicalUrl = `${BASE_URL}${localePath(locale)}${routePath}`;
  const inLanguage = IN_LANGUAGE[locale] ?? 'pt-BR';
  const imageUrl = `${BASE_URL}/images/og-image-${locale}.png`;
  const homeUrl = `${BASE_URL}${localePath(locale)}`;

  const webPage = {
    '@type': 'WebPage',
    name: t('title'),
    description: t('description'),
    url: canonicalUrl,
    inLanguage,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Letreiro.org',
      url: BASE_URL,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Letreiro.org',
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('title'),
          item: canonicalUrl,
        },
      ],
    },
  };

  // CreativeWork:把该场景的 LED 招牌示意为一件免费创意作品。about 轻量引用工具实体
  // (首页声明的 SoftwareApplication),不重复声明 offers 等,避免与首页实体冲突。
  const creativeWork = {
    '@type': 'CreativeWork',
    name: t('title'),
    description: t('description'),
    url: canonicalUrl,
    inLanguage,
    keywords: t('keywords'),
    image: imageUrl,
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'Letreiro.org',
      url: BASE_URL,
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'Letreiro.org',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      url: homeUrl,
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [webPage, creativeWork],
  };
}
