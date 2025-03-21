'use client';

import { useEffect, useState, memo, useRef } from 'react';

interface LEDDisplayProps {
  text: string;
  textColor: string;
  bgColor: string;
  speed: number;
  isFullscreen: boolean;
  isLEDMode: boolean;
  fullscreenRef: React.RefObject<HTMLDivElement>;
}

// 使用memo优化组件
const LEDDisplay = memo(function LEDDisplayComponent({
  text,
  textColor,
  bgColor,
  speed,
  isFullscreen,
  isLEDMode,
  fullscreenRef,
}: LEDDisplayProps) {
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef<number | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // 优化文本更新，使用防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText(text);
    }, 100);
    return () => clearTimeout(timer);
  }, [text]);

  // 优化LED样式计算
  const getLEDStyles = () => ({
    textShadow: isLEDMode ? `0 0 5px ${textColor}, 0 0 10px ${textColor}, 0 0 20px ${textColor}` : 'none',
    filter: isLEDMode ? 'brightness(1.2) contrast(1.2)' : 'none',
  });

  const containerStyles = {
    backgroundColor: bgColor,
    willChange: 'contents',
    contain: 'layout paint size',
    minHeight: '16rem',
    height: isFullscreen ? '100%' : '16rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative' as const,
    overflow: 'hidden',
    paddingTop: '0',
    paddingBottom: '0'
  };

  // 计算动画持续时间 - 优化性能
  const animationDuration = `${Math.max(2, 6 * displayText.length / speed * (isFullscreen ? 2.5 : 1))}s`;

  const textStyles = {
    color: textColor,
    // 延迟启动动画，让文本先渲染
    animation: animationStarted 
      ? `marquee ${animationDuration} linear infinite`
      : 'none',
    fontSize: isFullscreen ? 'clamp(5rem, 50vh, 60rem)' : 'clamp(1rem, 16rem, 12.8rem)',
    lineHeight: '1.2',
    paddingLeft: '100%',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    ...getLEDStyles()
  };

  // 优化动画启动
  useEffect(() => {
    if (!animationStarted) {
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [animationStarted]);

  return (
    <div
      ref={fullscreenRef}
      className={`relative overflow-hidden flex items-center justify-start ${
        isFullscreen
          ? 'h-screen w-screen md:h-screen md:w-screen max-md:landscape:fixed max-md:landscape:left-0 max-md:landscape:top-0 max-md:landscape:h-[100vw] max-md:landscape:w-[100vh] max-md:landscape:-translate-y-[calc((100vh-100vw)/2)] max-md:landscape:translate-x-[calc((100vh-100vw)/2)] max-md:landscape:rotate-90 max-md:landscape:bg-black'
          : 'h-64'
      } rounded-lg w-full min-h-[16rem] block`}
      style={containerStyles}
    >
      <div
        className="whitespace-nowrap font-bold flex items-center h-full"
        style={textStyles}
      >
        <span 
          className={`inline-block ${isLEDMode ? 'led-text' : ''}`}
          style={{ padding: '0.25em 0' }}
        >
          {`${displayText}\u2005\u2005\u2005\u2005\u2005${displayText}\u2005\u2005\u2005\u2005\u2005${displayText}`}
        </span>
      </div>
    </div>
  );
});

export default LEDDisplay;
