'use client';

interface Step2PropertyInfoProps {
  value: { property_type: string | null; bedrooms: string | null; square_meters?: string | null };
  onChange: (updates: { property_type?: string; bedrooms?: string; square_meters?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PropertyInfo({ value, onChange, onNext, onBack }: Step2PropertyInfoProps) {
  const propertyTypes = [
    { id: 'home', label: 'House' },
    { id: 'apartment', label: 'Apartment/Unit' },
    { id: 'office', label: 'Office' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const bedroomOptions = [
    { id: '1', label: '1 Bedroom' },
    { id: '2', label: '2 Bedrooms' },
    { id: '3', label: '3 Bedrooms' },
    { id: '4', label: '4+ Bedrooms' },
  ];

  const squareMeterOptions = [
    { id: 'small', label: 'Up to 50 m²' },
    { id: 'medium', label: '50-200 m²' },
    { id: 'large', label: '200-500 m²' },
    { id: 'xlarge', label: '500+ m²' },
  ];

  const isResidential = ['home', 'apartment'].includes(value.property_type || '');
  const isCommercial = ['office', 'commercial'].includes(value.property_type || '');
  const isComplete = value.property_type && (isResidential ? value.bedrooms : value.square_meters);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your property</h2>
      <p className="text-gray-600 mb-6">This helps us match you with the right installer.</p>

      {/* Property Type */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Property Type</label>
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
          <label className="block text-sm font-semibold text-gray-900 mb-3">Number of Bedrooms</label>
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
          <label className="block text-sm font-semibold text-gray-900 mb-3">Approximate Space Size</label>
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
