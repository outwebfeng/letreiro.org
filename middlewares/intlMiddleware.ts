import createMiddleware from 'next-intl/middleware';

import { locales } from '../i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'br',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export default intlMiddleware;
