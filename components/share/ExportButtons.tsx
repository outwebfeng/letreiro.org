'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { exportAsGif, exportAsVideo, downloadBlob } from '@/lib/canvas-export';

interface ExportButtonsProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  enabled: boolean; // false 表示当前不是 LED 模式
}

type Format = 'gif' | 'video';

export default function ExportButtons({ canvasRef, enabled }: ExportButtonsProps) {
  const t = useTranslations('ExportButtons');
  const [busy, setBusy] = useState<Format | null>(null);
  const [progress, setProgress] = useState(0);

  const handleExport = async (format: Format) => {
    if (busy) return;
    if (!enabled) {
      toast.warning(t('onlyLedMode'));
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error(t('canvasUnavailable'));
      return;
    }

    setBusy(format);
    setProgress(0);

    try {
      const onProgress = (p: number) => setProgress(p);
      const blob =
        format === 'gif'
          ? await exportAsGif(canvas, { onProgress })
          : await exportAsVideo(canvas, { onProgress });

      const ext = format === 'gif' ? 'gif' : 'webm';
      const filename = `letreiro-${Date.now()}.${ext}`;
      downloadBlob(blob, filename);
      toast.success(t('done'));
    } catch (err) {
      console.error('export failed:', err);
      toast.error(t('failed'));
    } finally {
      setBusy(null);
      setProgress(0);
    }
  };

  const isGifBusy = busy === 'gif';
  const isVideoBusy = busy === 'video';

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-sm font-medium text-gray-700'>{t('export')}:</span>

      <button
        type='button'
        onClick={() => handleExport('gif')}
        disabled={!enabled || busy !== null}
        className='inline-flex items-center gap-1.5 rounded-md border border-[#FF782C] bg-white px-3 py-2 text-sm font-medium text-[#FF782C] transition-colors hover:bg-[#FF782C] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#FF782C]'
        aria-label={t('exportGif')}
      >
        {isGifBusy ? `GIF... ${Math.round(progress * 100)}%` : 'GIF'}
      </button>

      <button
        type='button'
        onClick={() => handleExport('video')}
        disabled={!enabled || busy !== null}
        className='inline-flex items-center gap-1.5 rounded-md bg-[#FF782C] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E5691E] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#FF782C]'
        aria-label={t('exportVideo')}
      >
        {isVideoBusy ? `${t('video')}... ${Math.round(progress * 100)}%` : t('video')}
      </button>

      {!enabled && <span className='text-xs italic text-gray-500'>{t('switchToLed')}</span>}
    </div>
  );
}
