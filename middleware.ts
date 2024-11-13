import createMiddleware from 'next-intl/middleware';

import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'br',
  localePrefix: 'always',
});

export const config = {
  matcher: [
    // 跳过所有内部路径(_next)
    '/((?!api|_next|.*\\..*).*)',
    // 可选: 仅在根路径时运行
    '/',
  ],
  runtime: 'nodejs',
};
