'use client';

import { useEffect, useRef, useState } from 'react';
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

export const TrueLEDDisplay = ({
  text,
  speed = 30, // 默认每秒移动30个像素点
  textColor = '#00ff00',
  bgColor = '#000000',
  isFullscreen = false,
  fullscreenRef,
  isGenerator = false,  // 添加 generator 模式标识
}: TrueLEDDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [matrixData, setMatrixData] = useState<number[][]>([]);
  const lastTimeRef = useRef<number>(0);
  const actualPositionRef = useRef<number>(0);

  // 将文本转换为点阵数据
  const createMatrixData = (text: string) => {
    const upperText = text.toUpperCase();
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
          // 如果是其他字���，添加16x16的点阵数据
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
    setMatrixData(createMatrixData(text));
  }, [text]);

  // 渲染点阵
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || matrixData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dotSize = Math.floor(canvas.height / 20); // 20行：2上+16中+2下
    const width = canvas.width;
    const height = canvas.height;
    const displayColumns = Math.floor(width / dotSize); // 显示窗口的列数

    // 清除画布
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 绘制LED点阵
    ctx.fillStyle = textColor;
    for (let y = 0; y < matrixData.length; y++) {
      for (let x = 0; x < displayColumns; x++) {
        // 计算实际显示位置
        const totalColumns = matrixData[0].length;
        const startPos = scrollPosition % totalColumns;
        const dataX = (startPos + x) % totalColumns;
        
        if (matrixData[y][dataX]) {
          ctx.beginPath();
          ctx.arc(
            x * dotSize + dotSize / 2,
            y * dotSize + dotSize / 2,
            dotSize / 2 - 1,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }, [matrixData, scrollPosition, textColor, bgColor]);

  // 滚动动画
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
      const pixelsToMove = (speed * deltaTime) / 1000;

      actualPositionRef.current += pixelsToMove;
      setScrollPosition(Math.floor(actualPositionRef.current));
      lastTimeRef.current = currentTime;

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      lastTimeRef.current = 0;
      actualPositionRef.current = 0;
    };
  }, [matrixData, speed]); // 确保 speed 变化时重新启动动画

  return (
    <div 
      ref={fullscreenRef} 
      className={`w-full ${isGenerator ? 'h-full' : isFullscreen ? 'h-screen' : 'h-64'}`}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={256}
        className="w-full h-full bg-black"
      />
    </div>
  );
}; 