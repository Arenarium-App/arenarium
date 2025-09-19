# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for managing images in your Arenarium project.

## Step 1: Enable Storage in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Enable Storage** if it's not already enabled

## Step 2: Create Storage Buckets

You need to create the following storage buckets. In your Supabase dashboard:

### Create Team Logos Bucket
- **Name**: `team-logos`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Player Photos Bucket
- **Name**: `player-photos`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Hero Images Bucket
- **Name**: `hero-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Item Images Bucket
- **Name**: `item-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Emblem Images Bucket
- **Name**: `emblem-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Talent Images Bucket
- **Name**: `talent-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Spell Images Bucket
- **Name**: `spell-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Create Role Images Bucket
- **Name**: `role-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

## Step 3: Set Storage Policies

For each bucket, you need to set policies. Here are the recommended policies:

### Public Read Policy (for all buckets)
```sql
-- Allow anyone to read images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'bucket-name');
```

### Authenticated Upload Policy (for all buckets)
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bucket-name' AND auth.role() = 'authenticated');
```

### Owner Update/Delete Policy (for all buckets)
```sql
-- Allow users to update/delete their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'bucket-name' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'bucket-name' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 4: Test Image Upload

1. Start your development server: `npm run dev`
2. Go to any page that uses the `ImageUpload` component
3. Click on the upload area and select an image
4. The image should upload to Supabase Storage and display

## Step 5: Update Database Schema (Optional)

If you want to store image URLs in your database, you can update your tables to include image fields:

```sql
-- Example: Add logo field to teams table
ALTER TABLE teams ADD COLUMN logo_url TEXT;

-- Example: Add image field to heroes table
ALTER TABLE heroes ADD COLUMN image_url TEXT;
```

## Troubleshooting

### Common Issues:

1. **"Bucket not found" error**
   - Make sure you've created the bucket with the exact name
   - Check that Storage is enabled in your Supabase project

2. **"Policy violation" error**
   - Ensure you've set the correct storage policies
   - Check that the bucket is public if you want public access

3. **"File too large" error**
   - Check the file size limit in your bucket settings
   - Ensure the file is under 5MB

4. **"Unauthorized" error**
   - Check your Supabase environment variables
   - Ensure you're using the correct API keys

### Testing Storage:

You can test your storage setup by going to the Storage section in your Supabase dashboard and manually uploading a file to see if it works.

## Next Steps

Once Storage is set up, you can:

1. **Replace placeholder images** with real team logos, hero images, etc.
2. **Add image upload functionality** to your admin forms
3. **Implement image optimization** using Supabase's built-in transformations
4. **Set up image CDN** for better performance

## Cost Considerations

- **Supabase Free Tier**: 1GB storage, 2GB bandwidth/month
- **Supabase Pro**: $25/month for 100GB storage, 250GB bandwidth/month
- **Additional storage**: $0.021/GB/month
- **Additional bandwidth**: $0.09/GB

For a small to medium project, the free tier should be sufficient initially.
