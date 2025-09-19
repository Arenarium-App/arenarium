# MLBB MPL Storage Buckets Setup Guide

## Required Buckets for MLBB MPL

Create these buckets in your Supabase project's Storage section:

### 1. Team Logos Bucket
- **Bucket Name**: `team-logos`
- **Public**: Yes
- **File Size Limit**: 2MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp, image/svg+xml
- **Purpose**: Team logos for MPL teams

### 2. Player Photos Bucket
- **Bucket Name**: `player-photos`
- **Public**: Yes
- **File Size Limit**: 2MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp
- **Purpose**: Player profile photos

### 3. Hero Images Bucket
- **Bucket Name**: `hero-images`
- **Public**: Yes
- **File Size Limit**: 1MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp, image/svg+xml
- **Purpose**: MLBB hero portraits and images

### 4. Tournament Assets Bucket
- **Bucket Name**: `tournament-assets`
- **Public**: Yes
- **File Size Limit**: 5MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp, image/svg+xml
- **Purpose**: Tournament banners, logos, and promotional materials

### 5. Match Screenshots Bucket
- **Bucket Name**: `match-screenshots`
- **Public**: Yes
- **File Size Limit**: 3MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp
- **Purpose**: Match result screenshots and highlights

## Storage Policies

After creating the buckets, add these RLS policies:

```sql
-- Team Logos Policies
CREATE POLICY "Team Logos Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');
CREATE POLICY "Team Logos Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Team Logos Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Team Logos Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

-- Player Photos Policies
CREATE POLICY "Player Photos Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'player-photos');
CREATE POLICY "Player Photos Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'player-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Player Photos Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'player-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Player Photos Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'player-photos' AND auth.role() = 'authenticated');

-- Hero Images Policies
CREATE POLICY "Hero Images Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Hero Images Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Hero Images Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Hero Images Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- Tournament Assets Policies
CREATE POLICY "Tournament Assets Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tournament-assets');
CREATE POLICY "Tournament Assets Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Tournament Assets Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Tournament Assets Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');

-- Match Screenshots Policies
CREATE POLICY "Match Screenshots Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'match-screenshots');
CREATE POLICY "Match Screenshots Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Match Screenshots Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Match Screenshots Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
```

## File Naming Convention for MLBB MPL

### Team Logos
- Format: `{team_code}_{timestamp}.{extension}`
- Example: `EVOS_1703123456.png`, `RRQ_1703123456.png`

### Player Photos
- Format: `{player_ign}_{team_code}_{timestamp}.{extension}`
- Example: `Lemon_RRQ_1703123456.jpg`, `Kabuki_ONIC_1703123456.jpg`

### Hero Images
- Format: `{hero_code}_{timestamp}.{extension}`
- Example: `LAYLA_1703123456.png`, `GUSION_1703123456.png`

### Tournament Assets
- Banners: `banner_{tournament_id}_{timestamp}.{extension}`
- Logos: `logo_{tournament_id}_{timestamp}.{extension}`
- Example: `banner_mpl_id_s12_1703123456.jpg`

### Match Screenshots
- Format: `{match_id}_game_{game_number}_{timestamp}.{extension}`
- Example: `match_123_game_1_1703123456.jpg`
