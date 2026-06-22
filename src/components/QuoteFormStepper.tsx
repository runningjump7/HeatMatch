'use client';

import { useState, useEffect } from 'react';
import Step1ServiceType from './form-steps/Step1ServiceType';
import Step2PropertyInfo from './form-steps/Step2PropertyInfo';
import Step3JobDetails from './form-steps/Step3JobDetails';
import Step4Timeline from './form-steps/Step4Timeline';
import Step5ContactInfo from './form-steps/Step5ContactInfo';
import SubmissionConfirmation from './form-steps/SubmissionConfirmation';

export interface FormData {
  // Step 1: Service Type
  service_type: 'new_install' | 'replace' | 'service' | 'advice' | null;

  // Step 2: Property Information
  property_type: 'home' | 'apartment' | 'office' | 'commercial' | null;
  bedrooms: string | null;

  // Step 3: Job Details
  heat_pumps_needed: string | null;
  location_to_install: string[];
  existing_unit: 'yes' | 'no' | 'need_recommendation' | null;
  photos: File[];

  // Step 4: Timeline
  timeline: 'asap' | 'two_weeks' | 'one_month' | 'researching' | null;

  // Step 5: Contact Information
  homeowner_name: string;
  phone: string;
  email: string;
  suburb: string;
  consent_given: boolean;
}

interface QuoteFormStepperProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string;
}

export default function QuoteFormStepper({ isOpen, onClose, initialServiceType }: QuoteFormStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const validServiceType = initialServiceType && ['new_install', 'replace', 'service', 'advice'].includes(initialServiceType)
    ? (initialServiceType as FormData['service_type'])
    : null;

  const [formData, setFormData] = useState<FormData>({
    service_type: validServiceType,
    property_type: null,
    bedrooms: null,
    heat_pumps_needed: null,
    location_to_install: [],
    existing_unit: null,
    photos: [],
    timeline: null,
    homeowner_name: '',
    phone: '',
    email: '',
    suburb: '',
    consent_given: false,
  });

  // When modal opens with an initial service type, jump to step 2 and set service_type
  useEffect(() => {
    if (isOpen) {
      if (validServiceType) {
        setCurrentStep(2);
        setFormData(prev => ({ ...prev, service_type: validServiceType }));
      } else {
        setCurrentStep(1);
      }
    }
  }, [isOpen, validServiceType]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setSubmissionError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSubmissionError(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Upload photos to Vercel Blob
      const uploadedPhotoUrls: string[] = [];
      if (formData.photos.length > 0) {
        for (const file of formData.photos) {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', file);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadRes.ok) {
            throw new Error('Failed to upload photo');
          }

          const uploadedData = await uploadRes.json();
          uploadedPhotoUrls.push(uploadedData.url);
        }
      }

      // Create lead
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: formData.service_type,
          property_type: formData.property_type,
          bedrooms: formData.bedrooms,
          heat_pumps_needed: formData.heat_pumps_needed,
          location_to_install: formData.location_to_install,
          existing_unit: formData.existing_unit,
          photos: uploadedPhotoUrls,
          timeline: formData.timeline,
          homeowner_name: formData.homeowner_name,
          phone: formData.phone,
          email: formData.email,
          suburb: formData.suburb,
          consent_given: formData.consent_given,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      const data = await res.json();
      setSubmittedLeadId(data.leadId);
      setCurrentStep(6); // Confirmation screen
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Confirmation screen
  if (currentStep === 6) {
    return (
      <SubmissionConfirmation
        leadId={submittedLeadId || ''}
        onClose={onClose}
      />
    );
  }

  const handleFieldChange = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              Step {currentStep} of 5
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <Step1ServiceType
              value={formData.service_type}
              onChange={(service_type) => handleFieldChange({ service_type })}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2PropertyInfo
              value={{ property_type: formData.property_type, bedrooms: formData.bedrooms }}
              onChange={(updates) => handleFieldChange(updates)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <Step3JobDetails
              value={{
                heat_pumps_needed: formData.heat_pumps_needed,
                location_to_install: formData.location_to_install,
                existing_unit: formData.existing_unit,
                photos: formData.photos,
              }}
              onChange={(updates) => handleFieldChange(updates)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <Step4Timeline
              value={formData.timeline}
              onChange={(timeline) => handleFieldChange({ timeline })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <Step5ContactInfo
              value={{
                homeowner_name: formData.homeowner_name,
                phone: formData.phone,
                email: formData.email,
                suburb: formData.suburb,
                consent_given: formData.consent_given,
              }}
              onChange={(updates) => handleFieldChange(updates)}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              error={submissionError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
