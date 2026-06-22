'use client';

interface Step4TimelineProps {
  value: string | null;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Timeline({ value, onChange, onNext, onBack }: Step4TimelineProps) {
  const timelineOptions = [
    {
      id: 'asap',
      label: 'ASAP',
      desc: 'I need it done urgently (within 1 week)',
    },
    {
      id: 'two_weeks',
      label: 'Within 2 weeks',
      desc: 'I have a specific deadline coming up',
    },
    {
      id: 'one_month',
      label: 'Within 1 month',
      desc: 'I have some flexibility but want to get it done soon',
    },
    {
      id: 'researching',
      label: 'Still researching',
      desc: 'I\'m exploring options and timelines are flexible',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your timeline?</h2>
      <p className="text-gray-600 mb-6">This helps us prioritize and find installers who match your needs.</p>

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
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
