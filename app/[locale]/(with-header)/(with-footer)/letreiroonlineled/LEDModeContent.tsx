'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });
const MarqueeLED = dynamic(() => import('@/components/MarqueeLED'), { ssr: false });

export default function LEDModeContent() {
  const t = useTranslations('Navigation');
  const homeT = useTranslations('Home');

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex flex-col items-center text-center sm:mb-12 lg:mx-auto'>
          <h1 className='mb-3 text-2xl font-extrabold text-[#FF782C] sm:mb-4 sm:text-3xl md:text-4xl lg:text-6xl'>
            {t('letreiroOnlineLed')}
          </h1>
          <div className='max-w-6xl text-sm font-semibold text-black/70 sm:text-base md:text-lg lg:text-xl'>
            {t('ledModeDescription')}
          </div>
        </div>
        
        <MarqueeLED 
          initialDisplayMode="led"
          availableDisplayModes={[]}
          showSpeedControl={false}
          showFullscreenButton={true}
          showGeneratorButton={true}
        />

        <div className='mb-8 space-y-6 sm:mb-12 sm:space-y-8'>
          {/* LED Features Section */}
          <section className='rounded-lg bg-white p-6 shadow-lg'>
            <h2 className='mb-6 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {homeT('LEDFeatures.title')}
            </h2>
            <div className='space-y-4'>
              {homeT.raw('LEDFeatures.items').map((item: { title: string; description: string }) => (
                <div
                  key={`feature-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{item.title}</h3>
                  <p className='leading-relaxed text-black/80'>{item.description}</p>
                </div>
              ))}
            </div>

            {/* LED FAQ Section */}
            <h2 className='mb-6 mt-12 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {homeT('LEDFAQ.title')}
            </h2>
            <div className='space-y-4'>
              {homeT.raw('LEDFAQ.questions').map((faqItem: { question: string; answer: string }) => (
                <details
                  key={`faq-${faqItem.question.toLowerCase().replace(/\s+/g, '-')}`}
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
          </section>
        </div>
        <ScrollToTop />
      </div>
    </div>
  );
} 