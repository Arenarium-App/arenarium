-- Fix RLS policies for teams table to allow logo updates
-- Run this in your Supabase SQL editor after checking the current policies

-- 1. First, let's see what we're working with
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'teams';

-- 2. Drop existing restrictive policies (if any)
DROP POLICY IF EXISTS "Enable read access for all users" ON teams;
DROP POLICY IF EXISTS "Enable update access for all users" ON teams;
DROP POLICY IF EXISTS "Enable insert access for all users" ON teams;
DROP POLICY IF EXISTS "Enable delete access for all users" ON teams;

-- 3. Create new policies that allow public access
-- Read access for all users
CREATE POLICY "Enable read access for all users" ON teams
    FOR SELECT USING (true);

-- Update access for all users (needed for logo updates)
CREATE POLICY "Enable update access for all users" ON teams
    FOR UPDATE USING (true) WITH CHECK (true);

-- Insert access for all users
CREATE POLICY "Enable insert access for all users" ON teams
    FOR INSERT WITH CHECK (true);

-- Delete access for all users (optional, but good to have)
CREATE POLICY "Enable delete access for all users" ON teams
    FOR DELETE USING (true);

-- 4. Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'teams';

-- 5. Test a simple update to verify it works
UPDATE teams 
SET logo = 'https://via.placeholder.com/150x150/FF0000/FFFFFF?text=TEST' 
WHERE id = 1;

-- 6. Verify the update worked
SELECT id, team_name, logo FROM teams WHERE id = 1;

-- 7. Reset the logo back to original (optional)
UPDATE teams 
SET logo = 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=EVOS' 
WHERE id = 1;

-- 8. Final verification
SELECT id, team_name, logo FROM teams WHERE id = 1;
