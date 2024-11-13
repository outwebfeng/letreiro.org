'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeLEDProps {
  t: (key: string) => string;
}

export default function MarqueeLED({ t }: MarqueeLEDProps) {
  const [text, setText] = useState('Welcome to Letreiro Digital');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#000000');
  const [speed, setSpeed] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error with fullscreen:', err);
    }
  };

  return (
    <div className='mb-8 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-[#FF782C]'>{t('marquee.title')}</h2>
        <div className='flex gap-2'>
          <button
            onClick={handleFullscreen}
            className='rounded-lg bg-[#FF782C] px-4 py-2 text-white transition-colors hover:bg-[#FF682C]'
          >
            {t('marquee.fullscreen')}
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex flex-col space-y-2'>
          <label htmlFor='led-text' className='text-sm font-medium text-gray-700'>
            {t('marquee.inputPlaceholder')}
          </label>
          <input
            id='led-text'
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2'
            placeholder={t('marquee.defaultText')}
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='text-color' className='text-sm font-medium text-gray-700'>
            {t('marquee.textColor')}
          </label>
          <input
            id='text-color'
            type='color'
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className='h-10 w-full cursor-pointer rounded-md border border-gray-300'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='bg-color' className='text-sm font-medium text-gray-700'>
            {t('marquee.bgColor')}
          </label>
          <input
            id='bg-color'
            type='color'
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className='h-10 w-full cursor-pointer rounded-md border border-gray-300'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='scroll-speed' className='text-sm font-medium text-gray-700'>
            {t('marquee.speed')} ({speed})
          </label>
          <input
            id='scroll-speed'
            type='range'
            min='1'
            max='10'
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className='w-full cursor-pointer'
          />
        </div>

        <div
          ref={fullscreenRef}
          className={`relative overflow-hidden ${
            isFullscreen
              ? 'h-screen md:h-screen max-md:landscape:fixed max-md:landscape:left-0 max-md:landscape:top-0 max-md:landscape:h-[100vw] max-md:landscape:w-[100vh] max-md:landscape:-translate-y-[calc((100vh-100vw)/2)] max-md:landscape:translate-x-[calc((100vh-100vw)/2)] max-md:landscape:rotate-90 max-md:landscape:bg-black'
              : 'h-64'
          } rounded-lg`}
          style={{ backgroundColor: bgColor }}
        >
          <div
            className='absolute whitespace-nowrap font-bold'
            style={{
              color: textColor,
              animation: `marquee ${(120 * 1.5) / speed}s linear infinite`,
              fontSize: isFullscreen ? 'calc(80vh * 0.8)' : 'calc(16rem * 0.8)',
              lineHeight: '1',
              paddingLeft: '100%',
              willChange: 'transform',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <span className='inline-block'>
              {`${text}\u2005\u2005\u2005\u2005\u2005${text}\u2005\u2005\u2005\u2005\u2005${text}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
