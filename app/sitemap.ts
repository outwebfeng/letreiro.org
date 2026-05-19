import { type MetadataRoute } from 'next';
import { locales } from '@/i18n';

import { BASE_URL } from '@/lib/env';

const DEFAULT_LOCALE = 'pt';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapRoutes: MetadataRoute.Sitemap = [
    {
      url: '', // home
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: '/letreiro-de-led',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const sitemapData = sitemapRoutes.flatMap((route) =>
    locales.map((locale) => {
      const lang = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
      return {
        ...route,
        url: `${BASE_URL}${lang}${route.url}`,
      };
    }),
  );

  return sitemapData;
}
