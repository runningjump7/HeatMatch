'use client';

interface ErrorModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({
  title,
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
