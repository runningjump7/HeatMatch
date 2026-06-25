'use client';

import { useState } from 'react';

interface Step3JobDetailsProps {
  value: {
    heat_pumps_needed: string | null;
    location_to_install: string[];
    existing_unit: 'yes' | 'no' | 'need_recommendation' | null;
    photos: File[];
  };
  propertyType: 'home' | 'apartment' | 'office' | 'commercial' | null;
  serviceType: 'new_install' | 'replace' | 'service' | 'advice' | null;
  onChange: (updates: Partial<{
    heat_pumps_needed: string;
    location_to_install: string[];
    existing_unit: 'yes' | 'no' | 'need_recommendation';
    photos: File[];
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3JobDetails({ value, propertyType, serviceType, onChange, onNext, onBack }: Step3JobDetailsProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pumpOptions = [
    { id: '1', label: '1 Heat Pump' },
    { id: '2', label: '2 Heat Pumps' },
    { id: '3', label: '3 Heat Pumps' },
    { id: '4', label: '4+ Heat Pumps' },
  ];

  const residentialLocations = [
    'Lounge',
    'Main Bedroom',
    'Bedroom 2',
    'Bedroom 3',
    'Kitchen',
    'Bathroom',
    'Laundry',
    'Office',
  ];

  const commercialLocations = [
    'Reception Area',
    'Conference Room',
    'Warehouse/Storage',
    'Showroom',
    'Server Room',
    'Corridor/Common Area',
    'Kitchen/Break Room',
    'Other (specify in notes)',
  ];

  const locationOptions = ['office', 'commercial'].includes(propertyType || '')
    ? commercialLocations
    : residentialLocations;

  const existingUnitOptions: Array<{
    id: 'yes' | 'no' | 'need_recommendation';
    label: string;
  }> = [
    { id: 'yes', label: 'Yes, I have an existing unit' },
    { id: 'no', label: 'No, this is a new installation' },
    { id: 'need_recommendation', label: 'Not sure, need advice' },
  ];

  const handleLocationToggle = (location: string) => {
    const newLocations = value.location_to_install.includes(location)
      ? value.location_to_install.filter(l => l !== location)
      : [...value.location_to_install, location];
    onChange({ location_to_install: newLocations });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError(null);

    if (value.photos.length + files.length > 5) {
      setUploadError('Maximum 5 photos allowed');
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`Photo "${file.name}" is larger than 5MB`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" is not an image`);
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
        return 'Where would you like them replaced? (Select all that apply)';
      case 'service':
        return 'Where would you like them serviced? (Select all that apply)';
      default:
        return 'Where would you like them installed? (Select all that apply)';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about the job</h2>
      <p className="text-gray-600 mb-6">More details help us find the perfect installer for you.</p>

      {/* Heat Pumps Needed */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">How many heat pumps do you need?</label>
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
              key={location}
              onClick={() => handleLocationToggle(location)}
              className={`p-3 rounded-lg border-2 font-medium text-sm transition text-center ${
                value.location_to_install.includes(location)
                  ? 'border-emerald-600 bg-emerald-50 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Existing Unit */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Do you have an existing heat pump unit?</label>
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
          Upload photos (optional)
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
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
