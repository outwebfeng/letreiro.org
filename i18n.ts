import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// en-US, fr-HT, pt-BR, mx-MX, es-ES, zh-TW, bg-BG
export const languages = [
  {
    code: 'en-US',
    lang: 'en',
    label: 'English',
  },
  {
    code: 'bg-BG',
    lang: 'bg',
    label: 'Български',
  },
  {
    code: 'mx-MX',
    lang: 'mx',
    label: 'Español',
  },
  {
    code: 'fr-HT',
    lang: 'fr',
    label: 'Français',
  },
  {
    code: 'pt-BR',
    lang: 'br',
    label: 'Português',
  },
  {
    code: 'es-ES',
    lang: 'es',
    label: 'Español',
  },
  {
    code: 'zh-TW',
    lang: 'tw',
    label: '繁體中文',
  },
];

export const locales = ['en', 'bg', 'mx', 'fr', 'br', 'es', 'tw'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
