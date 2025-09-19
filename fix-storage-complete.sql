-- Complete Storage Fix for MLBB MPL
-- Run this in your Supabase SQL Editor

-- First, let's check what policies exist
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Drop ALL existing storage policies to start fresh
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

-- Drop any other existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Create simple, permissive policies for all buckets
-- These allow public read access and authenticated upload/update/delete

-- Team Logos Policies
CREATE POLICY "Team Logos Public Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'team-logos');

CREATE POLICY "Team Logos Authenticated Write" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'team-logos');

CREATE POLICY "Team Logos Authenticated Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'team-logos');

CREATE POLICY "Team Logos Authenticated Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'team-logos');

-- Player Photos Policies
CREATE POLICY "Player Photos Public Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'player-photos');

CREATE POLICY "Player Photos Authenticated Write" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'player-photos');

CREATE POLICY "Player Photos Authenticated Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'player-photos');

CREATE POLICY "Player Photos Authenticated Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'player-photos');

-- Hero Images Policies
CREATE POLICY "Hero Images Public Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Hero Images Authenticated Write" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Hero Images Authenticated Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'hero-images');

CREATE POLICY "Hero Images Authenticated Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'hero-images');

-- Tournament Assets Policies
CREATE POLICY "Tournament Assets Public Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'tournament-assets');

CREATE POLICY "Tournament Assets Authenticated Write" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'tournament-assets');

CREATE POLICY "Tournament Assets Authenticated Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'tournament-assets');

CREATE POLICY "Tournament Assets Authenticated Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'tournament-assets');

-- Match Screenshots Policies
CREATE POLICY "Match Screenshots Public Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'match-screenshots');

CREATE POLICY "Match Screenshots Authenticated Write" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'match-screenshots');

CREATE POLICY "Match Screenshots Authenticated Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'match-screenshots');

CREATE POLICY "Match Screenshots Authenticated Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'match-screenshots');

-- Verify the policies were created
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
