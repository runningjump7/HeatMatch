'use client';

interface SubmissionConfirmationProps {
  leadId: string;
  onClose: () => void;
}

export default function SubmissionConfirmation({ leadId, onClose }: SubmissionConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Quote Request Submitted!</h2>

        {/* Message */}
        <p className="text-gray-600 mb-2">Thank you for submitting your project details.</p>
        <p className="text-gray-600 mb-6">
          Your unique request ID is <span className="font-semibold text-gray-900">{leadId.slice(0, 8).toUpperCase()}</span>
        </p>

        {/* What Happens Next */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">1</span>
              <span>We review your project details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">2</span>
              <span>Trusted installers are notified</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">3</span>
              <span>You'll be contacted within 24 hours</span>
            </li>
          </ul>
        </div>

        {/* Key Points */}
        <div className="space-y-3 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free service - no cost to you</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No obligation - get quotes to compare</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified installers only</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
