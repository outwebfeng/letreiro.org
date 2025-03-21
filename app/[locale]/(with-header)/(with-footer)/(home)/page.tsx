'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import LEDDisplay from '@/components/LEDDisplay';
import { TrueLEDDisplay } from '@/components/TrueLEDDisplay';

// 静态导入ScrollToTop组件
const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

// 简化导入方式 - 直接导入
import MarqueeLED from '@/components/MarqueeLED';

// 为MarqueeLED组件创建骨架屏
function MarqueeLEDSkeleton() {
  return (
    <div className='mb-8 rounded-lg bg-white p-6 shadow-lg animate-pulse'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='h-6 w-40 bg-gray-200 rounded'></div>
        <div className='flex gap-2'>
          <div className='h-8 w-20 bg-gray-200 rounded'></div>
          <div className='h-8 w-20 bg-gray-200 rounded'></div>
          <div className='h-8 w-24 bg-gray-200 rounded'></div>
        </div>
      </div>
      <div className='grid gap-4 auto-rows-min'>
        <div className="w-full h-64 relative aspect-[4/1] min-h-[16rem] bg-gray-300 rounded"></div>
        <div className='flex flex-col gap-2'>
          <div className='h-4 w-40 bg-gray-200 rounded'></div>
          <div className='h-10 w-full bg-gray-200 rounded'></div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='h-4 w-24 bg-gray-200 rounded'></div>
            <div className='h-10 w-full bg-gray-200 rounded'></div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='h-4 w-24 bg-gray-200 rounded'></div>
            <div className='h-10 w-full bg-gray-200 rounded'></div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='h-4 w-24 bg-gray-200 rounded'></div>
            <div className='h-10 w-full bg-gray-200 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const t = useTranslations('Home');
  const tMarquee = useTranslations('Home.marquee');

  // MarqueeLED组件的状态
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
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8'>
        <div className='mb-4 flex flex-col items-center text-center sm:mb-6 lg:mx-auto'>
          <h1 className='mb-2 text-2xl font-extrabold text-[#FF782C] sm:mb-3 sm:text-3xl md:text-4xl lg:text-6xl animate-hardware'>
            {t('title')}
          </h1>
          <div className='max-w-6xl text-xs font-medium text-black/70 sm:text-sm md:text-base'>
            {t('subTitle')}
          </div>
        </div>
        
        <div className='-mt-2 sm:-mt-4'>
          {/* 直接在页面中实现MarqueeLED功能 */}
          <div id='marqueeLED' className='mb-8 rounded-lg bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-[#FF782C]'>{tMarquee('title')}</h2>
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
                  {tMarquee('default')}
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
                  {tMarquee('blur')}
                </Button>
            
                <Button
                  onClick={handleFullscreen}
                  variant="outline"
                  className={`bg-blue-500 text-white hover:bg-blue-600 border-blue-500 transition-all duration-200 ${
                    isFullscreen ? 'shadow-lg scale-105 font-bold' : ''
                  }`}
                >
                  {tMarquee('fullscreen')}
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
                  {tMarquee('generator')}
                </Button>
              </div>
            </div>

            <div className='grid gap-4 auto-rows-min' style={{ contain: 'layout paint', contentVisibility: 'auto' }}>
              {/* LED显示组件 */}
              <div 
                ref={fullscreenRef} 
                className="w-full h-64 relative aspect-[4/1] min-h-[16rem]"
                style={{ contain: 'layout paint size', height: '16rem', contentVisibility: 'auto' }}
              >
                {displayMode === 'led' ? (
                  <TrueLEDDisplay
                    text={config.text}
                    textColor={config.textColor}
                    bgColor={config.bgColor}
                    speed={Math.max(1, 15 - config.speed * 1.3)}
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
              <div className='flex flex-col gap-2' style={{ minHeight: '80px', contain: 'paint layout' }}>
                <label htmlFor='led-text' className='text-sm font-medium text-gray-700'>
                  {tMarquee('inputPlaceholder')}
                </label>
                <input
                  id='led-text'
                  type='text'
                  value={config.text}
                  onChange={(e) => updateConfig('text', e.target.value)}
                  className='rounded-md border border-gray-300 px-3 py-2'
                  placeholder={tMarquee('defaultText')}
                />
              </div>

              {/* 颜色选择器和速度控制 */}
              <div className='grid grid-cols-3 gap-4' style={{ minHeight: '100px', contain: 'paint layout' }}>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='text-color' className='text-sm font-medium text-gray-700'>
                    {tMarquee('textColor')}
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
                    {tMarquee('bgColor')}
                  </label>
                  <input
                    id='bg-color'
                    type='color'
                    value={config.bgColor}
                    onChange={(e) => updateConfig('bgColor', e.target.value)}
                    className='h-10 w-full cursor-pointer rounded-md border border-gray-300'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label htmlFor='scroll-speed' className='text-sm font-medium text-gray-700'>
                    {tMarquee('speed')} ({config.speed})
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
              </div>
            </div>
          </div>
        </div>

        <div className='mb-8 space-y-6 sm:mb-12 sm:space-y-8'>
          {/* Features Section */}
          <section className='rounded-lg bg-white p-6 shadow-lg'>
            <h2 id='features' className='mb-6 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
               style={{ contain: 'layout paint', minHeight: '2.5rem' }}>
              {t('Features.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('Features.items').map((item: { title: string; description: string }) => (
                <div
                  key={`feature-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Welcome Section */}
            <h2 id='welcome' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('Welcome.title')}
            </h2>
            <div className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'>
              <p className='leading-relaxed text-black/80'>{t('Welcome.description')}</p>
            </div>

            {/* What Is Section */}
            <h2 id='what-is' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('WhatIs.title')}
            </h2>
            <div className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'>
              <p className='leading-relaxed text-black/80'>{t('WhatIs.description')}</p>
            </div>

            {/* How to Use Section */}
            <h2
              id='how-to-use'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t('HowToUse.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('HowToUse.steps').map((item: { step: string; description: string }) => (
                <div
                  key={`step-${item.step.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.step}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Why Choose Section */}
            <h2
              id='why-choose'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t('WhyChoose.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('WhyChoose.items').map((item: { title: string; description: string }) => (
                <div
                  key={`why-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Design Tips Section */}
            <h2
              id='design-tips'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t('DesignTips.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('DesignTips.tips').map((item: { tip: string; description: string }) => (
                <div
                  key={`tip-${item.tip.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.tip}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <h2 id='faq' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('Faq.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('Faq.questions').map((faqItem: { question: string; answer: string }) => (
                <details
                  key={`faq-${faqItem.question.toLowerCase().replace(/\s+/g, '-')}`}
                  className='group rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <summary className='flex cursor-pointer list-none items-center justify-between font-medium'>
                    <h3 className='text-xl font-semibold text-[#FF782C]'>{faqItem.question}</h3>
                  </summary>
                  <div className='mt-3'>
                    <p className='group-open:animate-fadeIn leading-relaxed text-black/80'>{faqItem.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
        <ScrollToTop />
      </div>
    </div>
  );
}
