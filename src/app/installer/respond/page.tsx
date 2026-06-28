'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function ResponderContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const presetResponse = searchParams.get('response');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(presetResponse);

  useEffect(() => {
    // If response was passed in URL, auto-submit
    if (presetResponse && token) {
      handleSubmit(presetResponse);
    }
  }, [presetResponse, token]);

  const handleSubmit = async (response: string) => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid request. Please use the link from your email.');
      return;
    }

    setStatus('loading');
    setSelectedResponse(response);

    try {
      const res = await fetch('/api/installer/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, response }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to submit response');
        return;
      }

      setStatus('success');
      setMessage(data.message);
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      console.error('Error submitting response:', error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
            <p className="text-gray-600">
              This link appears to be invalid or expired. Please check your email for the latest lead notification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Response Recorded</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <a
              href="/"
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Back to HeatMatch
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <a
              href="/"
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Back to HeatMatch
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Are you interested in this lead?</h1>
          <p className="text-gray-600">Let us know if you can help this homeowner</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSubmit('accept')}
            disabled={status === 'loading' && selectedResponse === 'accept'}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {status === 'loading' && selectedResponse === 'accept' && (
              <span className="animate-spin">⏳</span>
            )}
            ✅ Yes, I can help
          </button>

          <button
            onClick={() => handleSubmit('reject')}
            disabled={status === 'loading' && selectedResponse === 'reject'}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {status === 'loading' && selectedResponse === 'reject' && (
              <span className="animate-spin">⏳</span>
            )}
            ❌ Not interested
          </button>

          <button
            onClick={() => handleSubmit('need_info')}
            disabled={status === 'loading' && selectedResponse === 'need_info'}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {status === 'loading' && selectedResponse === 'need_info' && (
              <span className="animate-spin">⏳</span>
            )}
            ❓ Need more info
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          This link is valid for 7 days. After that, please contact us directly.
        </p>
      </div>
    </div>
  );
}

export default function InstallerRespondPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">Loading...</div>}>
      <ResponderContent />
    </Suspense>
  );
}
