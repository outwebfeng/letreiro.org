/**
 * 模板数据:4 个对准实测高搜索量场景词的预设
 * 注:text 全部用 ASCII-only,因为当前 dotMatrixFont 不支持葡语重音字符(Á/É/Ç 等)
 * 后续如扩展字体支持葡语字符,可以让 text 更地道
 */

export type DisplayMode = 'default' | 'blur' | 'led';

export interface Template {
  /** 模板 ID,用于 i18n key:Templates.loja / Templates.aniversario / ... */
  id: 'loja' | 'aniversario' | 'natal' | 'oferta';
  /** ASCII-only 文字,可直接喂给 LED 点阵字体 */
  text: string;
  textColor: string;
  bgColor: string;
  speed: number;
  displayMode: DisplayMode;
}

export const TEMPLATES: Template[] = [
  {
    id: 'loja',
    text: 'ABERTO',
    textColor: '#00FF00', // 鲜亮绿色,招牌"营业中"经典色
    bgColor: '#000000',
    speed: 5,
    displayMode: 'led',
  },
  {
    id: 'aniversario',
    text: 'PARABENS!',
    textColor: '#FFD700', // 金黄色
    bgColor: '#8B0000', // 深红
    speed: 6,
    displayMode: 'led',
  },
  {
    id: 'natal',
    text: 'FELIZ NATAL',
    textColor: '#FF0000', // 圣诞红
    bgColor: '#006400', // 圣诞绿
    speed: 5,
    displayMode: 'led',
  },
  {
    id: 'oferta',
    text: 'OFERTA 50% OFF',
    textColor: '#FFFF00', // 鲜黄
    bgColor: '#000000',
    speed: 8,
    displayMode: 'led',
  },
];
