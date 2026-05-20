'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useCookieConsent } from './CookieConsentProvider';

export default function CookieConsentManager() {
  const t = useTranslations('CookieBanner');
  const { consent, resetConsent } = useCookieConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const statusLabel =
    consent === 'accepted' ? t('statusAccepted') : consent === 'rejected' ? t('statusRejected') : t('statusNone');

  return (
    <section className='my-8 rounded-md border border-gray-200 bg-gray-50 p-4 sm:p-6'>
      <h2 className='mb-3 text-xl font-semibold text-[#FF782C] sm:text-2xl'>{t('manageTitle')}</h2>
      <p className='mb-4 text-sm text-gray-700 sm:text-base'>
        <span className='font-medium'>{t('currentStatus')}:</span> {statusLabel}
      </p>
      <button
        type='button'
        onClick={resetConsent}
        className='rounded-md border border-[#FF782C] px-4 py-2 text-sm font-medium text-[#FF782C] transition-colors hover:bg-[#FF782C] hover:text-white'
      >
        {t('revoke')}
      </button>
    </section>
  );
}
