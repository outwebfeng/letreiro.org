import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// pt-BR, en-US, es-ES
export const languages = [
  {
    code: 'pt-BR',
    lang: 'pt',
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
];

export const locales = ['pt', 'en', 'es'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
