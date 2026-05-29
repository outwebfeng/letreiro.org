// 场景页清单 —— 纯数据,供内链组件(client)、首页、LED 页以及 schema/sitemap(server)共用。
// 不要在此文件 import 任何 server-only 模块(如 next-intl/server),否则 client 组件无法引用。

export interface ScenePage {
  /** 路由 path,前导 slash、不带 locale 前缀 */
  routePath: string;
  /** ScenePageContent 的 scope,对应 messages 里 Home.{scope}Page 等命名空间 */
  scope: string;
  /** Home.SceneNav.items 下的键(内链卡片文案) */
  navKey: string;
}

export const SCENE_PAGES: ScenePage[] = [
  { routePath: '/letreiro-para-loja', scope: 'Loja', navKey: 'loja' },
  { routePath: '/letreiro-animado', scope: 'Animado', navKey: 'animado' },
  { routePath: '/letreiro-de-aniversario', scope: 'Aniversario', navKey: 'aniversario' },
  { routePath: '/letreiro-de-natal', scope: 'Natal', navKey: 'natal' },
];
