'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImage, STORAGE_BUCKETS } from '@/lib/supabase-storage';

interface ImageUploadProps {
  bucket: string;
  currentImageUrl?: string;
  onImageUploaded?: (imageUrl: string) => void;
  onSave?: (imageUrl: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function ImageUpload({
  bucket,
  currentImageUrl,
  onImageUploaded,
  onSave,
  placeholder = 'Click to upload image',
  className = '',
  size = 'md',
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setIsUploading(true);
    try {
      console.log('Debug - bucket:', bucket);
      
      // bucket is already the actual bucket name (e.g., 'team-logos')
      const fileName = `${bucket}-${Date.now()}`;
      console.log('Debug - fileName:', fileName);
      
      const result = await uploadImage(bucket, file, fileName);
      
      if (result) {
        console.log('✅ Image upload successful:', result.url)
        if (onImageUploaded) onImageUploaded(result.url);
        if (onSave) {
          console.log('📞 Calling onSave callback with URL:', result.url)
          onSave(result.url);
        }
        setPreviewUrl(result.url);
      } else {
        console.error('❌ Image upload failed - no result returned')
        alert('Failed to upload image. Please try again.');
        setPreviewUrl(currentImageUrl || null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className}`}>
      <div
        className={`${sizeClasses[size]} relative border-2 border-dashed border-gray-300 rounded-lg transition-colors ${
          isUploading ? 'opacity-50' : ''
        } ${
          disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-100' 
            : 'cursor-pointer hover:border-gray-400'
        }`}
        onClick={disabled ? undefined : handleClick}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-8 w-8 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-xs">{placeholder}</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-white text-sm">Uploading...</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {onSave && previewUrl && previewUrl !== currentImageUrl && (
        <div className="mt-3">
          <button
            onClick={() => onSave(previewUrl)}
            disabled={disabled}
            className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Save Logo
          </button>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        <p>Click to upload image</p>
        <p>Max size: 5MB • Supported: JPG, PNG, GIF</p>
      </div>
    </div>
  );
}
