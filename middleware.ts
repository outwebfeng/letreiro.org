import createMiddleware from 'next-intl/middleware';

import { locales } from './i18n';

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
  runtime: 'experimental-edge',
};

const middleware = createMiddleware({
  locales,
  defaultLocale: 'br',
  localePrefix: 'always',
});

export default middleware;
