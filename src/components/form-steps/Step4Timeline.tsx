'use client';

import { useTranslations } from 'next-intl';

interface Step4TimelineProps {
  value: 'asap' | 'two_weeks' | 'one_month' | 'researching' | null;
  onChange: (value: 'asap' | 'two_weeks' | 'one_month' | 'researching') => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Timeline({ value, onChange, onNext, onBack }: Step4TimelineProps) {
  const t = useTranslations();

  const timelineOptions: Array<{
    id: 'asap' | 'two_weeks' | 'one_month' | 'researching';
    label: string;
    desc: string;
  }> = [
    {
      id: 'asap',
      label: t('form.step4.options.asap'),
      desc: t('form.step4.options.asapDesc'),
    },
    {
      id: 'two_weeks',
      label: t('form.step4.options.twoWeeks'),
      desc: t('form.step4.options.twoWeeksDesc'),
    },
    {
      id: 'one_month',
      label: t('form.step4.options.oneMonth'),
      desc: t('form.step4.options.oneMonthDesc'),
    },
    {
      id: 'researching',
      label: t('form.step4.options.researching'),
      desc: t('form.step4.options.researchingDesc'),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('form.step4.title')}</h2>
      <p className="text-gray-600 mb-6">{t('form.step4.subtitle')}</p>

      <div className="space-y-3 mb-8">
        {timelineOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`w-full p-4 rounded-lg border-2 transition text-left ${
              value === option.id
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`font-semibold mb-1 ${value === option.id ? 'text-gray-900' : 'text-gray-900'}`}>
              {option.label}
            </div>
            <div className={value === option.id ? 'text-emerald-700 text-sm' : 'text-gray-600 text-sm'}>
              {option.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition"
        >
          {t('form.buttons.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
        >
          {t('form.buttons.continue')}
        </button>
      </div>
    </div>
  );
}
