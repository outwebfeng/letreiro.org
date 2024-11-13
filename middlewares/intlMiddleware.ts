import createMiddleware from 'next-intl/middleware';

import { locales } from '../i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'br',
  localePrefix: 'as-needed',
  localeDetection: false,
  domains: undefined,
  pathnames: undefined,
});

export default intlMiddleware;

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
