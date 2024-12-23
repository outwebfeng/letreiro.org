'use client';

import { useEffect, useState } from 'react';

interface LEDDisplayProps {
  text: string;
  textColor: string;
  bgColor: string;
  speed: number;
  isFullscreen: boolean;
  isLEDMode: boolean;
  fullscreenRef: React.RefObject<HTMLDivElement>;
}

export default function LEDDisplay({
  text,
  textColor,
  bgColor,
  speed,
  isFullscreen,
  isLEDMode,
  fullscreenRef,
}: LEDDisplayProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const getLEDStyles = () => ({
    textShadow: isLEDMode ? `0 0 5px ${textColor}, 0 0 10px ${textColor}, 0 0 20px ${textColor}` : 'none',
    filter: isLEDMode ? 'brightness(1.2) contrast(1.2)' : 'none',
  });

  const containerStyles = {
    backgroundColor: bgColor,
  };

  const textStyles = {
    color: textColor,
    animation: `marquee ${(120 * 1.5) / speed}s linear infinite`,
    fontSize: isFullscreen ? 'calc(80vh * 0.8)' : 'calc(16rem * 0.8)',
    lineHeight: '1',
    paddingLeft: '100%',
    willChange: 'transform',
    ...getLEDStyles(),
  };

  return (
    <div
      ref={fullscreenRef}
      className={`relative overflow-hidden ${
        isFullscreen
          ? 'h-screen md:h-screen max-md:landscape:fixed max-md:landscape:left-0 max-md:landscape:top-0 max-md:landscape:h-[100vw] max-md:landscape:w-[100vh] max-md:landscape:-translate-y-[calc((100vh-100vw)/2)] max-md:landscape:translate-x-[calc((100vh-100vw)/2)] max-md:landscape:rotate-90 max-md:landscape:bg-black'
          : 'h-64'
      } rounded-lg`}
      style={containerStyles}
    >
      <div
        className={`absolute whitespace-nowrap font-bold flex items-center h-full`}
        style={textStyles}
      >
        <span className={`inline-block ${isLEDMode ? 'led-text' : ''}`}>
          {`${displayText}\u2005\u2005\u2005\u2005\u2005${displayText}\u2005\u2005\u2005\u2005\u2005${displayText}`}
        </span>
      </div>
    </div>
  );
}
