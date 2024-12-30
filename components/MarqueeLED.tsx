'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import LEDDisplay from './LEDDisplay';
import { TrueLEDDisplay } from './TrueLEDDisplay';
import { Button } from '@/components/ui/button';

interface MarqueeLEDProps {
  initialDisplayMode?: 'default' | 'blur' | 'led';
  availableDisplayModes?: ('default' | 'blur' | 'led')[];
  showSpeedControl?: boolean;
  showFullscreenButton?: boolean;
  showGeneratorButton?: boolean;
}

export default function MarqueeLED({
  initialDisplayMode = 'default',
  availableDisplayModes = ['default', 'blur', 'led'],
  showSpeedControl = true,
  showFullscreenButton = true,
  showGeneratorButton = true,
}: MarqueeLEDProps) {
  const t = useTranslations('Home.marquee');
  
  // 配置状态
  const [config, setConfig] = useState({
    text: 'Welcome to Letreiro Digital',
    textColor: '#FFFFFF',
    bgColor: '#000000',
    speed: 5,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'default' | 'blur' | 'led'>(initialDisplayMode);
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
        <h2 className='text-xl font-semibold text-[#FF782C]'>{t('title')}</h2>
        <div className='flex gap-2'>
          {availableDisplayModes.includes('default') && (
            <Button
              variant={displayMode === 'default' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('default')}
              className={`${
                displayMode === 'default'
                  ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
                  : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
              } transition-all duration-200`}
            >
              {t('default')}
            </Button>
          )}
          {availableDisplayModes.includes('blur') && (
            <Button
              variant={displayMode === 'blur' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('blur')}
              className={`${
                displayMode === 'blur'
                  ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
                  : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
              } transition-all duration-200`}
            >
              {t('blur')}
            </Button>
          )}
          {availableDisplayModes.includes('led') && (
            <Button
              variant={displayMode === 'led' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('led')}
              className={`${
                displayMode === 'led'
                  ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
                  : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
              } transition-all duration-200`}
            >
              {t('ledMode')}
            </Button>
          )}
          {showFullscreenButton && (
            <Button
              onClick={handleFullscreen}
              variant="outline"
              className={`bg-blue-500 text-white hover:bg-blue-600 border-blue-500 transition-all duration-200 ${
                isFullscreen ? 'shadow-lg scale-105 font-bold' : ''
              }`}
            >
              {t('fullscreen')}
            </Button>
          )}
          {showGeneratorButton && (
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
              {t('generator')}
            </Button>
          )}
        </div>
      </div>

      <div className='grid gap-4 auto-rows-min'>
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

        {/* 文本输入 */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='led-text' className='text-sm font-medium text-gray-700'>
            {t('inputPlaceholder')}
          </label>
          <input
            id='led-text'
            type='text'
            value={config.text}
            onChange={(e) => updateConfig('text', e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2'
            placeholder={t('defaultText')}
          />
        </div>

        {/* 颜色选择器和速度控制 */}
        <div className='grid grid-cols-3 gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='text-color' className='text-sm font-medium text-gray-700'>
              {t('textColor')}
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
              {t('bgColor')}
            </label>
            <input
              id='bg-color'
              type='color'
              value={config.bgColor}
              onChange={(e) => updateConfig('bgColor', e.target.value)}
              className='h-10 w-full cursor-pointer rounded-md border border-gray-300'
            />
          </div>

          {/* 速度控制 */}
          {showSpeedControl && (
            <div className='flex flex-col gap-2'>
              <label htmlFor='scroll-speed' className='text-sm font-medium text-gray-700'>
                {t('speed')} ({config.speed})
              </label>
              <input
                id='scroll-speed'
                type='range'
                min='1'
                max='10'
                value={config.speed}
                onChange={(e) => updateConfig('speed', Number(e.target.value))}
                className='h-10 w-full cursor-pointer rounded-md border border-gray-300 px-3 bg-white'
                style={{ padding: '12px 12px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
