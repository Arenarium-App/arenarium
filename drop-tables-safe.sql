-- Safe Drop Script for Arenarium Database
-- This script will only drop tables that exist, preventing errors

-- First, let's check what tables actually exist and drop them safely
DO $$
DECLARE
    table_name text;
    trigger_name text;
    policy_name text;
BEGIN
    -- Drop triggers for tables that exist
    FOR table_name IN 
        SELECT unnest(ARRAY[
            'statistics', 'tournament_brackets', 'player_performances', 
            'games', 'matches', 'tournament_teams', 'tournaments',
            'skills', 'players', 'heroes', 'items', 'emblems', 
            'talents', 'spells', 'roles', 'teams'
        ])
    LOOP
        -- Drop triggers if they exist
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I', table_name, table_name);
    END LOOP;

    -- Drop policies for tables that exist
    FOR table_name IN 
        SELECT unnest(ARRAY[
            'statistics', 'tournament_brackets', 'player_performances', 
            'games', 'matches', 'tournament_teams', 'tournaments',
            'skills', 'players', 'heroes', 'items', 'emblems', 
            'talents', 'spells', 'roles', 'teams'
        ])
    LOOP
        -- Drop policies if they exist
        EXECUTE format('DROP POLICY IF EXISTS "Allow public read access on %s" ON %I', table_name, table_name);
    END LOOP;
END $$;

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

-- Clean up any remaining objects
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
