import createMiddleware from 'next-intl/middleware';

import { locales } from '../i18n';

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/'],
  runtime: 'experimental-edge',
};

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'br',
  localePrefix: 'always',
  localeDetection: false,
  domains: undefined,
  pathnames: undefined,
});

export default intlMiddleware;
