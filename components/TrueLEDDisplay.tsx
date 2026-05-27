'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { dotMatrixFont } from '@/lib/dotMatrixFont';

interface TrueLEDDisplayProps {
  text: string;
  /** 每秒移动的像素点数,默认 30 */
  speed?: number;
  textColor?: string;
  bgColor?: string;
  isFullscreen?: boolean;
  fullscreenRef?: React.RefObject<HTMLDivElement>;
  isGenerator?: boolean;
  /** 外部 ref,用于 GIF/Video 导出拿到 canvas DOM */
  canvasOuterRef?: React.MutableRefObject<HTMLCanvasElement | null>;
}

export const TrueLEDDisplay = memo(function TrueLEDDisplayComponent({
  text,
  speed = 30,
  textColor = '#00ff00',
  bgColor = '#000000',
  isFullscreen = false,
  fullscreenRef,
  isGenerator = false,
  canvasOuterRef,
}: TrueLEDDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matrixData, setMatrixData] = useState<number[][]>([]);

  // 把 canvas DOM 同步到外部 ref(用于 GIF/Video 导出)
  useEffect(() => {
    if (canvasOuterRef) {
      canvasOuterRef.current = canvasRef.current;
    }
  }, [canvasOuterRef]);

  // 按 devicePixelRatio 调整 canvas buffer,避免 Retina/高 DPR 屏被 CSS 拉伸糊掉。
  // renderFrame 基于 canvas.width / .height 计算 dotSize,buffer 变大点也跟着变大,自动清晰。
  // 导出 GIF/Video 会下采样到固定尺寸(canvas-export.ts),不会跟随 DPR 放大。
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const newW = Math.floor(rect.width * dpr);
      const newH = Math.floor(rect.height * dpr);
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW;
        canvas.height = newH;
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [isFullscreen]);

  // 文本 → 点阵矩阵
  useEffect(() => {
    const buildMatrix = () => {
      const limitedText = text.slice(0, 100);
      const upperText = limitedText.toUpperCase();
      const matrix: number[][] = [];

      // 20 行:2 上空白 + 16 字符 + 2 下空白
      for (let i = 0; i < 20; i++) {
        matrix[i] = [];
      }

      for (const char of upperText) {
        // 未知字符(如葡语重音 É/Ç/Ã 等)按空格处理,保证各行 push 的宽度一致
        const charData = dotMatrixFont[char];
        const isSpace = char === ' ' || !charData;
        const width = isSpace ? 8 : 16;

        matrix[0].push(...Array(width).fill(0), 0);
        matrix[1].push(...Array(width).fill(0), 0);

        for (let i = 0; i < 16; i++) {
          if (isSpace) {
            matrix[i + 2].push(...Array(width).fill(0), 0);
          } else {
            // charData 在这里一定存在;若某行缺失,降级为空白行避免 spread undefined
            const row = charData![i] ?? Array(width).fill(0);
            matrix[i + 2].push(...row, 0);
          }
        }

        matrix[18].push(...Array(width).fill(0), 0);
        matrix[19].push(...Array(width).fill(0), 0);
      }

      setMatrixData(matrix);
    };

    // 延迟非关键操作,降低输入抖动期间的 CPU 占用
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(buildMatrix);
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const timer = setTimeout(buildMatrix, 0);
    return () => clearTimeout(timer);
  }, [text]);

  // 动画 + 渲染合并为单一 rAF 循环:scrollPos 用闭包 ref 管理,不走 React state,
  // 每帧直接 drawFrame,避免 setState → re-render → useEffect 的调度抖动。
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || matrixData.length === 0) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    let scrollPos = 0;
    let lastTime = 0;
    let rafId = 0;

    const drawFrame = () => {
      const dotSize = Math.floor(canvas.height / 20);
      const w = canvas.width;
      const h = canvas.height;
      const displayColumns = Math.floor(w / dotSize);
      const totalColumns = matrixData[0]?.length ?? 0;
      if (totalColumns === 0) return;

      const startPos = Math.floor(scrollPos) % totalColumns;
      const litRadius = Math.max(1, dotSize / 2 - 1);
      const dimRadius = Math.max(1, Math.floor(dotSize / 5));

      // 1. 底色
      ctx.shadowBlur = 0;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // 2. 暗点:模拟真实 LED 面板上每颗灯泡的"未点亮但物理存在"质感
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      for (let y = 0; y < matrixData.length; y++) {
        for (let x = 0; x < displayColumns; x++) {
          const cx = x * dotSize + dotSize / 2;
          const cy = y * dotSize + dotSize / 2;
          ctx.moveTo(cx + dimRadius, cy);
          ctx.arc(cx, cy, dimRadius, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      ctx.globalAlpha = 1;

      // 3. 亮点 + 辉光:整个亮点 path 一次 fill,shadowBlur 只计算一次,开销可控
      ctx.shadowColor = textColor;
      ctx.shadowBlur = dotSize * 1.2;
      ctx.fillStyle = textColor;
      ctx.beginPath();
      for (let y = 0; y < matrixData.length; y++) {
        const row = matrixData[y];
        for (let x = 0; x < displayColumns; x++) {
          const dataX = (startPos + x) % totalColumns;
          if (row[dataX]) {
            const cx = x * dotSize + dotSize / 2;
            const cy = y * dotSize + dotSize / 2;
            ctx.moveTo(cx + litRadius, cy);
            ctx.arc(cx, cy, litRadius, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      // 全屏时整体放慢,让大屏阅读节奏舒服
      const speedMultiplier = isFullscreen ? 0.45 : 0.6;
      scrollPos += (speed * speedMultiplier * dt) / 1000;

      drawFrame();
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [matrixData, speed, isFullscreen, textColor, bgColor]);

  return (
    <div
      ref={fullscreenRef}
      className={`w-full ${isGenerator ? 'h-full' : isFullscreen ? 'h-screen' : 'h-64'} min-h-[16rem] flex items-center justify-center`}
      style={{
        contain: 'layout paint size',
        padding: '0',
        height: isGenerator ? '100%' : isFullscreen ? '100vh' : '16rem',
        backgroundColor: bgColor,
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={256}
        className='w-full h-full flex-1'
        style={{
          aspectRatio: '4/1',
          maxHeight: isFullscreen ? '90vh' : '100%',
          margin: 'auto',
          width: isFullscreen ? '90%' : '100%',
          padding: '0',
          willChange: 'transform',
          display: 'block',
          backgroundColor: bgColor,
        }}
      />
    </div>
  );
});
