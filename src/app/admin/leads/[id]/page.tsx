'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';

interface Lead {
  id: string;
  service_type: string;
  property_type: string;
  bedrooms: string;
  heat_pumps_needed: string;
  location_to_install: string[];
  location_notes: string;
  existing_unit: string;
  photos: string[];
  timeline: string;
  homeowner_name: string;
  phone: string;
  email: string;
  suburb: string;
  consent_given: boolean;
  status: string;
  admin_notes: string;
  assigned_installers: string[];
  created_at: string;
  updated_at: string;
}

interface Installer {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  primary_suburb: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [selectedInstaller, setSelectedInstaller] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string } | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await fetch(`/api/admin/leads/${leadId}`);
        const data = await res.json();
        setLead(data);
        setNotes(data.admin_notes || '');
        setStatus(data.status);
        if (data.assigned_installers?.length > 0) {
          setSelectedInstaller(data.assigned_installers[0]);
        }
      } catch (error) {
        console.error('Error fetching lead:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchInstallers = async () => {
      try {
        const res = await fetch('/api/admin/installers');
        const data = await res.json();
        setInstallers(data.installers || []);
      } catch (error) {
        console.error('Error fetching installers:', error);
      }
    };

    fetchLead();
    fetchInstallers();
  }, [leadId]);

  const handleSave = async () => {
    if (!lead) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_notes: notes,
          status,
          assigned_installers: selectedInstaller ? [selectedInstaller] : [],
        }),
      });

      if (res.ok) {
        setSuccessModal(true);
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      setErrorModal({
        show: true,
        title: 'Save Failed',
        message: 'There was an error saving the lead. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPhoto = (photoUrl: string) => {
    const a = document.createElement('a');
    a.href = photoUrl;
    // Determine file extension based on URL or default to .jpg
    const extension = photoUrl.includes('.png') ? '.png' : '.jpg';
    a.download = `lead-${leadId}-photo-${photoIndex + 1}${extension}`;
    a.click();
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading lead...</div>;
  }

  if (!lead) {
    return <div className="text-red-600">Lead not found</div>;
  }

  const serviceTypeLabels: Record<string, string> = {
    new_install: 'New Installation',
    replace: 'Replace Existing',
    service: 'Service',
    advice: 'Need Advice',
  };

  const propertyTypeLabels: Record<string, string> = {
    home: 'House',
    apartment: 'Apartment',
    office: 'Office',
    commercial: 'Commercial',
  };

  const timelineLabels: Record<string, string> = {
    asap: 'ASAP (within 1 week)',
    two_weeks: 'Within 2 weeks',
    one_month: 'Within 1 month',
    researching: 'Still researching',
  };

  // Calculate tier based on job size
  const isCommercial = ['office', 'commercial'].includes(lead.property_type);
  const heatsUnits = parseInt(lead.heat_pumps_needed) || 0;
  const isInstallOrReplace = ['new_install', 'replace'].includes(lead.service_type);
  const isService = lead.service_type === 'service';

  let tierClass = 'C';

  // Tier A: Installation/Replace + 3+ units
  if (isInstallOrReplace && heatsUnits >= 3) {
    tierClass = 'A';
  }
  // Tier B: Installation/Replace + 1-2 units, OR Service + 3+ units, OR Commercial Service
  else if (
    (isInstallOrReplace && heatsUnits >= 1 && heatsUnits <= 2) ||
    (isService && heatsUnits >= 3) ||
    (isService && isCommercial)
  ) {
    tierClass = 'B';
  }
  // Tier C: Service/Advice with 1-2 units residential (default)
  const tierColor =
    tierClass === 'A' ? 'bg-emerald-100 text-emerald-800' :
    tierClass === 'B' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/admin/leads" className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block">
            ← Back to Leads
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{lead.homeowner_name}</h1>
          <p className="text-gray-600 mt-2">Lead ID: {leadId.slice(0, 8)}</p>
        </div>
        <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${tierColor}`}>
          Tier {tierClass}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Suburb</p>
                <p className="font-medium text-gray-900">{lead.suburb}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium text-gray-900">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium text-gray-900">{serviceTypeLabels[lead.service_type]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Property Type</p>
                <p className="font-medium text-gray-900">{propertyTypeLabels[lead.property_type]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="font-medium text-gray-900">{lead.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Heat Pumps Needed</p>
                <p className="font-medium text-gray-900">{lead.heat_pumps_needed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="font-medium text-gray-900">{timelineLabels[lead.timeline]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Existing Unit</p>
                <p className="font-medium text-gray-900">
                  {lead.existing_unit === 'yes' ? 'Yes' : lead.existing_unit === 'no' ? 'No' : 'Need Recommendation'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Locations</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lead.location_to_install?.map((loc) => (
                    <span key={loc} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
              {lead.location_notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Location Notes</p>
                  <p className="font-medium text-gray-900 mt-1">{lead.location_notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {lead.photos && lead.photos.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos ({lead.photos.length})</h2>
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img src={lead.photos[photoIndex]} alt={`Photo ${photoIndex + 1}`} className="max-h-96 mx-auto rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
                    disabled={photoIndex === 0}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 rounded-lg font-medium transition disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Photo {photoIndex + 1} of {lead.photos.length}
                  </span>
                  <button
                    onClick={() => setPhotoIndex(Math.min(lead.photos.length - 1, photoIndex + 1))}
                    disabled={photoIndex === lead.photos.length - 1}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 rounded-lg font-medium transition disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
                <button
                  onClick={() => handleDownloadPhoto(lead.photos[photoIndex])}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  📥 Download Current Photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium"
            >
              <option value="new">New</option>
              <option value="allocated">Allocated</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Assign Installer */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Installer</h2>
            <select
              value={selectedInstaller}
              onChange={(e) => setSelectedInstaller(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="">— Unassigned —</option>
              {installers.map((installer) => (
                <option key={installer.id} value={installer.id}>
                  {installer.business_name}
                </option>
              ))}
            </select>
            {selectedInstaller && installers.find((i) => i.id === selectedInstaller) && (
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>{installers.find((i) => i.id === selectedInstaller)?.business_name}</strong>
                </p>
                <p>{installers.find((i) => i.id === selectedInstaller)?.phone}</p>
                <p>{installers.find((i) => i.id === selectedInstaller)?.email}</p>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 h-32 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
          >
            {isSaving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <SuccessModal
          title="Lead Updated"
          subtitle="The lead has been updated successfully"
          onClose={() => setSuccessModal(false)}
        />
      )}

      {/* Error Modal */}
      {errorModal?.show && (
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      )}
    </div>
  );
}
