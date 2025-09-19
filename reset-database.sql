-- Complete Database Reset Script for Arenarium
-- This script will drop all existing tables and recreate them fresh

-- Step 1: Drop all existing objects
-- Drop triggers first (if they exist) - in reverse order of creation
DROP TRIGGER IF EXISTS update_statistics_updated_at ON statistics;
DROP TRIGGER IF EXISTS update_tournament_brackets_updated_at ON tournament_brackets;
DROP TRIGGER IF EXISTS update_player_performances_updated_at ON player_performances;
DROP TRIGGER IF EXISTS update_games_updated_at ON games;
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
DROP TRIGGER IF EXISTS update_tournament_teams_updated_at ON tournament_teams;
DROP TRIGGER IF EXISTS update_tournaments_updated_at ON tournaments;
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
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS player_performances CASCADE;
DROP TABLE IF EXISTS tournament_brackets CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS tournament_teams CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
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

-- Drop any remaining policies (if they exist)
DROP POLICY IF EXISTS "Allow public read access on statistics" ON statistics;
DROP POLICY IF EXISTS "Allow public read access on tournament_brackets" ON tournament_brackets;
DROP POLICY IF EXISTS "Allow public read access on player_performances" ON player_performances;
DROP POLICY IF EXISTS "Allow public read access on games" ON games;
DROP POLICY IF EXISTS "Allow public read access on matches" ON matches;
DROP POLICY IF EXISTS "Allow public read access on tournament_teams" ON tournament_teams;
DROP POLICY IF EXISTS "Allow public read access on tournaments" ON tournaments;
DROP POLICY IF EXISTS "Allow public read access on roles" ON roles;
DROP POLICY IF EXISTS "Allow public read access on spells" ON spells;
DROP POLICY IF EXISTS "Allow public read access on talents" ON talents;
DROP POLICY IF EXISTS "Allow public read access on emblems" ON emblems;
DROP POLICY IF EXISTS "Allow public read access on items" ON items;
DROP POLICY IF EXISTS "Allow public read access on skills" ON skills;
DROP POLICY IF EXISTS "Allow public read access on heroes" ON heroes;
DROP POLICY IF EXISTS "Allow public read access on players" ON players;
DROP POLICY IF EXISTS "Allow public read access on teams" ON teams;

-- Step 2: Now run the database schema
-- (Copy the contents of database-schema.sql here)
