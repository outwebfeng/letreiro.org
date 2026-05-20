'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/app/navigation';
import { useCookieConsent } from './CookieConsentProvider';

export default function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const { consent, setConsent } = useCookieConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || consent !== null) return null;

  return (
    <div
      role='dialog'
      aria-live='polite'
      aria-label={t('aria')}
      className='fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl'
    >
      <div className='mx-auto flex max-w-5xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5'>
        <p className='flex-1 text-sm leading-relaxed text-gray-700'>
          {t('message')}{' '}
          <Link href='/privacy-policy' className='font-medium text-[#FF782C] underline hover:text-[#E5691E]'>
            {t('learnMore')}
          </Link>
        </p>
        <div className='flex shrink-0 gap-2'>
          <button
            type='button'
            onClick={() => setConsent('rejected')}
            className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100'
          >
            {t('reject')}
          </button>
          <button
            type='button'
            onClick={() => setConsent('accepted')}
            className='rounded-md bg-[#FF782C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E5691E]'
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
