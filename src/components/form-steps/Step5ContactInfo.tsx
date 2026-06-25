'use client';

import { useState } from 'react';

interface ContactInfoValue {
  homeowner_name: string;
  phone: string;
  email: string;
  suburb: string;
  consent_given: boolean;
}

interface Step5ContactInfoProps {
  value: ContactInfoValue;
  onChange: (updates: Partial<ContactInfoValue>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function Step5ContactInfo({
  value,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: Step5ContactInfoProps) {
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [showSuburbDropdown, setShowSuburbDropdown] = useState(false);
  const [suburbInput, setSuburbInput] = useState(value.suburb);

  const isComplete =
    value.homeowner_name.trim() &&
    value.phone.trim() &&
    value.email.trim() &&
    value.suburb.trim() &&
    value.consent_given;

  const handleSuburbChange = (input: string) => {
    setSuburbInput(input);
    if (input.length > 0) {
      // Fetch suburbs matching the input
      fetchSuburbs(input);
      setShowSuburbDropdown(true);
    } else {
      setShowSuburbDropdown(false);
    }
  };

  const fetchSuburbs = async (query: string) => {
    try {
      const res = await fetch(`/api/suburbs?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuburbs(data.suburbs || []);
      }
    } catch (error) {
      console.error('Error fetching suburbs:', error);
    }
  };

  const handleSuburbSelect = (suburb: string) => {
    setSuburbInput(suburb);
    onChange({ suburb });
    setShowSuburbDropdown(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your contact information</h2>
      <p className="text-gray-600 mb-6">Installers will use this to reach you about your project.</p>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
        <input
          type="text"
          value={value.homeowner_name}
          onChange={(e) => onChange({ homeowner_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
          placeholder="John Smith"
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
        <input
          type="tel"
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
          placeholder="09 123 4567"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
          placeholder="john@example.com"
        />
      </div>

      {/* Suburb */}
      <div className="mb-6 relative">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Suburb</label>
        <div className="relative">
          <input
            type="text"
            value={suburbInput}
            onChange={(e) => handleSuburbChange(e.target.value)}
            onFocus={() => suburbInput.length > 0 && setShowSuburbDropdown(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-gray-900"
            placeholder="e.g., Takapuna, Albany"
            autoComplete="off"
          />

          {/* Dropdown */}
          {showSuburbDropdown && suburbs.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {suburbs.map((suburb) => (
                <button
                  key={suburb}
                  onClick={() => handleSuburbSelect(suburb)}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-900 border-b border-gray-200 last:border-b-0"
                >
                  {suburb}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value.consent_given}
            onChange={(e) => onChange({ consent_given: e.target.checked })}
            className="mt-1 w-5 h-5 border border-gray-300 rounded accent-emerald-600"
          />
          <span className="text-sm text-gray-700">
            I agree to be contacted by installers about this project. I understand HeatMatch is free for homeowners.
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isComplete || isSubmitting}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
              </svg>
              Submitting...
            </>
          ) : (
            <>Get Your Quote →</>
          )}
        </button>
      </div>
    </div>
  );
}
