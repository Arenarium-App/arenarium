-- Simple Drop Script for Arenarium Database
-- This script just drops tables if they exist, no complex logic

-- Drop tables safely (CASCADE will handle dependencies)
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

-- Drop extension if it exists
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
