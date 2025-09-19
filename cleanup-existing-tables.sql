-- Cleanup script to remove existing tables before MLBB MPL setup
-- WARNING: This will delete all existing data!
-- Run this ONLY if you want to start fresh with MLBB MPL

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS tournament_teams CASCADE;
DROP TABLE IF EXISTS tournament_stages CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS tournament_status CASCADE;
DROP TYPE IF EXISTS tournament_type CASCADE;
DROP TYPE IF EXISTS match_status CASCADE;
DROP TYPE IF EXISTS team_role CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS tournament_details CASCADE;

-- Note: After running this, you can run the MLBB MPL setup script
