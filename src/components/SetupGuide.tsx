'use client';

import { useState, useEffect } from 'react';
import BasicInfoModal from './setup/BasicInfoModal';
import ExperienceModal from './setup/ExperienceModal';
import ServiceAreasModal from './setup/ServiceAreasModal';
import ImagesModal from './setup/ImagesModal';

interface InstallerProfile {
  business_name?: string;
  phone?: string;
  years_in_business?: number;
  bio?: string;
  primary_suburb?: string;
  service_suburbs?: string[];
  images?: string[];
}

export default function SetupGuide() {
  const [profile, setProfile] = useState<InstallerProfile>({});
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/installer/profile');
      const data = await res.json();
      setProfile(data.profile || {});
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Done = !!(profile.business_name && profile.phone);
  const isStep2Done = !!(profile.years_in_business && profile.bio);
  const isStep3Done = !!(profile.primary_suburb && profile.service_suburbs?.length);
  const isStep4Done = !!(profile.images && profile.images.length > 0);

  const completedSteps = [isStep1Done, isStep2Done, isStep3Done, isStep4Done].filter(Boolean).length;
  const totalSteps = 4;

  const steps = [
    {
      id: 'basic-info',
      number: 1,
      title: 'Business Name & Phone',
      description: 'Your contact information',
      done: isStep1Done,
      icon: '📋',
    },
    {
      id: 'experience',
      number: 2,
      title: 'Experience & Bio',
      description: 'Years in business and description',
      done: isStep2Done,
      icon: '⭐',
    },
    {
      id: 'service-areas',
      number: 3,
      title: 'Service Areas',
      description: 'Where you operate',
      done: isStep3Done,
      icon: '📍',
    },
    {
      id: 'images',
      number: 4,
      title: 'Portfolio Images',
      description: 'Before/after photos',
      done: isStep4Done,
      icon: '📸',
    },
  ];

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Get Verified in 4 Steps</h2>
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Complete your profile to get verified and start accepting leads. Progress: <strong>{completedSteps}/{totalSteps}</strong>
          </p>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveModal(step.id)}
            className={`w-full p-4 rounded-lg border-2 transition text-left ${
              step.done
                ? 'bg-green-50 border-green-300 hover:bg-green-100'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{step.done ? '✅' : step.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  Step {step.number}: {step.title}
                </p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <div className="text-right">
                {step.done && <span className="text-xs font-medium text-green-700">Complete</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modals */}
      {activeModal === 'basic-info' && (
        <BasicInfoModal
          profile={profile}
          onClose={() => setActiveModal(null)}
          onSave={() => {
            setActiveModal(null);
            fetchProfile();
          }}
        />
      )}

      {activeModal === 'experience' && (
        <ExperienceModal
          profile={profile}
          onClose={() => setActiveModal(null)}
          onSave={() => {
            setActiveModal(null);
            fetchProfile();
          }}
        />
      )}

      {activeModal === 'service-areas' && (
        <ServiceAreasModal
          profile={profile}
          onClose={() => setActiveModal(null)}
          onSave={() => {
            setActiveModal(null);
            fetchProfile();
          }}
        />
      )}

      {activeModal === 'images' && (
        <ImagesModal
          profile={profile}
          onClose={() => setActiveModal(null)}
          onSave={() => {
            setActiveModal(null);
            fetchProfile();
          }}
        />
      )}
    </div>
  );
}
