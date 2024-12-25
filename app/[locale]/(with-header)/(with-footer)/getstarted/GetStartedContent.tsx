'use client';

import { useTranslations } from 'next-intl';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function GetStartedContent() {
  const t = useTranslations('GetStarted');

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex flex-col items-center text-center sm:mb-12 lg:mx-auto'>
          <h1 className='mb-3 text-2xl font-extrabold text-[#FF782C] sm:mb-4 sm:text-3xl md:text-4xl lg:text-6xl'>
            {t('title')}
          </h1>
          <div className='max-w-6xl text-sm font-semibold text-black/70 sm:text-base md:text-lg lg:text-xl'>
            {t('description')}
          </div>
        </div>

        <div className='mb-8 space-y-6 sm:mb-12 sm:space-y-8'>
          {/* For Users Section */}
          <section className='rounded-lg bg-white p-6 shadow-lg'>
            <h2 className='mb-6 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('forUsers.title')}
            </h2>
            <p className='mb-6 text-gray-600'>{t('forUsers.description')}</p>
            <div className='space-y-4'>
              {t.raw('forUsers.steps').map((step: { title: string; description: string }, index: number) => (
                <div
                  key={`user-step-${index}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{step.title}</h3>
                  <p className='leading-relaxed text-black/80'>{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* For Developers Section */}
          <section className='rounded-lg bg-white p-6 shadow-lg'>
            <h2 className='mb-6 border-b-2 border-[#FF782C] pb-2 text-2xl font-bold text-[#FF782C]'>
              {t('forDevelopers.title')}
            </h2>
            <p className='mb-6 text-gray-600'>{t('forDevelopers.description')}</p>
            
            {/* Developer Steps */}
            <div className='mb-8 space-y-4'>
              {t.raw('forDevelopers.steps').map((step: { title: string; description: string }, index: number) => (
                <div
                  key={`dev-step-${index}`}
                  className='rounded-md bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <h3 className='mb-2 text-xl font-semibold text-[#FF782C]'>{step.title}</h3>
                  <p className='leading-relaxed text-black/80'>{step.description}</p>
                </div>
              ))}
            </div>

            {/* Embed Example */}
            <div className='mb-8'>
              <h3 className='mb-4 text-xl font-semibold text-[#FF782C]'>{t('forDevelopers.embedExample.title')}</h3>
              <p className='mb-4 text-gray-600'>{t('forDevelopers.embedExample.description')}</p>
              <div className='rounded-lg bg-gray-900 p-4'>
                <SyntaxHighlighter
                  language="html"
                  style={tomorrow}
                  customStyle={{ background: 'transparent', padding: 0 }}
                >
                  {t.raw('forDevelopers.embedExample.code')}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* URL Parameters */}
            <div>
              <h3 className='mb-4 text-xl font-semibold text-[#FF782C]'>{t('forDevelopers.parameters.title')}</h3>
              <p className='mb-4 text-gray-600'>{t('forDevelopers.parameters.description')}</p>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Parameter
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {t.raw('forDevelopers.parameters.items').map((item: { param: string; description: string }, index: number) => (
                      <tr key={`param-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-[#FF782C]'>
                          {item.param}
                        </td>
                        <td className='px-6 py-4 whitespace-normal text-sm text-gray-500'>
                          {item.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 