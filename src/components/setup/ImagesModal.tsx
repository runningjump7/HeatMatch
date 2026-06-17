'use client';

import { useState } from 'react';

interface Props {
  profile: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ImagesModal({ profile, onClose, onSave }: Props) {
  const [images, setImages] = useState<string[]>(profile.images || []);
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput]);
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/installer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: profile.business_name,
          phone: profile.phone,
          years_in_business: profile.years_in_business,
          bio: profile.bio,
          images,
          profile_active: profile.profile_active,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      onSave();
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Images</h3>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Add Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-600"
                placeholder="Paste image URL"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Add at least 1 before/after image</p>
          </div>

          {images.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Images ({images.length})</label>
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`image-${idx}`} className="w-full h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || images.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
