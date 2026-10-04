'use client';

import { useState } from 'react';

interface ClaimModalProps {
  slug: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'email' | 'verify' | 'password' | 'success' | 'error';

export default function ClaimBusinessModal({ slug, businessName, isOpen, onClose }: ClaimModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [claimId, setClaimId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/installer/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, email, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresAdminReview) {
          setError(data.error);
          setStep('error');
        } else {
          setError(data.error || 'Failed to submit claim');
        }
        return;
      }

      setClaimId(data.claimId);
      setStep('verify');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/installer/verify-claim-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to verify code');
        return;
      }

      setStep('password');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/installer/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      setStep('success');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/installer/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, email, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend code');
        return;
      }

      setCode('');
      setError('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Claim This Business</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Step 1: Email & Name */}
        {step === 'email' && (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Verify that you own or operate <strong>{businessName}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., contact@yourcompany.nz"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-700 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be from your business domain (e.g., @yourcompany.nz)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-700 text-gray-900"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-2 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono placeholder-gray-700 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Code expires in 10 minutes</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="w-full text-emerald-600 hover:text-emerald-700 py-2 font-semibold transition"
            >
              Didn't receive code? Resend
            </button>
          </form>
        )}

        {/* Step 3: Set Password */}
        {step === 'password' && (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <p className="text-gray-600 text-sm">
              Almost there! Create a password for your account.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-700 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-700 text-gray-900"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || password.length < 8 || password !== confirmPassword}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-gray-900">Claim Successful!</h3>
            <p className="text-gray-600">
              Your business has been verified. You can now manage your profile and leads.
            </p>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/installer-dashboard';
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Step 5: Error (Admin Review - Phase 2) */}
        {step === 'error' && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900">Manual Review Required</h3>
            <p className="text-gray-600">
              Your email domain doesn't match this business name. Our admin team will review your claim and contact you within 24 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-left">
              <p className="text-sm text-gray-700">
                <strong>What's next?</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                <li>We've received your claim</li>
                <li>Admin will verify your business details</li>
                <li>You'll get an email with the outcome</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              We'll contact you at <strong>{email}</strong> within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
