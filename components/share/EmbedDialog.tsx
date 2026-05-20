'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface EmbedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function EmbedDialog({ open, onClose }: EmbedDialogProps) {
  const t = useTranslations('EmbedDialog');
  const [iframeCode, setIframeCode] = useState('');

  // 根据当前 URL search params 生成 iframe 代码
  useEffect(() => {
    if (!open) return;

    const currentParams = new URLSearchParams(window.location.search);
    // 强制 displayMode=led(嵌入场景下 LED 视觉最有代表性)
    if (!currentParams.get('displayMode')) {
      currentParams.set('displayMode', 'led');
    }

    const origin = window.location.origin;
    const generatorUrl = `${origin}/generator?${currentParams.toString()}`;

    const code = `<iframe
  src="${generatorUrl}"
  width="600"
  height="150"
  frameborder="0"
  loading="lazy"
  title="Letreiro de LED Online — letreiro.org"
></iframe>`;

    setIframeCode(code);
  }, [open]);

  // ESC 关闭 + 锁滚动
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      toast.success(t('copied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  if (!open) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='embed-dialog-title'
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl'
      >
        <button
          type='button'
          onClick={onClose}
          aria-label={t('close')}
          className='absolute right-3 top-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        >
          <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        <h2 id='embed-dialog-title' className='mb-2 text-xl font-bold text-[#FF782C]'>
          {t('title')}
        </h2>
        <p className='mb-4 text-sm text-gray-600'>{t('description')}</p>

        <pre className='mb-3 overflow-x-auto rounded-md bg-gray-900 p-3 text-xs leading-relaxed text-gray-100'>
          <code>{iframeCode}</code>
        </pre>

        <div className='flex items-center justify-between gap-2'>
          <p className='text-xs text-gray-500'>{t('poweredBy')}</p>
          <button
            type='button'
            onClick={handleCopy}
            className='inline-flex items-center gap-1.5 rounded-md bg-[#FF782C] px-4 py-2 text-sm font-medium text-white hover:bg-[#E5691E]'
          >
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <rect x='9' y='9' width='13' height='13' rx='2' />
              <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
            </svg>
            {t('copyCode')}
          </button>
        </div>
      </div>
    </div>
  );
}
