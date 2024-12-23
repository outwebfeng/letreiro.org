'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LEDDisplay from '@/components/LEDDisplay';

export default function GeneratorPage() {
  const searchParams = useSearchParams();
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState({
    text: '',
    textColor: '#FFFFFF',
    bgColor: '#000000',
    speed: 5,
    isLEDMode: false,
  });
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

    const enterFullscreen = async () => {
      try {
        if (document.fullscreenElement) return;
        await fullscreenRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    };

    const timer = setTimeout(enterFullscreen, 1000);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearTimeout(timer);
    };
  }, [searchParams, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        window.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden">
      <div 
        ref={fullscreenRef}
        className="h-full w-full"
        style={{ backgroundColor: config.bgColor }}
      >
        <LEDDisplay
          {...config}
          isFullscreen={true}
          fullscreenRef={fullscreenRef}
        />
      </div>
    </main>
  );
} 