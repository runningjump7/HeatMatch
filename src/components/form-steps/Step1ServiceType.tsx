'use client';

interface Step1ServiceTypeProps {
  value: string | null;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function Step1ServiceType({ value, onChange, onNext }: Step1ServiceTypeProps) {
  const services = [
    { id: 'new_install', label: 'New Heat Pump Installation', icon: '/icons/service-new-installation.svg' },
    { id: 'replace', label: 'Replace Existing Heat Pump', icon: '/icons/service-replace-existing.svg' },
    { id: 'service', label: 'Heat Pump Service', icon: '/icons/service-heat-pump-service.svg' },
    { id: 'advice', label: 'Not Sure / Need Advice', icon: '/icons/service-need-advice.svg' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you need help with?</h2>
      <p className="text-gray-600 mb-6">Let us know what kind of service you're looking for.</p>

      <div className="space-y-3 mb-8">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onChange(service.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition ${
              value === service.id
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <img src={service.icon} alt="" className="w-6 h-6 flex-shrink-0" />
            <span className={`text-left font-medium ${value === service.id ? 'text-gray-900' : 'text-gray-700'}`}>
              {service.label}
            </span>
            <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
      >
        Continue →
      </button>
    </div>
  );
}
