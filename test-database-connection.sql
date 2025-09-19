-- Test database connection and basic permissions
-- Run this in your Supabase SQL editor

-- 1. Check current user and role
SELECT 
    current_user,
    current_setting('role'),
    current_setting('application_name');

-- 2. Check if we can access the teams table
SELECT COUNT(*) as total_teams FROM teams;

-- 3. Check a few sample records
SELECT id, team_name, logo FROM teams LIMIT 3;

-- 4. Test if we can perform a simple update
-- This will help identify if the issue is RLS or something else
BEGIN;
  UPDATE teams 
  SET logo = logo 
  WHERE id = 1;
  
  -- Check if the update affected any rows
  SELECT ROW_COUNT();
ROLLBACK;

-- 5. Check table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'teams';

-- 6. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'teams';
