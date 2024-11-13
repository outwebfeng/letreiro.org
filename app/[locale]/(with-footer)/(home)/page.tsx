'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });
const MarqueeLED = dynamic(() => import('@/components/MarqueeLED'), { ssr: false });

export default function Page() {
  const t = useTranslations('Home');

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex flex-col items-center text-center sm:mb-12 lg:mx-auto'>
          <h1 className='mb-3 text-2xl font-extrabold text-[#FF782C] sm:mb-4 sm:text-3xl md:text-4xl lg:text-6xl'>
            {t('title')}
          </h1>
          <div className='max-w-2xl text-sm font-semibold text-black/70 sm:text-base md:text-lg lg:text-xl'>
            {t('subTitle')}
          </div>
        </div>

        <MarqueeLED t={t} />

        <div className='mb-8 space-y-6 sm:mb-12 sm:space-y-8'>
          {/* Features Section */}
          <section className='rounded-lg bg-white p-6 shadow-lg'>
            <h2 id='features' className='mb-6 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('Features.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('Features.items').map((item: { title: string; description: string }) => (
                <div
                  key={`feature-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Welcome Section */}
            <h2 id='welcome' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('Welcome.title')}
            </h2>
            <div className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'>
              <p className='leading-relaxed text-black/80'>{t('Welcome.description')}</p>
            </div>

            {/* What Is Section */}
            <h2 id='what-is' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('WhatIs.title')}
            </h2>
            <div className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'>
              <p className='leading-relaxed text-black/80'>{t('WhatIs.description')}</p>
            </div>

            {/* How to Use Section */}
            <h2
              id='how-to-use'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t('HowToUse.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('HowToUse.steps').map((item: { step: string; description: string }) => (
                <div
                  key={`step-${item.step.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.step}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Why Choose Section */}
            <h2
              id='why-choose'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t('WhyChoose.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('WhyChoose.items').map((item: { title: string; description: string }) => (
                <div
                  key={`why-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Design Tips Section */}
            <h2
              id='design-tips'
              className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'
            >
              {t('DesignTips.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('DesignTips.tips').map((item: { tip: string; description: string }) => (
                <div
                  key={`tip-${item.tip.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.tip}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <h2 id='faq' className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('Faq.title')}
            </h2>
            <div className='space-y-4'>
              {t.raw('Faq.questions').map((faqItem: { question: string; answer: string }) => (
                <details
                  key={`faq-${faqItem.question.toLowerCase().replace(/\s+/g, '-')}`}
                  className='group rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <summary className='flex cursor-pointer list-none items-center justify-between font-medium'>
                    <span className='text-xl font-semibold text-[#FF782C]'>{faqItem.question}</span>
                  </summary>
                  <div className='mt-3'>
                    <p className='group-open:animate-fadeIn leading-relaxed text-black/80'>{faqItem.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
        <ScrollToTop />
      </div>
    </div>
  );
}
