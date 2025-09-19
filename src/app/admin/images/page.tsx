'use client';
import { useState, useEffect } from 'react';
import AdminImageUpload from '@/components/AdminImageUpload';
import { STORAGE_BUCKETS, supabase } from '@/lib/supabase-storage';

export default function AdminImagesPage() {
  const [savedImages, setSavedImages] = useState<Record<string, string>>({});
  const [buckets, setBuckets] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Test Supabase connection and list buckets
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error listing buckets:', error);
          setConnectionStatus(`Error: ${error.message}`);
        } else {
          setBuckets(data.map(bucket => bucket.name));
          setConnectionStatus('Connected successfully');
        }
      } catch (err) {
        console.error('Connection error:', err);
        setConnectionStatus(`Connection failed: ${err}`);
      }
    };

    testConnection();
  }, []);

  const handleSaveImage = async (bucket: string, imageUrl: string) => {
    // In a real app, you would save this to your database
    setSavedImages(prev => ({
      ...prev,
      [bucket]: imageUrl
    }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Saved image for ${bucket}:`, imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
          <p className="mt-2 text-gray-600">
            Upload and manage images for teams, heroes, items, and more
          </p>
        </div>

        {/* Debug Section */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Debug Information</h3>
          <div className="text-yellow-800 space-y-2">
            <p><strong>Connection Status:</strong> {connectionStatus}</p>
            <p><strong>Available Buckets:</strong> {buckets.length > 0 ? buckets.join(', ') : 'None found'}</p>
            <p><strong>Expected Buckets:</strong> {Object.values(STORAGE_BUCKETS).join(', ')}</p>
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminImageUpload
            title="Team Logo Upload"
            bucket={STORAGE_BUCKETS.TEAM_LOGOS}
            currentImageUrl={savedImages[STORAGE_BUCKETS.TEAM_LOGOS]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.TEAM_LOGOS, url)}
          />

          <AdminImageUpload
            title="Player Photo Upload"
            bucket={STORAGE_BUCKETS.PLAYER_PHOTOS}
            currentImageUrl={savedImages[STORAGE_BUCKETS.PLAYER_PHOTOS]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.PLAYER_PHOTOS, url)}
          />

          <AdminImageUpload
            title="Hero Image Upload"
            bucket={STORAGE_BUCKETS.HERO_IMAGES}
            currentImageUrl={savedImages[STORAGE_BUCKETS.HERO_IMAGES]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.HERO_IMAGES, url)}
          />

          <AdminImageUpload
            title="Item Image Upload"
            bucket={STORAGE_BUCKETS.ITEM_IMAGES}
            currentImageUrl={savedImages[STORAGE_BUCKETS.ITEM_IMAGES]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.ITEM_IMAGES, url)}
          />

          <AdminImageUpload
            title="Emblem Image Upload"
            bucket={STORAGE_BUCKETS.EMBLEM_IMAGES}
            currentImageUrl={savedImages[STORAGE_BUCKETS.EMBLEM_IMAGES]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.EMBLEM_IMAGES, url)}
          />

          <AdminImageUpload
            title="Talent Image Upload"
            bucket={STORAGE_BUCKETS.TALENT_IMAGES}
            currentImageUrl={savedImages[STORAGE_BUCKETS.TALENT_IMAGES]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.TALENT_IMAGES, url)}
          />

          <AdminImageUpload
            title="Spell Image Upload"
            bucket={STORAGE_BUCKETS.SPELL_IMAGES}
            currentImageUrl={savedImages[STORAGE_BUCKETS.SPELL_IMAGES]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.SPELL_IMAGES, url)}
          />

          <AdminImageUpload
            title="Role Image Upload"
            bucket={STORAGE_BUCKETS.ROLE_IMAGES}
            currentImageUrl={savedImages[STORAGE_BUCKETS.ROLE_IMAGES]}
            onSave={(url) => handleSaveImage(STORAGE_BUCKETS.ROLE_IMAGES, url)}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. <strong>Setup Supabase Storage:</strong> Follow the instructions in <code className="bg-blue-100 px-2 py-1 rounded">SUPABASE_STORAGE_SETUP.md</code></p>
            <p>2. <strong>Create Storage Buckets:</strong> Set up the required buckets in your Supabase dashboard</p>
            <p>3. <strong>Configure Policies:</strong> Set the appropriate storage policies for public access</p>
            <p>4. <strong>Test Upload:</strong> Click on any upload area above to test image uploads</p>
            <p>5. <strong>Integrate:</strong> Use the <code className="bg-blue-100 px-2 py-1 rounded">ImageUpload</code> component in your forms</p>
          </div>
        </div>

        {/* Current Images */}
        {Object.keys(savedImages).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(savedImages).map(([bucket, url]) => (
                <div key={bucket} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{bucket.replace('-', ' ')}</h4>
                  <div className="text-xs text-gray-500 break-all mb-2">{url}</div>
                  <button
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
