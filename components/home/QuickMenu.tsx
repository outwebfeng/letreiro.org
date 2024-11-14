'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function QuickMenu() {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'marqueeLED', label: 'marqueeLED' },
    { id: 'features', label: 'features' },
    { id: 'what-is', label: 'introduction' },
    { id: 'how-to-use', label: 'howToUse' },
    { id: 'faq', label: 'faq' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* 桌面端菜单 */}
      <nav className='hidden items-center space-x-1 lg:flex'>
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => scrollToSection(e, item.id)}
            className='rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:bg-orange-100 hover:text-[#FF782C]'
          >
            {t(item.label)}
          </a>
        ))}
      </nav>

      {/* 移动端菜单 */}
      <div className='lg:hidden'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-gray-700 hover:text-[#FF782C] focus:outline-none'
          aria-label={t('toggleMenu')}
        >
          <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>

        {isOpen && (
          <div className='absolute left-0 right-0 top-16 bg-white shadow-md'>
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-[#FF782C]'
              >
                {t(item.label)}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
