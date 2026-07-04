'use client';

import { useTranslations } from 'next-intl';

interface Step2PropertyInfoProps {
  value: {
    property_type: 'home' | 'apartment' | 'office' | 'commercial' | null;
    bedrooms: string | null;
    square_meters?: string | null;
  };
  onChange: (updates: {
    property_type?: 'home' | 'apartment' | 'office' | 'commercial';
    bedrooms?: string;
    square_meters?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PropertyInfo({ value, onChange, onNext, onBack }: Step2PropertyInfoProps) {
  const t = useTranslations();

  const propertyTypes: Array<{
    id: 'home' | 'apartment' | 'office' | 'commercial';
    label: string;
  }> = [
    { id: 'home', label: t('form.propertyTypes.home') },
    { id: 'apartment', label: t('form.propertyTypes.apartment') },
    { id: 'office', label: t('form.propertyTypes.office') },
    { id: 'commercial', label: t('form.propertyTypes.commercial') },
  ];

  const bedroomOptions = [
    { id: '1', label: t('form.bedrooms.one') },
    { id: '2', label: t('form.bedrooms.two') },
    { id: '3', label: t('form.bedrooms.three') },
    { id: '4', label: t('form.bedrooms.four') },
  ];

  const squareMeterOptions = [
    { id: 'small', label: t('form.spaceSize.small') },
    { id: 'medium', label: t('form.spaceSize.medium') },
    { id: 'large', label: t('form.spaceSize.large') },
    { id: 'xlarge', label: t('form.spaceSize.xlarge') },
  ];

  const isResidential = ['home', 'apartment'].includes(value.property_type || '');
  const isCommercial = ['office', 'commercial'].includes(value.property_type || '');
  const isComplete = value.property_type && (isResidential ? value.bedrooms : value.square_meters);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('form.step2.title')}</h2>
      <p className="text-gray-600 mb-6">{t('form.step2.subtitle')}</p>

      {/* Property Type */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">{t('form.step2.propertyType')}</label>
        <div className="grid grid-cols-2 gap-3">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onChange({ property_type: type.id })}
              className={`p-3 rounded-lg border-2 font-medium transition text-center ${
                value.property_type === type.id
                  ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms (for residential) */}
      {isResidential && (
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">{t('form.step2.bedrooms')}</label>
          <div className="grid grid-cols-2 gap-3">
            {bedroomOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange({ bedrooms: option.id })}
                className={`p-3 rounded-lg border-2 font-medium transition text-center ${
                  value.bedrooms === option.id
                    ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Square Meters (for commercial) */}
      {isCommercial && (
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">{t('form.step2.spaceSize')}</label>
          <div className="grid grid-cols-2 gap-3">
            {squareMeterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange({ square_meters: option.id })}
                className={`p-3 rounded-lg border-2 font-medium transition text-center ${
                  value.square_meters === option.id
                    ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          disabled={!isComplete}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
        >
          {t('form.buttons.continue')}
        </button>
      </div>
    </div>
  );
}
