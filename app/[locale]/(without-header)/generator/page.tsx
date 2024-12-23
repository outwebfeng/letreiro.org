'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LEDDisplay from '@/components/LEDDisplay';

export default function GeneratorPage() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState({
    text: '',
    textColor: '#FFFFFF',
    bgColor: '#000000',
    speed: 5,
    isLEDMode: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const text = searchParams.get('text');
    const textColor = searchParams.get('textColor');
    const bgColor = searchParams.get('bgColor');
    const speed = searchParams.get('speed');
    const isLEDMode = searchParams.get('isLEDMode');

    if (text) setConfig(prev => ({ ...prev, text: decodeURIComponent(text) }));
    if (textColor) setConfig(prev => ({ ...prev, textColor: `#${textColor}` }));
    if (bgColor) setConfig(prev => ({ ...prev, bgColor: `#${bgColor}` }));
    if (speed) setConfig(prev => ({ ...prev, speed: Number(speed) }));
    if (isLEDMode) setConfig(prev => ({ ...prev, isLEDMode: isLEDMode === 'true' }));
  }, [searchParams, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <div 
        className="h-full w-full"
        style={{ backgroundColor: config.bgColor }}
      >
        <LEDDisplay
          text={config.text}
          textColor={config.textColor}
          bgColor={config.bgColor}
          speed={config.speed}
          isLEDMode={config.isLEDMode}
          isFullscreen={true}
          fullscreenRef={{ current: null }}
        />
      </div>
    </main>
  );
} 