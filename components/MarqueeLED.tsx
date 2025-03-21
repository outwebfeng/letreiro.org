'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import LEDDisplay from './LEDDisplay';
import { TrueLEDDisplay } from './TrueLEDDisplay';

// 显示组件的简单加载状态
function DisplayLoader({ bgColor = '#000000' }) {
  return (
    <div 
      className="w-full h-64 relative min-h-[16rem] rounded-lg flex items-center justify-center"
      style={{ 
        backgroundColor: bgColor,
        contain: 'layout paint size',
        height: '16rem',
        minHeight: '16rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="w-8 h-8 border-4 border-t-[#FF782C] rounded-full animate-spin"></div>
    </div>
  );
}

interface MarqueeLEDProps {
  initialDisplayMode?: 'default' | 'blur' | 'led';
  availableDisplayModes?: ('default' | 'blur' | 'led')[];
  showSpeedControl?: boolean;
  showFullscreenButton?: boolean;
  showGeneratorButton?: boolean;
}

// 使用memo包装组件，避免不必要的重渲染
function MarqueeLEDComponent({
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
  const [displayLoaded, setDisplayLoaded] = useState(false);

  // 确保显示组件加载完成
  useEffect(() => {
    setDisplayLoaded(true);
  }, []);

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

      <div className='grid gap-4 auto-rows-min' style={{ contain: 'layout paint', contentVisibility: 'auto', minHeight: '16rem' }}>
        {/* LED显示组件 - 添加固定高度样式以防止布局偏移 */}
        <div 
          ref={fullscreenRef} 
          className="w-full h-64 relative aspect-[4/1] min-h-[16rem] flex items-center justify-center"
          style={{ 
            contain: 'layout paint size', 
            height: '16rem', 
            minHeight: '16rem',
            display: 'flex',
            position: 'relative'
          }}
        >
          {!displayLoaded ? (
            <DisplayLoader bgColor={config.bgColor} />
          ) : displayMode === 'led' ? (
            <TrueLEDDisplay
              text={config.text}
              textColor={config.textColor}
              bgColor={config.bgColor}
              isFullscreen={isFullscreen}
              fullscreenRef={fullscreenRef}
              isGenerator={false}
              speed={Math.max(1, 15 - config.speed * 1.3)}
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
        <div className='flex flex-col gap-2' style={{ minHeight: '80px', contain: 'paint layout' }}>
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
        <div className='grid grid-cols-3 gap-4' style={{ minHeight: '100px', contain: 'paint layout' }}>
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

// 使用memo优化组件
export default memo(MarqueeLEDComponent);
