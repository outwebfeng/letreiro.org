// LED 跑马灯非 LED 模式可选字体表。
// CSS 变量由 next/font/google 在 app/[locale]/layout.tsx 注入到 <body>。
// id 用于 URL 参数(短)、label 用于 UI 展示(品牌名不翻译,空 id 走 i18n 'fontDefault')。

export type FontOption = {
  readonly id: string;
  readonly cssVar: string;
  readonly label: string;
};

export const FONT_OPTIONS: readonly FontOption[] = [
  { id: '', cssVar: '', label: 'fontDefault' },
  { id: 'vt323', cssVar: 'var(--font-vt323)', label: 'VT323' },
  { id: 'press-start', cssVar: 'var(--font-press-start-2p)', label: 'Press Start 2P' },
  { id: 'silkscreen', cssVar: 'var(--font-silkscreen)', label: 'Silkscreen' },
  { id: 'dotgothic', cssVar: 'var(--font-dotgothic16)', label: 'DotGothic16' },
];

export const VALID_FONT_IDS: readonly string[] = FONT_OPTIONS.map((f) => f.id);

export function fontIdToCssVar(id: string | null | undefined): string {
  if (!id) return '';
  return FONT_OPTIONS.find((f) => f.id === id)?.cssVar ?? '';
}
