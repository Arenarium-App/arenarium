-- Check RLS policies and table structure for teams table
-- Run this in your Supabase SQL editor

-- 1. Check if RLS is enabled on teams table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'teams';

-- 2. Check current RLS policies on teams table
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

-- 3. Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teams'
ORDER BY ordinal_position;

-- 4. Check if there are any triggers that might interfere
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'teams';

-- 5. Check current user and role
SELECT current_user, current_setting('role');

-- 6. Test basic SELECT access
SELECT COUNT(*) FROM teams;

-- 7. Test basic UPDATE access (this should fail if RLS is blocking)
-- UPDATE teams SET logo = logo WHERE id = 1;
