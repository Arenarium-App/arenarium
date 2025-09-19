-- Simple database test script
-- Run this in Supabase SQL Editor to verify everything is working

-- 1. Test basic connectivity
SELECT 'Database connection successful' as status;

-- 2. Check if teams table exists and has data
SELECT 
    'Teams table check' as test,
    COUNT(*) as total_teams,
    COUNT(logo) as teams_with_logos,
    COUNT(*) - COUNT(logo) as teams_without_logos
FROM teams;

-- 3. Show sample team data
SELECT id, team_name, team_code, logo, region
FROM teams 
ORDER BY id 
LIMIT 5;

-- 4. Test a simple update operation
UPDATE teams 
SET logo = 'https://via.placeholder.com/150x150/00FF00/FFFFFF?text=UPDATED' 
WHERE id = 1;

-- 5. Verify the update
SELECT id, team_name, logo 
FROM teams 
WHERE id = 1;

-- 6. Reset the logo back to original
UPDATE teams 
SET logo = 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=EVOS' 
WHERE id = 1;

-- 7. Final verification
SELECT id, team_name, logo 
FROM teams 
WHERE id = 1;

-- 8. Check RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS Enabled'
        ELSE 'RLS Disabled'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'teams';

-- 9. Check policies
SELECT 
    policyname, 
    cmd, 
    permissive,
    CASE 
        WHEN permissive THEN 'Permissive'
        ELSE 'Restrictive'
    END as policy_type
FROM pg_policies 
WHERE tablename = 'teams';
