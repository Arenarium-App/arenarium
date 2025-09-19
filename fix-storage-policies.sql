-- Fix Storage RLS Policies for MLBB MPL
-- Run this in your Supabase SQL Editor

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Team Logos Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Team Logos Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Team Logos Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Team Logos Authenticated Delete" ON storage.objects;

DROP POLICY IF EXISTS "Player Photos Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Player Photos Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Player Photos Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Player Photos Authenticated Delete" ON storage.objects;

DROP POLICY IF EXISTS "Hero Images Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Hero Images Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Hero Images Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Hero Images Authenticated Delete" ON storage.objects;

DROP POLICY IF EXISTS "Tournament Assets Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Tournament Assets Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Tournament Assets Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Tournament Assets Authenticated Delete" ON storage.objects;

DROP POLICY IF EXISTS "Match Screenshots Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Match Screenshots Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Match Screenshots Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Match Screenshots Authenticated Delete" ON storage.objects;

-- Create new policies for Team Logos
CREATE POLICY "Team Logos Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');
CREATE POLICY "Team Logos Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Team Logos Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Team Logos Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

-- Create new policies for Player Photos
CREATE POLICY "Player Photos Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'player-photos');
CREATE POLICY "Player Photos Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'player-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Player Photos Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'player-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Player Photos Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'player-photos' AND auth.role() = 'authenticated');

-- Create new policies for Hero Images
CREATE POLICY "Hero Images Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Hero Images Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Hero Images Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Hero Images Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- Create new policies for Tournament Assets
CREATE POLICY "Tournament Assets Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tournament-assets');
CREATE POLICY "Tournament Assets Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Tournament Assets Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Tournament Assets Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'tournament-assets' AND auth.role() = 'authenticated');

-- Create new policies for Match Screenshots
CREATE POLICY "Match Screenshots Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'match-screenshots');
CREATE POLICY "Match Screenshots Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Match Screenshots Authenticated Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Match Screenshots Authenticated Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
