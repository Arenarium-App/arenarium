'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { STORAGE_BUCKETS } from '@/lib/supabase-storage';

interface AdminImageUploadProps {
  title: string;
  bucket: string;
  currentImageUrl?: string;
  onSave: (imageUrl: string) => void;
}

export default function AdminImageUpload({
  title,
  bucket,
  currentImageUrl,
  onSave
}: AdminImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleSave = async () => {
    if (!imageUrl) {
      alert('Please upload an image first');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(imageUrl);
      alert('Image saved successfully!');
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        <ImageUpload
          bucket={bucket}
          currentImageUrl={currentImageUrl}
          onImageUploaded={handleImageUploaded}
          placeholder={`Click to upload ${bucket.replace('_', ' ')}`}
          size="lg"
        />

        {imageUrl && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Image'}
            </button>
            
            <div className="text-sm text-gray-600">
              <p>Current image URL:</p>
              <p className="font-mono text-xs break-all">{imageUrl}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
