'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import MarqueeLED from '@/components/MarqueeLED';
import { SceneNavCards } from '@/components/SceneNav';
import { Link } from '@/app/navigation';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

interface ScenePageContentProps {
  /**
   * i18n 命名空间前缀,如 'Loja' / 'Animado' / 'Aniversario' / 'Natal'。
   * 期望存在 Home.{scope}Page / {scope}Features / {scope}WhenToUse / {scope}HowTo /
   * {scope}Compare / {scope}FAQ / {scope}Related 子节。
   */
  scope: string;
}

export default function ScenePageContent({ scope }: ScenePageContentProps) {
  const t = useTranslations('Home');

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8'>
        <div className='mb-4 flex flex-col items-center text-center sm:mb-6 lg:mx-auto'>
          <h1 className='mb-2 text-2xl font-extrabold text-[#FF782C] sm:mb-3 sm:text-3xl md:text-4xl lg:text-6xl'>
            {t(`${scope}Page.h1`)}
          </h1>
          <div className='max-w-6xl text-xs font-medium text-black/70 sm:text-sm md:text-base'>
            {t(`${scope}Page.subTitle`)}
          </div>
        </div>

        <div className='-mt-2 sm:-mt-4'>
          <MarqueeLED />
        </div>

        <div className='mb-8 space-y-6 sm:mb-12 sm:space-y-8'>
          <section className='rounded-lg bg-white p-6 shadow-lg'>
            <h2 id='scene-features' className='mb-6 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t(`${scope}Features.title`)}
            </h2>
            <div className='space-y-4'>
              {t.raw(`${scope}Features.items`).map((item: { title: string; description: string }) => (
                <div
                  key={`scene-feature-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            <h2
              id='scene-when'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t(`${scope}WhenToUse.title`)}
            </h2>
            <div className='space-y-4'>
              {t.raw(`${scope}WhenToUse.items`).map((item: { title: string; description: string }) => (
                <div
                  key={`scene-when-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            <h2
              id='scene-how-to'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t(`${scope}HowTo.title`)}
            </h2>
            <div className='space-y-4'>
              {t.raw(`${scope}HowTo.steps`).map((item: { step: string; description: string }) => (
                <div
                  key={`scene-step-${item.step.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.step}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            <h2
              id='scene-compare'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t(`${scope}Compare.title`)}
            </h2>
            <p className='mb-4 leading-relaxed text-black/80'>{t(`${scope}Compare.intro`)}</p>
            <div className='space-y-4'>
              {t.raw(`${scope}Compare.items`).map((item: { title: string; description: string }) => (
                <div
                  key={`scene-compare-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            <h2
              id='scene-faq'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t(`${scope}FAQ.title`)}
            </h2>
            <div className='space-y-4'>
              {t.raw(`${scope}FAQ.questions`).map((faqItem: { question: string; answer: string }) => (
                <details
                  key={`scene-faq-${faqItem.question.toLowerCase().replace(/\s+/g, '-')}`}
                  className='group rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <summary className='flex cursor-pointer list-none items-center justify-between font-medium'>
                    <h3 className='text-xl font-semibold text-[#FF782C]'>{faqItem.question}</h3>
                  </summary>
                  <div className='mt-3'>
                    <p className='group-open:animate-fadeIn leading-relaxed text-black/80'>{faqItem.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            <h2
              id='scene-related'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t(`${scope}Related.title`)}
            </h2>
            <p className='mb-4 leading-relaxed text-black/80'>{t(`${scope}Related.intro`)}</p>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Link
                href='/letreiro-de-led'
                className='block rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
              >
                <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{t(`${scope}Related.led.title`)}</h3>
                <p className='leading-relaxed text-black/80'>{t(`${scope}Related.led.description`)}</p>
              </Link>
              <Link
                href='/'
                className='block rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
              >
                <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{t(`${scope}Related.home.title`)}</h3>
                <p className='leading-relaxed text-black/80'>{t(`${scope}Related.home.description`)}</p>
              </Link>
              <SceneNavCards excludeScope={scope} />
            </div>
          </section>
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
}
