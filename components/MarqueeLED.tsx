'use client';

import { useEffect, useRef, useState } from 'react';
import LEDDisplay from './LEDDisplay';

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
    isLEDMode: false,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const handleOpenGenerator = () => {
    const params = new URLSearchParams();
    
    // 先添加其他参数
    params.append('textColor', config.textColor.replace('#', ''));
    params.append('bgColor', config.bgColor.replace('#', ''));
    params.append('speed', config.speed.toString());
    params.append('isLEDMode', config.isLEDMode.toString());
    
    // 最后添加 text 参数
    params.append('text', encodeURIComponent(config.text));
    
    // 修改为新的路径
    window.open(`/generator?${params.toString()}`, '_blank');
  };

  return (
    <div id='marqueeLED' className='mb-8 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-[#FF782C]'>{t('marquee.title')}</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => updateConfig('isLEDMode', !config.isLEDMode)}
            className='rounded-lg bg-[#FF782C] px-4 py-2 text-white transition-colors hover:bg-[#FF682C]'
          >
            {config.isLEDMode ? t('marquee.normalMode') : t('marquee.ledMode')}
          </button>
          <button
            onClick={handleFullscreen}
            className='rounded-lg bg-[#FF782C] px-4 py-2 text-white transition-colors hover:bg-[#FF682C]'
          >
            {t('marquee.fullscreen')}
          </button>
          <button
            onClick={handleOpenGenerator}
            className='rounded-lg bg-[#FF782C] px-4 py-2 text-white transition-colors hover:bg-[#FF682C]'
          >
            {t('marquee.generator')}
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        {/* 文本输入 */}
        <div className='flex flex-col space-y-2'>
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
        <div className='flex flex-col space-y-2'>
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

        <div className='flex flex-col space-y-2'>
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

        {/* 速度控制 */}
        <div className='flex flex-col space-y-2'>
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
        <LEDDisplay
          {...config}
          isFullscreen={isFullscreen}
          fullscreenRef={fullscreenRef}
        />
      </div>
    </div>
  );
}
