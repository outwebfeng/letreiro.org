'use client';

import { useTranslations } from 'next-intl';

import { TEMPLATES, type Template } from '@/lib/templates';

interface TemplateQuickPickerProps {
  /** 用户点击模板后的回调,父组件应用全部配置 */
  onApply: (template: Template) => void;
}

export default function TemplateQuickPicker({ onApply }: TemplateQuickPickerProps) {
  const t = useTranslations('Templates');

  return (
    <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
      <span className='shrink-0 text-sm font-medium text-gray-700'>{t('quickTemplates')}:</span>
      <div className='flex flex-wrap gap-2'>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type='button'
            onClick={() => onApply(tpl)}
            className='inline-flex items-center rounded-md border border-[#FF782C] bg-white px-3 py-1.5 text-sm font-medium text-[#FF782C] transition-colors hover:bg-[#FF782C] hover:text-white'
            aria-label={t(`${tpl.id}.label`)}
          >
            {t(`${tpl.id}.label`)}
          </button>
        ))}
      </div>
    </div>
  );
}
