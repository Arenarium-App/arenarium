-- Drop all existing tables and related objects
-- Run this before executing the new database schema

-- Drop triggers first (if they exist)
DROP TRIGGER IF EXISTS update_games_updated_at ON games;
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
DROP TRIGGER IF EXISTS update_spells_updated_at ON spells;
DROP TRIGGER IF EXISTS update_talents_updated_at ON talents;
DROP TRIGGER IF EXISTS update_emblems_updated_at ON emblems;
DROP TRIGGER IF EXISTS update_items_updated_at ON items;
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
DROP TRIGGER IF EXISTS update_heroes_updated_at ON heroes;
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS heroes CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS emblems CASCADE;
DROP TABLE IF EXISTS talents CASCADE;
DROP TABLE IF EXISTS spells CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop any remaining objects
DROP POLICY IF EXISTS "Allow public read access on games" ON games;
DROP POLICY IF EXISTS "Allow public read access on roles" ON roles;
DROP POLICY IF EXISTS "Allow public read access on spells" ON spells;
DROP POLICY IF EXISTS "Allow public read access on talents" ON talents;
DROP POLICY IF EXISTS "Allow public read access on emblems" ON emblems;
DROP POLICY IF EXISTS "Allow public read access on items" ON items;
DROP POLICY IF EXISTS "Allow public read access on skills" ON skills;
DROP POLICY IF EXISTS "Allow public read access on heroes" ON heroes;
DROP POLICY IF EXISTS "Allow public read access on players" ON players;
DROP POLICY IF EXISTS "Allow public read access on teams" ON teams;
