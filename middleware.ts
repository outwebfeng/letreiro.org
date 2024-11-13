import createMiddleware from 'next-intl/middleware';

import { locales } from './i18n';

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

const middleware = createMiddleware({
  locales,
  defaultLocale: 'br',
  localePrefix: 'always',
});

export default middleware;
