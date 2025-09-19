# Supabase Storage Buckets Setup Guide

## Required Buckets

Create these buckets in your Supabase project's Storage section:

### 1. Team Logos Bucket
- **Bucket Name**: `team-logos`
- **Public**: Yes (so logos can be displayed publicly)
- **File Size Limit**: 2MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp, image/svg+xml

### 2. Tournament Assets Bucket
- **Bucket Name**: `tournament-assets`
- **Public**: Yes
- **File Size Limit**: 5MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp, image/svg+xml

### 3. User Avatars Bucket (Optional)
- **Bucket Name**: `user-avatars`
- **Public**: Yes
- **File Size Limit**: 1MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp

## Storage Policies

After creating the buckets, add these RLS policies:

### Team Logos Bucket Policies
```sql
-- Allow anyone to view team logos
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');

-- Allow authenticated users to upload team logos
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

-- Allow authenticated users to update team logos
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete team logos
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
```

### Tournament Assets Bucket Policies
```sql
-- Allow anyone to view tournament assets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tournament-assets');

-- Allow authenticated users to upload tournament assets
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to update tournament assets
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete tournament assets
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
```

## File Naming Convention

### Team Logos
- Format: `{team_code}_{timestamp}.{extension}`
- Example: `EG_1703123456.png`

### Tournament Assets
- Banners: `banner_{tournament_id}_{timestamp}.{extension}`
- Logos: `logo_{tournament_id}_{timestamp}.{extension}`
- Example: `banner_123e4567-e89b-12d3-a456-426614174000_1703123456.jpg`
