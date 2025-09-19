# Complete Supabase Setup Guide for Arenarium

## Step 1: Database Setup

1. **Go to your new Supabase project**
2. **Navigate to SQL Editor**
3. **Copy and paste the entire contents of `database-setup-complete.sql`**
4. **Click "Run" to execute the script**

This will create:
- All necessary tables (teams, tournaments, matches, etc.)
- Proper indexes for performance
- Row Level Security (RLS) policies
- Sample data for testing

## Step 2: Storage Buckets Setup

1. **Go to Storage in your Supabase dashboard**
2. **Create these buckets:**

### Bucket 1: Team Logos
- Name: `team-logos`
- Public: ✅ Yes
- File size limit: 2MB
- Allowed types: image/jpeg, image/png, image/webp, image/svg+xml

### Bucket 2: Tournament Assets
- Name: `tournament-assets`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed types: image/jpeg, image/png, image/webp, image/svg+xml

### Bucket 3: User Avatars (Optional)
- Name: `user-avatars`
- Public: ✅ Yes
- File size limit: 1MB
- Allowed types: image/jpeg, image/png, image/webp

## Step 3: Storage Policies

After creating buckets, go to **Storage > Policies** and add these policies:

```sql
-- Team Logos Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

-- Tournament Assets Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tournament-assets');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
```

## Step 4: Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Arenarium

# Storage Configuration
NEXT_PUBLIC_STORAGE_URL=your_supabase_project_url/storage/v1/object/public
```

**To get these values:**
1. Go to **Settings > API** in your Supabase dashboard
2. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy the **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 5: Authentication Setup (Optional)

If you want to add user authentication:

1. **Go to Authentication > Settings**
2. **Enable Email authentication**
3. **Configure email templates** (optional)
4. **Set up OAuth providers** (Google, Discord, etc.) if needed

## Step 6: Test Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit:** `http://localhost:3000`

3. **Check if you can see:**
   - Sample tournaments
   - Sample teams
   - Tournament bracket functionality

## Step 7: Admin Access

To create an admin user:

1. **Go to Authentication > Users**
2. **Click "Add user"**
3. **Set role to "admin" in the database:**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

## Troubleshooting

### Common Issues:

1. **"relation does not exist" error:**
   - Make sure you ran the complete SQL script
   - Check if all tables were created in the Table Editor

2. **Storage upload fails:**
   - Verify bucket policies are set correctly
   - Check file size limits
   - Ensure MIME types are allowed

3. **RLS policy errors:**
   - Make sure RLS is enabled on tables
   - Check if policies are created correctly

4. **Environment variable issues:**
   - Restart your development server after changing `.env.local`
   - Double-check the Supabase URL and keys

## Next Steps

After setup is complete, you can:
1. **Add more sample data** through the Supabase dashboard
2. **Customize the UI** to match your brand
3. **Set up additional game-specific databases** (Valorant, CS2, etc.)
4. **Configure advanced features** like real-time updates, notifications, etc.
