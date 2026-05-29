'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import ExportButtons from '@/components/share/ExportButtons';
import ShareButtons from '@/components/share/ShareButtons';
import TemplateQuickPicker from '@/components/templates/TemplateQuickPicker';
import { FONT_OPTIONS, VALID_FONT_IDS, fontIdToCssVar } from '@/lib/fonts';
import type { Template } from '@/lib/templates';

import LEDDisplay from './LEDDisplay';
import { TrueLEDDisplay } from './TrueLEDDisplay';

type DisplayMode = 'default' | 'blur' | 'led';

const DEFAULT_CONFIG = {
  text: 'Welcome to Letreiro Digital',
  textColor: '#FFFFFF',
  bgColor: '#000000',
  speed: 5,
};

const DEFAULT_DISPLAY_MODE: DisplayMode = 'default';

interface MarqueeLEDProps {
  initialDisplayMode?: DisplayMode;
  availableDisplayModes?: DisplayMode[];
  showSpeedControl?: boolean;
  showFullscreenButton?: boolean;
  showGeneratorButton?: boolean;
  showTemplates?: boolean;
  showShareButtons?: boolean;
  showExportButtons?: boolean;
  /** 是否与 URL query params 双向同步(分享链接 / 刷新保留) */
  syncToUrl?: boolean;
}

function MarqueeLEDComponent({
  initialDisplayMode = DEFAULT_DISPLAY_MODE,
  availableDisplayModes = ['default', 'blur', 'led'],
  showSpeedControl = true,
  showFullscreenButton = true,
  showGeneratorButton = true,
  showTemplates = true,
  showShareButtons = true,
  showExportButtons = true,
  syncToUrl = true,
}: MarqueeLEDProps) {
  const t = useTranslations('Home.marquee');

  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplayMode);
  const [fontId, setFontId] = useState<string>('');
  const [hydrated, setHydrated] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const ledCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Hydrate 时从 URL 读初始 config(分享链接可恢复)
  // URLSearchParams.get 已自动解码,不需要手动 decodeURIComponent
  useEffect(() => {
    if (!syncToUrl) {
      setHydrated(true);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const text = params.get('text');
    const textColor = params.get('textColor');
    const bgColor = params.get('bgColor');
    const speed = params.get('speed');
    const mode = params.get('displayMode');
    const font = params.get('font');

    if (text || textColor || bgColor || speed) {
      setConfig({
        text: text || DEFAULT_CONFIG.text,
        textColor: textColor ? `#${textColor}` : DEFAULT_CONFIG.textColor,
        bgColor: bgColor ? `#${bgColor}` : DEFAULT_CONFIG.bgColor,
        speed: speed ? Number(speed) || DEFAULT_CONFIG.speed : DEFAULT_CONFIG.speed,
      });
    }
    // 校验 URL 里的 displayMode 必须在 availableDisplayModes 内,否则像 /letreiro-de-led?displayMode=default
    // 会切到非 LED 模式但页面又没有模式按钮可切回(LEDModeContent 传 availableDisplayModes=[])
    const allowedModes = availableDisplayModes.length
      ? availableDisplayModes
      : [initialDisplayMode];
    if ((mode === 'blur' || mode === 'led' || mode === 'default') && allowedModes.includes(mode)) {
      setDisplayMode(mode);
    }
    if (font && VALID_FONT_IDS.includes(font)) {
      setFontId(font);
    }
    setHydrated(true);
    // hydrate 只跑一次,availableDisplayModes / initialDisplayMode 是组件生命周期内固定的页面级配置,不需要响应变化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncToUrl]);

  // 同步 config / displayMode 到 URL search params(默认值不写入,保持 URL 整洁)
  // URLSearchParams.set 已自动编码,不需要手动 encodeURIComponent
  useEffect(() => {
    if (!syncToUrl || !hydrated) return;
    const params = new URLSearchParams();
    if (config.text !== DEFAULT_CONFIG.text) params.set('text', config.text);
    if (config.textColor !== DEFAULT_CONFIG.textColor) {
      params.set('textColor', config.textColor.replace('#', ''));
    }
    if (config.bgColor !== DEFAULT_CONFIG.bgColor) {
      params.set('bgColor', config.bgColor.replace('#', ''));
    }
    if (config.speed !== DEFAULT_CONFIG.speed) params.set('speed', String(config.speed));
    if (displayMode !== initialDisplayMode) params.set('displayMode', displayMode);
    if (fontId) params.set('font', fontId);

    const search = params.toString();
    const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [config, displayMode, fontId, hydrated, syncToUrl, initialDisplayMode]);

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // fullscreen API 可能因用户拒绝/不支持而 reject,静默忽略
    }
  };

  const updateConfig = (key: keyof typeof config, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const applyTemplate = (tpl: Template) => {
    setConfig({
      text: tpl.text,
      textColor: tpl.textColor,
      bgColor: tpl.bgColor,
      speed: tpl.speed,
    });
    if (availableDisplayModes.includes(tpl.displayMode)) {
      setDisplayMode(tpl.displayMode);
    }
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    setDisplayMode(initialDisplayMode);
    setFontId('');
  };

  const handleOpenGenerator = () => {
    const params = new URLSearchParams({
      text: config.text,
      textColor: config.textColor.replace('#', ''),
      bgColor: config.bgColor.replace('#', ''),
      speed: String(config.speed),
      displayMode,
    });
    if (fontId) params.set('font', fontId);
    window.open(`/generator?${params.toString()}`, '_blank');
  };

  const modeButtonClass = (active: boolean) =>
    `${
      active
        ? 'bg-[#FF782C] text-white shadow-lg scale-105 font-bold'
        : 'bg-white text-[#FF782C] hover:bg-[#FF782C] hover:text-white border-[#FF782C]'
    } transition-all duration-200`;

  return (
    <div
      id='marqueeLED'
      className='mb-8 min-h-[720px] rounded-lg bg-white p-6 shadow-lg sm:min-h-[560px]'
    >
      {showTemplates && (
        <TemplateQuickPicker onApply={applyTemplate} onReset={resetToDefault} />
      )}

      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-[#FF782C]'>{t('title')}</h2>
        <div className='flex gap-2'>
          {availableDisplayModes.includes('default') && (
            <Button
              variant={displayMode === 'default' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('default')}
              className={modeButtonClass(displayMode === 'default')}
            >
              {t('default')}
            </Button>
          )}
          {availableDisplayModes.includes('blur') && (
            <Button
              variant={displayMode === 'blur' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('blur')}
              className={modeButtonClass(displayMode === 'blur')}
            >
              {t('blur')}
            </Button>
          )}
          {availableDisplayModes.includes('led') && (
            <Button
              variant={displayMode === 'led' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('led')}
              className={modeButtonClass(displayMode === 'led')}
            >
              {t('ledMode')}
            </Button>
          )}
          {showFullscreenButton && (
            <Button
              onClick={handleFullscreen}
              variant='outline'
              className={`bg-blue-500 text-white hover:bg-blue-600 border-blue-500 transition-all duration-200 ${
                isFullscreen ? 'shadow-lg scale-105 font-bold' : ''
              }`}
            >
              {t('fullscreen')}
            </Button>
          )}
          {showGeneratorButton && (
            <Button
              onClick={handleOpenGenerator}
              variant='outline'
              className='bg-blue-500 text-white hover:bg-blue-600 border-blue-500 transition-all duration-200'
            >
              {t('generator')}
            </Button>
          )}
        </div>
      </div>

      {(showExportButtons || showShareButtons) && (
        <div className='mb-4 flex flex-col items-end gap-2 sm:flex-row sm:justify-between sm:items-center'>
          {showExportButtons ? (
            <ExportButtons canvasRef={ledCanvasRef} enabled={displayMode === 'led'} />
          ) : (
            <span />
          )}
          {showShareButtons && <ShareButtons />}
        </div>
      )}

      <div className='grid auto-rows-min gap-4' style={{ contain: 'layout paint' }}>
        <div
          ref={fullscreenRef}
          className='w-full h-64 relative aspect-[4/1] min-h-[16rem] flex items-center justify-center'
          style={{
            contain: 'layout paint size',
            height: '16rem',
            minHeight: '16rem',
            display: 'flex',
            position: 'relative',
          }}
        >
          {displayMode === 'led' ? (
            <TrueLEDDisplay
              text={config.text}
              textColor={config.textColor}
              bgColor={config.bgColor}
              speed={Math.max(1, 15 - config.speed * 1.3)}
              isFullscreen={isFullscreen}
              fullscreenRef={fullscreenRef}
              canvasOuterRef={ledCanvasRef}
            />
          ) : (
            <LEDDisplay
              text={config.text}
              textColor={config.textColor}
              bgColor={config.bgColor}
              speed={config.speed}
              isFullscreen={isFullscreen}
              fullscreenRef={fullscreenRef}
              isLEDMode={displayMode === 'blur'}
              fontFamily={fontIdToCssVar(fontId)}
            />
          )}
        </div>

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

        {displayMode !== 'led' && (
          <div className='flex flex-col gap-2' style={{ minHeight: '60px', contain: 'paint layout' }}>
            <label htmlFor='led-font' className='text-sm font-medium text-gray-700'>
              {t('font')}
            </label>
            <select
              id='led-font'
              value={fontId}
              onChange={(e) => setFontId(e.target.value)}
              className='h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id || 'default'} value={f.id}>
                  {f.id === '' ? t('fontDefault') : f.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          className='grid grid-cols-3 gap-4'
          style={{ minHeight: '100px', contain: 'paint layout' }}
        >
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

export default memo(MarqueeLEDComponent);
