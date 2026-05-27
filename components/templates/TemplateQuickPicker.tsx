'use client';

import { useTranslations } from 'next-intl';

import { TEMPLATES, type Template } from '@/lib/templates';

interface TemplateQuickPickerProps {
  /** 用户点击模板后的回调,父组件应用全部配置 */
  onApply: (template: Template) => void;
  /** 可选的重置回调,传入后会渲染"恢复默认"按钮 */
  onReset?: () => void;
}

export default function TemplateQuickPicker({ onApply, onReset }: TemplateQuickPickerProps) {
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
        {onReset && (
          <button
            type='button'
            onClick={onReset}
            className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
          >
            ↺ {t('reset')}
          </button>
        )}
      </div>
    </div>
  );
}
