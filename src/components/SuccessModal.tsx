'use client';

interface SuccessModalProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  onViewClick?: () => void;
  viewButtonText?: string;
}

export default function SuccessModal({
  title,
  subtitle,
  onClose,
  onViewClick,
  viewButtonText = 'View',
}: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full opacity-50 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">{subtitle}</p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {onViewClick && (
            <button
              onClick={onViewClick}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
            >
              {viewButtonText} →
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 text-emerald-600 hover:text-emerald-700 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
