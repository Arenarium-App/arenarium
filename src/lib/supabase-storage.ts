import { createClientComponentClient } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Use the authenticated client for storage operations
export const getSupabaseClient = () => createClientComponentClient();

// Use service role for admin operations (bypasses RLS)
export const getAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
  }
  
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to regular client.');
    return getSupabaseClient();
  }
  
  // Create admin client with proper configuration
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    }
  });
  
  return adminClient;
};

// Storage bucket names for MLBB MPL
export const STORAGE_BUCKETS = {
  TEAM_LOGOS: 'team-logos',
  PLAYER_PHOTOS: 'player-photos',
  HERO_IMAGES: 'hero-images',
  TOURNAMENT_ASSETS: 'tournament-assets',
  MATCH_SCREENSHOTS: 'match-screenshots',
} as const;

// Upload image to Supabase Storage
export async function uploadImage(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  file: File,
  fileName: string
): Promise<{ path: string; url: string } | null> {
  try {
    // Handle both key (e.g., 'TEAM_LOGOS') and actual bucket name (e.g., 'team-logos')
    const bucketName = typeof bucket === 'string' && bucket.includes('-') 
      ? bucket 
      : STORAGE_BUCKETS[bucket as keyof typeof STORAGE_BUCKETS];
    
    console.log('Debug - uploadImage bucket param:', bucket);
    console.log('Debug - uploadImage bucketName:', bucketName);
    
    // Try API route first (server-side upload)
    try {
      console.log('Debug - Trying API route upload...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucketName);
      formData.append('fileName', fileName);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Debug - API route upload successful');
        return result;
      } else {
        const error = await response.json();
        console.error('API route upload failed:', error);
        throw new Error(error.error || 'API upload failed');
      }
    } catch (apiError) {
      console.warn('API route failed, trying direct admin client:', apiError);
      
      // Fallback to direct admin client
      const supabase = getAdminSupabaseClient();
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${fileName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        path: data.path,
        url: urlData.publicUrl
      };
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Delete image from Supabase Storage
export async function deleteImage(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  filePath: string
): Promise<boolean> {
  try {
    const supabase = getAdminSupabaseClient();
    const bucketName = typeof bucket === 'string' && bucket.includes('-') 
      ? bucket 
      : STORAGE_BUCKETS[bucket as keyof typeof STORAGE_BUCKETS];
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Get image URL from Supabase Storage
export function getImageUrl(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  filePath: string
): string {
  const supabase = getSupabaseClient();
  const bucketName = typeof bucket === 'string' && bucket.includes('-') 
    ? bucket 
    : STORAGE_BUCKETS[bucket as keyof typeof STORAGE_BUCKETS];
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
