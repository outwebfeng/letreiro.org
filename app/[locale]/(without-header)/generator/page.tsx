'use client';

import { useSearchParams } from 'next/navigation';
import LEDDisplay from '@/components/LEDDisplay';
import { TrueLEDDisplay } from '@/components/TrueLEDDisplay';

export default function GeneratorPage() {
  const searchParams = useSearchParams();

  const text = searchParams.get('text') || 'HELLO WORLD';
  const textColor = '#' + (searchParams.get('textColor') || 'ff0000');
  const bgColor = '#' + (searchParams.get('bgColor') || '000000');
  const speed = Number(searchParams.get('speed')) || 5;
  const displayMode = searchParams.get('displayMode') || 'default';

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-full h-full">
        {displayMode === 'led' ? (
          <TrueLEDDisplay
            text={decodeURIComponent(text)}
            textColor={textColor}
            bgColor={bgColor}
            speed={Math.max(2, 20 - speed * 1.8)}
            isGenerator={true}
          />
        ) : (
          <LEDDisplay
            text={decodeURIComponent(text)}
            textColor={textColor}
            bgColor={bgColor}
            speed={speed}
            isFullscreen={true}
            isLEDMode={displayMode === 'blur'}
            fullscreenRef={{ current: null }}
          />
        )}
      </div>
    </div>
  );
} 