/**
 * Canvas 导出工具:GIF + Video,带 letreiro.org 水印
 */

const WATERMARK_TEXT = 'letreiro.org';

/**
 * 在目标 canvas 上画 source canvas 内容 + 右下角水印
 */
function drawFrameWithWatermark(source: HTMLCanvasElement, dest: HTMLCanvasElement) {
  const ctx = dest.getContext('2d');
  if (!ctx) return;

  // 1. 画原 LED canvas
  ctx.drawImage(source, 0, 0, dest.width, dest.height);

  // 2. 右下角水印,半透明白字
  const fontSize = Math.max(12, Math.floor(dest.height / 18));
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'right';
  const padding = Math.max(6, Math.floor(fontSize * 0.4));
  ctx.fillText(WATERMARK_TEXT, dest.width - padding, dest.height - padding);
}

/**
 * 导出 GIF:抓 3 秒(90 帧 @ 30fps),用 gifenc 编码
 * 返回 Blob,大约 500KB-2MB
 */
export async function exportAsGif(
  source: HTMLCanvasElement,
  options: { durationMs?: number; fps?: number; onProgress?: (p: number) => void } = {},
): Promise<Blob> {
  const { durationMs = 3000, fps = 20, onProgress } = options;

  const { GIFEncoder, quantize, applyPalette } = await import('gifenc');

  // 临时 canvas 用于叠加水印
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = source.width;
  exportCanvas.height = source.height;
  const exportCtx = exportCanvas.getContext('2d');
  if (!exportCtx) throw new Error('Canvas 2d context unavailable');

  const totalFrames = Math.round((durationMs / 1000) * fps);
  const frameDelay = Math.round(1000 / fps);
  const frames: Uint8ClampedArray[] = [];

  // 1. 抓帧阶段(异步,等 requestAnimationFrame)
  for (let i = 0; i < totalFrames; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    drawFrameWithWatermark(source, exportCanvas);
    const imageData = exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
    frames.push(imageData.data);
    onProgress?.(((i + 1) / totalFrames) * 0.5); // 抓帧占进度的前 50%
  }

  // 2. 编码阶段
  const encoder = GIFEncoder();
  for (let i = 0; i < frames.length; i++) {
    const data = frames[i];
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    encoder.writeFrame(index, exportCanvas.width, exportCanvas.height, {
      palette,
      delay: frameDelay,
    });
    onProgress?.(0.5 + ((i + 1) / frames.length) * 0.5); // 编码占后 50%
  }
  encoder.finish();

  const bytes = encoder.bytes();
  // gifenc 返回 Uint8Array,转 ArrayBuffer slice 喂给 Blob
  return new Blob([bytes.slice().buffer as ArrayBuffer], { type: 'image/gif' });
}

/**
 * 导出 Video (WebM):用 MediaRecorder 录 captureStream
 * 返回 Blob,大约 200-800KB
 */
export async function exportAsVideo(
  source: HTMLCanvasElement,
  options: { durationMs?: number; fps?: number; onProgress?: (p: number) => void } = {},
): Promise<Blob> {
  const { durationMs = 5000, fps = 30, onProgress } = options;

  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder API not supported');
  }

  // 用临时 canvas 叠加水印,然后录这个
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = source.width;
  exportCanvas.height = source.height;

  const stream = exportCanvas.captureStream(fps);
  const mimeCandidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
  if (!mimeType) throw new Error('No supported WebM codec');

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2_500_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // 用 rAF 循环把 LED canvas + 水印画到 exportCanvas
  let stopRendering = false;
  const renderLoop = () => {
    if (stopRendering) return;
    drawFrameWithWatermark(source, exportCanvas);
    requestAnimationFrame(renderLoop);
  };

  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      stopRendering = true;
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = (e) => {
      stopRendering = true;
      reject(e);
    };

    requestAnimationFrame(renderLoop);
    recorder.start();

    // 进度回调
    const startTime = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      onProgress?.(progress);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    setTimeout(() => recorder.stop(), durationMs);
  });
}

/**
 * 触发浏览器下载
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
