# Image Upload System - Quick Reference

## Overview
Your Arenarium project now has a complete image upload system using Supabase Storage. This allows you to upload and manage images for teams, heroes, items, and more.

## Quick Start

### 1. Access the Admin Panel
- Navigate to `/admin/images` in your browser
- Or click the "Admin" link in the main navigation

### 2. Setup Supabase Storage
Follow the detailed instructions in `SUPABASE_STORAGE_SETUP.md` to:
- Enable Storage in your Supabase project
- Create the required storage buckets
- Set appropriate storage policies

### 3. Test Image Uploads
- Click on any upload area in the admin panel
- Select an image file (JPG, PNG, GIF, max 5MB)
- The image will upload to Supabase Storage
- Copy the generated URL for use in your database

## Components Available

### `ImageUpload` Component
A reusable component for any image upload needs:

```tsx
import { ImageUpload, STORAGE_BUCKETS } from '@/components/ImageUpload';

<ImageUpload
  bucket={STORAGE_BUCKETS.TEAM_LOGOS}
  currentImageUrl={team.logo}
  onImageUploaded={(url) => setTeamLogo(url)}
  placeholder="Click to upload team logo"
  size="md" // sm, md, lg
/>
```

### `AdminImageUpload` Component
A complete admin interface with save functionality:

```tsx
import AdminImageUpload from '@/components/AdminImageUpload';

<AdminImageUpload
  title="Team Logo Upload"
  bucket={STORAGE_BUCKETS.TEAM_LOGOS}
  currentImageUrl={team.logo}
  onSave={(url) => updateTeamLogo(teamId, url)}
/>
```

## Storage Buckets Available

- `team-logos` - Team logos and branding
- `player-photos` - Player profile pictures
- `hero-images` - Hero character images
- `item-images` - In-game item images
- `emblem-images` - Emblem/equipment images
- `talent-images` - Talent tree images
- `spell-images` - Spell/ability images
- `role-images` - Role/class images

## Integration Examples

### Adding to Team Forms
```tsx
// In your team creation/editing form
const [teamLogo, setTeamLogo] = useState(team?.logo || '');

<ImageUpload
  bucket={STORAGE_BUCKETS.TEAM_LOGOS}
  currentImageUrl={teamLogo}
  onImageUploaded={setTeamLogo}
  placeholder="Upload team logo"
/>
```

### Adding to Hero Forms
```tsx
// In your hero creation/editing form
const [heroImage, setHeroImage] = useState(hero?.image || '');

<ImageUpload
  bucket={STORAGE_BUCKETS.HERO_IMAGES}
  currentImageUrl={heroImage}
  onImageUploaded={setHeroImage}
  placeholder="Upload hero image"
/>
```

## File Requirements

- **Supported formats**: JPG, PNG, GIF
- **Maximum size**: 5MB per image
- **Recommended dimensions**: 
  - Team logos: 200x200px or larger
  - Hero images: 400x400px or larger
  - Item images: 100x100px or larger

## Database Integration

After uploading an image, you'll get a URL like:
```
https://your-project.supabase.co/storage/v1/object/public/team-logos/team-logos-1234567890.jpg
```

Store this URL in your database tables:

```sql
-- Example: Add logo_url to teams table
ALTER TABLE teams ADD COLUMN logo_url TEXT;

-- Example: Add image_url to heroes table  
ALTER TABLE heroes ADD COLUMN image_url TEXT;
```

## Troubleshooting

### Common Issues:
1. **"Bucket not found"** - Check bucket names in Supabase dashboard
2. **"Policy violation"** - Ensure storage policies are set correctly
3. **"File too large"** - Check file size (max 5MB)
4. **"Unauthorized"** - Verify Supabase environment variables

### Testing:
- Use the admin panel at `/admin/images` to test uploads
- Check Supabase Storage dashboard for uploaded files
- Verify image URLs are accessible in browser

## Next Steps

1. **Replace placeholder images** with real team logos and hero images
2. **Add image upload to forms** for teams, heroes, items, etc.
3. **Implement image optimization** using Supabase transformations
4. **Add image management** (delete, replace, crop) features

## Support

- Check `SUPABASE_STORAGE_SETUP.md` for detailed setup instructions
- Review the admin panel at `/admin/images` for working examples
- Use browser dev tools to debug any upload issues
