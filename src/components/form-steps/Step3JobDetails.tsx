'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Step3JobDetailsProps {
  value: {
    heat_pumps_needed: string | null;
    location_to_install: string[];
    location_notes: string;
    existing_unit: 'yes' | 'no' | 'need_recommendation' | null;
    photos: File[];
  };
  propertyType: 'home' | 'apartment' | 'office' | 'commercial' | null;
  serviceType: 'new_install' | 'replace' | 'service' | 'advice' | null;
  onChange: (updates: Partial<{
    heat_pumps_needed: string;
    location_to_install: string[];
    location_notes: string;
    existing_unit: 'yes' | 'no' | 'need_recommendation';
    photos: File[];
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3JobDetails({ value, propertyType, serviceType, onChange, onNext, onBack }: Step3JobDetailsProps) {
  const t = useTranslations();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pumpOptions = [
    { id: '1', label: t('form.step3.pumpOptions.one') },
    { id: '2', label: t('form.step3.pumpOptions.two') },
    { id: '3', label: t('form.step3.pumpOptions.three') },
    { id: '4', label: t('form.step3.pumpOptions.four') },
  ];

  const residentialLocations = [
    { key: 'lounge', label: t('form.step3.residentialLocations.lounge') },
    { key: 'mainBedroom', label: t('form.step3.residentialLocations.mainBedroom') },
    { key: 'bedroom2', label: t('form.step3.residentialLocations.bedroom2') },
    { key: 'bedroom3', label: t('form.step3.residentialLocations.bedroom3') },
    { key: 'kitchen', label: t('form.step3.residentialLocations.kitchen') },
    { key: 'bathroom', label: t('form.step3.residentialLocations.bathroom') },
    { key: 'laundry', label: t('form.step3.residentialLocations.laundry') },
    { key: 'office', label: t('form.step3.residentialLocations.office') },
  ];

  const commercialLocations = [
    { key: 'reception', label: t('form.step3.commercialLocations.reception') },
    { key: 'conference', label: t('form.step3.commercialLocations.conference') },
    { key: 'warehouse', label: t('form.step3.commercialLocations.warehouse') },
    { key: 'showroom', label: t('form.step3.commercialLocations.showroom') },
    { key: 'server', label: t('form.step3.commercialLocations.server') },
    { key: 'corridor', label: t('form.step3.commercialLocations.corridor') },
    { key: 'kitchen', label: t('form.step3.commercialLocations.kitchen') },
    { key: 'other', label: t('form.step3.commercialLocations.other') },
  ];

  const locationOptions = ['office', 'commercial'].includes(propertyType || '')
    ? commercialLocations
    : residentialLocations;

  const existingUnitOptions: Array<{
    id: 'yes' | 'no' | 'need_recommendation';
    label: string;
  }> = [
    { id: 'yes', label: t('form.step3.existingUnitOptions.yes') },
    { id: 'no', label: t('form.step3.existingUnitOptions.no') },
    { id: 'need_recommendation', label: t('form.step3.existingUnitOptions.unsure') },
  ];

  const handleLocationToggle = (locationKey: string) => {
    const newLocations = value.location_to_install.includes(locationKey)
      ? value.location_to_install.filter(l => l !== locationKey)
      : [...value.location_to_install, locationKey];
    onChange({ location_to_install: newLocations });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError(null);

    if (value.photos.length + files.length > 5) {
      setUploadError(t('form.step3.photoError'));
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`${file.name} ${t('form.step3.photoSizeError')}`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" ${t('form.step3.photoTypeError')}`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange({ photos: [...value.photos, ...validFiles] });
    }
  };

  const handleRemovePhoto = (index: number) => {
    onChange({ photos: value.photos.filter((_, i) => i !== index) });
  };

  const isComplete = value.heat_pumps_needed && value.location_to_install.length > 0 && value.existing_unit;

  const getLocationLabel = () => {
    switch (serviceType) {
      case 'replace':
        return t('form.step3.locations.replace');
      case 'service':
        return t('form.step3.locations.service');
      default:
        return t('form.step3.locations.install');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('form.step3.title')}</h2>
      <p className="text-gray-600 mb-6">{t('form.step3.subtitle')}</p>

      {/* Heat Pumps Needed */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">{t('form.step3.heatPumps')}</label>
        <div className="grid grid-cols-2 gap-3">
          {pumpOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onChange({ heat_pumps_needed: option.id })}
              className={`p-3 rounded-lg border-2 font-medium transition text-center ${
                value.heat_pumps_needed === option.id
                  ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location to Install/Replace/Service */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">{getLocationLabel()}</label>
        <div className="grid grid-cols-2 gap-2">
          {locationOptions.map((location) => (
            <button
              key={location.key}
              onClick={() => handleLocationToggle(location.key)}
              className={`p-3 rounded-lg border-2 font-medium text-sm transition text-center ${
                value.location_to_install.includes(location.key)
                  ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {location.label}
            </button>
          ))}
        </div>

        {/* Notes for "Other" locations */}
        {value.location_to_install.includes('other') && (
          <textarea
            value={value.location_notes}
            onChange={(e) => onChange({ location_notes: e.target.value })}
            placeholder={t('form.step3.locations.notes')}
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
            rows={3}
          />
        )}
      </div>

      {/* Existing Unit */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">{t('form.step3.existingUnit')}</label>
        <div className="space-y-2">
          {existingUnitOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onChange({ existing_unit: option.id })}
              className={`w-full p-3 rounded-lg border-2 font-medium text-left transition ${
                value.existing_unit === option.id
                  ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t('form.step3.photoUpload')}
          <span className="text-gray-500 font-normal text-xs block mt-1">Max 5 photos, 5MB each. Photos help installers provide better quotes.</span>
        </label>

        {/* Photo Preview */}
        {value.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {value.photos.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 cursor-pointer transition bg-gray-50">
          <div className="text-center">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB ({value.photos.length}/5 uploaded)</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>

        {uploadError && (
          <p className="text-red-600 text-sm mt-2">{uploadError}</p>
        )}
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
          disabled={!isComplete}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
        >
          {t('form.buttons.continue')}
        </button>
      </div>
    </div>
  );
}
