'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { dotMatrixFont } from '@/lib/dotMatrixFont';

interface TrueLEDDisplayProps {
  text: string;
  speed?: number; // 每秒移动的像素点数，默认为30
  textColor?: string;
  bgColor?: string;
  isFullscreen?: boolean;
  fullscreenRef?: React.RefObject<HTMLDivElement>;
  isGenerator?: boolean;  // 添加 generator 模式标识
}

// 使用memo包装组件
export const TrueLEDDisplay = memo(function TrueLEDDisplayComponent({
  text,
  speed = 30, // 默认每秒移动30个像素点
  textColor = '#00ff00',
  bgColor = '#000000',
  isFullscreen = false,
  fullscreenRef,
  isGenerator = false,  // 添加 generator 模式标识
}: TrueLEDDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [matrixData, setMatrixData] = useState<number[][]>([]);
  const lastTimeRef = useRef<number>(0);
  const actualPositionRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // 将文本转换为点阵数据 - 使用useCallback避免不必要的重计算
  const createMatrixData = (textInput: string) => {
    // 限制文本长度以避免过大的计算量
    const limitedText = textInput.slice(0, 100);
    const upperText = limitedText.toUpperCase();
    let matrix: number[][] = [];
    
    // 初始化矩阵行（20行：2行空白 + 16行字符 + 2行空白）
    for (let i = 0; i < 20; i++) {
      matrix[i] = [];
    }

    // 为每个字符添加点阵数据
    for (let char of upperText) {
      const charMatrix = dotMatrixFont[char] || dotMatrixFont[' '];
      const isSpace = char === ' ';
      const width = isSpace ? 8 : 16; // 如果是空格，使用8个点的宽度
      
      // 添加顶部空白（2行）
      matrix[0].push(...Array(width).fill(0), 0);
      matrix[1].push(...Array(width).fill(0), 0);
      
      // 添加字符数据（16行，从第3行开始）
      for (let i = 0; i < 16; i++) {
        if (isSpace) {
          // 如果是空格，添加8个空白点
          matrix[i + 2].push(...Array(width).fill(0), 0);
        } else {
          // 如果是其他字符，添加16x16的点阵数据
          matrix[i + 2].push(...charMatrix[i], 0);
        }
      }
      
      // 添加底部空白（2行）
      matrix[18].push(...Array(width).fill(0), 0);
      matrix[19].push(...Array(width).fill(0), 0);
    }

    return matrix;
  };

  // 初始化点阵数据
  useEffect(() => {
    // 使用requestIdleCallback延迟非关键操作
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setMatrixData(createMatrixData(text));
      });
    } else {
      // 降级方案
      setTimeout(() => {
        setMatrixData(createMatrixData(text));
      }, 0);
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text]);

  // 渲染点阵，使用高性能方法
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || matrixData.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 使用requestAnimationFrame优化渲染
    const renderFrame = () => {
      const dotSize = Math.floor(canvas.height / 20); // 20行：2上+16中+2下
      const width = canvas.width;
      const height = canvas.height;
      const displayColumns = Math.floor(width / dotSize); // 显示窗口的列数

      // 清除画布 - 使用更高效的方法
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 绘制LED点阵 - 批量绘制以提高性能
      ctx.fillStyle = textColor;
      ctx.beginPath();
      
      for (let y = 0; y < matrixData.length; y++) {
        for (let x = 0; x < displayColumns; x++) {
          // 计算实际显示位置
          const totalColumns = matrixData[0].length;
          const startPos = scrollPosition % totalColumns;
          const dataX = (startPos + x) % totalColumns;
          
          if (matrixData[y][dataX]) {
            ctx.moveTo(x * dotSize + dotSize / 2, y * dotSize + dotSize / 2);
            ctx.arc(
              x * dotSize + dotSize / 2,
              y * dotSize + dotSize / 2,
              dotSize / 2 - 1,
              0,
              Math.PI * 2
            );
          }
        }
      }
      
      ctx.fill();
    };

    renderFrame();
  }, [matrixData, scrollPosition, textColor, bgColor]);

  // 滚动动画 - 优化动画性能
  useEffect(() => {
    if (matrixData.length === 0) return;

    // 重置位置和时间，确保速度变化时动画能够立即响应
    lastTimeRef.current = 0;
    actualPositionRef.current = 0;
    setScrollPosition(0);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
        actualPositionRef.current = 0;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      // 限制帧率，防止过多渲染
      if (deltaTime > 16) { // 约60fps
        // 根据全屏状态调整速度
        const speedMultiplier = isFullscreen ? 0.45 : 0.6;
        const actualSpeed = speed * speedMultiplier;
        const pixelsToMove = (actualSpeed * deltaTime) / 1000;

        actualPositionRef.current += pixelsToMove;
        setScrollPosition(Math.floor(actualPositionRef.current));
        lastTimeRef.current = currentTime;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = 0;
      actualPositionRef.current = 0;
    };
  }, [matrixData, speed, isFullscreen]); // 添加isFullscreen作为依赖

  return (
    <div 
      ref={fullscreenRef} 
      className={`w-full ${isGenerator ? 'h-full' : isFullscreen ? 'h-screen' : 'h-64'} min-h-[16rem] flex items-center justify-center`}
      style={{ contain: 'layout paint size', padding: '0.5rem 0' }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={256}
        className="w-full h-full bg-black flex-1"
        style={{ 
          aspectRatio: '4/1',
          imageRendering: 'pixelated', // 提高渲染性能
          maxHeight: isFullscreen ? '90vh' : '100%',
          margin: 'auto',
          width: isFullscreen ? '90%' : '100%',
          padding: '0.25rem'
        }}
      />
    </div>
  );
}); 