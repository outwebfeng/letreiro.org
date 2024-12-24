'use client';

import { useEffect, useRef, useState } from 'react';
import LEDDisplay from './LEDDisplay';
import { TrueLEDDisplay } from './TrueLEDDisplay';
import { Button } from '@/components/ui/button';

interface MarqueeLEDProps {
  t: (key: string) => string;
}

export default function MarqueeLED({ t }: MarqueeLEDProps) {
  // 配置状态
  const [config, setConfig] = useState({
    text: 'Welcome to Letreiro Digital',
    textColor: '#FFFFFF',
    bgColor: '#000000',
    speed: 5,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'default' | 'blur' | 'led'>('default');
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // 全屏相关逻辑
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  // 更新配置的处理函数
  const updateConfig = (key: keyof typeof config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div id='marqueeLED' className='mb-8 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-[#FF782C]'>{t('marquee.title')}</h2>
        <div className='flex gap-2'>
          <Button
            variant={displayMode === 'default' ? 'default' : 'outline'}
            onClick={() => setDisplayMode('default')}
            className={`${
              displayMode === 'default'
                ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
                : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
            } transition-all duration-200`}
          >
            {t('marquee.default')}
          </Button>
          <Button
            variant={displayMode === 'blur' ? 'default' : 'outline'}
            onClick={() => setDisplayMode('blur')}
            className={`${
              displayMode === 'blur'
                ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
                : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
            } transition-all duration-200`}
          >
            {t('marquee.blur')}
          </Button>
          <Button
            variant={displayMode === 'led' ? 'default' : 'outline'}
            onClick={() => setDisplayMode('led')}
            className={`${
              displayMode === 'led'
                ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
                : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
            } transition-all duration-200`}
          >
            {t('marquee.ledMode')}
          </Button>
          <Button
            onClick={handleFullscreen}
            variant="outline"
            className={`bg-blue-500 text-white hover:bg-blue-600 border-blue-500 transition-all duration-200 ${
              isFullscreen ? 'shadow-lg scale-105 font-bold' : ''
            }`}
          >
            {t('marquee.fullscreen')}
          </Button>
          <Button
            onClick={() => {
              const params = new URLSearchParams({
                text: encodeURIComponent(config.text),
                textColor: config.textColor.replace('#', ''),
                bgColor: config.bgColor.replace('#', ''),
                speed: String(config.speed),
                displayMode: displayMode,
              });
              window.open(`/generator?${params.toString()}`, '_blank');
            }}
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500 transition-all duration-200"
          >
            {t('marquee.generator')}
          </Button>
        </div>
      </div>

      <div className='grid gap-4 auto-rows-min'>
        {/* 文本输入 */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='led-text' className='text-sm font-medium text-gray-700'>
            {t('marquee.inputPlaceholder')}
          </label>
          <input
            id='led-text'
            type='text'
            value={config.text}
            onChange={(e) => updateConfig('text', e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2'
            placeholder={t('marquee.defaultText')}
          />
        </div>

        {/* 颜色选择器 */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='text-color' className='text-sm font-medium text-gray-700'>
              {t('marquee.textColor')}
            </label>
            <input
              id='text-color'
              type='color'
              value={config.textColor}
              onChange={(e) => updateConfig('textColor', e.target.value)}
              className='h-10 w-full cursor-pointer rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='bg-color' className='text-sm font-medium text-gray-700'>
              {t('marquee.bgColor')}
            </label>
            <input
              id='bg-color'
              type='color'
              value={config.bgColor}
              onChange={(e) => updateConfig('bgColor', e.target.value)}
              className='h-10 w-full cursor-pointer rounded-md border border-gray-300'
            />
          </div>
        </div>

        {/* 速度控制 */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='scroll-speed' className='text-sm font-medium text-gray-700'>
            {t('marquee.speed')} ({config.speed})
          </label>
          <input
            id='scroll-speed'
            type='range'
            min='1'
            max='10'
            value={config.speed}
            onChange={(e) => updateConfig('speed', Number(e.target.value))}
            className='w-full cursor-pointer'
          />
        </div>

        {/* LED显示组件 */}
        <div ref={fullscreenRef} className="w-full h-64 relative">
          {displayMode === 'led' ? (
            <TrueLEDDisplay
              text={config.text}
              textColor={config.textColor}
              bgColor={config.bgColor}
              speed={Math.max(2, 20 - config.speed * 1.8)}
              isFullscreen={isFullscreen}
              fullscreenRef={fullscreenRef}
            />
          ) : (
            <LEDDisplay
              {...config}
              isFullscreen={isFullscreen}
              fullscreenRef={fullscreenRef}
              isLEDMode={displayMode === 'blur'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
