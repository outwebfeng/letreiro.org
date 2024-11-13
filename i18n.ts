import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// pt-BR,en-US,es-ES,zh-TW
export const languages = [
  {
    code: 'pt-BR',
    lang: 'br',
    label: 'Português',
  },
  {
    code: 'en-US',
    lang: 'en',
    label: 'English',
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

export const locales = ['br', 'en', 'es', 'tw'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
