'use client';

import { useTranslations } from 'next-intl';

import { SCENE_PAGES } from '@/lib/scenes';
import { Link } from '@/app/navigation';

const CARD_CLASS =
  'block rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md';

/**
 * 场景页内链卡片(仅输出一组 <Link>,不含外层 grid)。
 * 供首页 / LED 页 / 各场景页 Related 区共用,布局由调用处的 grid 容器决定。
 * excludeScope:排除某个场景(用于场景页自身,避免链回当前页)。
 */
export function SceneNavCards({ excludeScope }: { excludeScope?: string }) {
  const t = useTranslations('Home.SceneNav');

  return (
    <>
      {SCENE_PAGES.filter((page) => page.scope !== excludeScope).map((page) => (
        <Link key={page.navKey} href={page.routePath} className={CARD_CLASS}>
          <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>→ {t(`items.${page.navKey}.label`)}</h3>
          <p className='leading-relaxed text-black/80'>{t(`items.${page.navKey}.blurb`)}</p>
        </Link>
      ))}
    </>
  );
}

/**
 * 带标题 + intro 的完整场景导航区块,用于首页与 LED 页(列出全部场景)。
 * H2 沿用页面统一样式。
 */
export default function SceneNavSection() {
  const t = useTranslations('Home.SceneNav');

  return (
    <>
      <h2 id='scene-nav' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
        {t('title')}
      </h2>
      <p className='mb-4 leading-relaxed text-black/80'>{t('intro')}</p>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <SceneNavCards />
      </div>
    </>
  );
}
