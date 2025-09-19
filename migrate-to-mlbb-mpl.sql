-- Migration script to add MLBB MPL tables to existing database
-- This preserves existing data and adds MLBB-specific functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create MLBB-specific types (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hero_role') THEN
        CREATE TYPE hero_role AS ENUM ('Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'region') THEN
        CREATE TYPE region AS ENUM ('Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Vietnam', 'Thailand', 'Brunei');
    END IF;
END $$;

-- Add MLBB-specific columns to existing teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS coach_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS manager_name VARCHAR(100);

-- Update teams table to use region enum if it exists
-- (This is optional - you can keep the existing region column as text)

-- Create MLBB-specific tables
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    real_name VARCHAR(100) NOT NULL,
    in_game_name VARCHAR(50) NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    player_photo TEXT,
    role hero_role NOT NULL,
    status 'active' | 'inactive' | 'retired' DEFAULT 'active',
    join_date DATE,
    country VARCHAR(50),
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS heroes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hero_name VARCHAR(50) NOT NULL UNIQUE,
    hero_code VARCHAR(20) NOT NULL UNIQUE,
    hero_img TEXT,
    role hero_role NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 3),
    is_meta BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add MLBB-specific columns to existing tournaments table
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS season VARCHAR(20),
ADD COLUMN IF NOT EXISTS patch_version VARCHAR(20);

-- Add MLBB-specific columns to existing matches table
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS best_of INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS stream_url TEXT,
ADD COLUMN IF NOT EXISTS venue VARCHAR(100);

-- Create MLBB-specific tables
CREATE TABLE IF NOT EXISTS games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    game_number INTEGER NOT NULL,
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    winner_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    duration INTEGER, -- Duration in seconds
    patch_version VARCHAR(20),
    game_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    hero_id UUID REFERENCES heroes(id) ON DELETE CASCADE,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    damage_dealt INTEGER DEFAULT 0,
    damage_taken INTEGER DEFAULT 0,
    turret_damage INTEGER DEFAULT 0,
    jungle_monsters_killed INTEGER DEFAULT 0,
    minions_killed INTEGER DEFAULT 0,
    mvp BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for MLBB tables
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_role ON players(role);
CREATE INDEX IF NOT EXISTS idx_heroes_role ON heroes(role);
CREATE INDEX IF NOT EXISTS idx_games_match ON games(match_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_game ON game_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_player ON game_stats(player_id);

-- Enable RLS for new tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on heroes" ON heroes FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_stats" ON game_stats FOR ALL USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers for new tables
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON heroes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_stats_updated_at BEFORE UPDATE ON game_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample MLBB heroes
INSERT INTO heroes (hero_name, hero_code, role, difficulty_level, is_meta) VALUES
('Layla', 'LAYLA', 'Marksman', 1, true),
('Miya', 'MIYA', 'Marksman', 1, true),
('Alucard', 'ALUCARD', 'Fighter', 2, false),
('Tigreal', 'TIGREAL', 'Tank', 1, true),
('Eudora', 'EUDORA', 'Mage', 1, true),
('Saber', 'SABER', 'Assassin', 2, true),
('Akai', 'AKAI', 'Tank', 2, true),
('Alice', 'ALICE', 'Mage', 3, true),
('Franco', 'FRANCO', 'Tank', 2, true),
('Bruno', 'BRUNO', 'Marksman', 2, true),
('Claude', 'CLAUDE', 'Marksman', 3, true),
('Gusion', 'GUSION', 'Assassin', 3, true),
('Lancelot', 'LANCELOT', 'Assassin', 3, true),
('Kagura', 'KAGURA', 'Mage', 3, true),
('Chou', 'CHOU', 'Fighter', 3, true)
ON CONFLICT (hero_name) DO NOTHING;

-- Insert sample MPL teams (only if they don't exist)
INSERT INTO teams (team_name, team_code, region, founded_year, coach_name) VALUES
('EVOS Legends', 'EVOS', 'Indonesia', 2017, 'Zeys'),
('RRQ Hoshi', 'RRQ', 'Indonesia', 2013, 'Lemon'),
('ONIC Esports', 'ONIC', 'Indonesia', 2018, 'Kabuki'),
('Alter Ego', 'AE', 'Indonesia', 2020, 'Lucky'),
('Bigetron Alpha', 'BTR', 'Indonesia', 2018, 'Lucky'),
('Todak', 'TODAK', 'Malaysia', 2017, 'MobaZane'),
('Team Secret', 'TS', 'Malaysia', 2017, 'MobaZane'),
('RSG MY', 'RSG', 'Malaysia', 2019, 'MobaZane'),
('Bren Esports', 'BREN', 'Philippines', 2017, 'MobaZane'),
('Blacklist International', 'BLCK', 'Philippines', 2019, 'MobaZane')
ON CONFLICT (team_code) DO NOTHING;

-- Insert sample MPL tournament
INSERT INTO tournaments (name, description, start_date, end_date, tournament_type, prize_pool, max_teams, season, patch_version, format_config) VALUES
('MPL Indonesia Season 12', 'Mobile Legends Professional League Indonesia Season 12', 
 NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', 'Round Robin', 150000.00, 8, 'Season 12', '1.8.88',
 '{"round_names": ["Regular Season", "Playoffs", "Grand Final"], "seeding_rules": "performance", "bye_rules": "none", "points_system": "3-1-0"}')
ON CONFLICT DO NOTHING;

-- Get the tournament ID for stage creation
DO $$
DECLARE
    tournament_uuid UUID;
BEGIN
    SELECT id INTO tournament_uuid FROM tournaments WHERE name = 'MPL Indonesia Season 12' LIMIT 1;
    
    IF tournament_uuid IS NOT NULL THEN
        -- Insert tournament stage
        INSERT INTO tournament_stages (tournament_id, stage_name, stage_order, format_type, format_config) VALUES
        (tournament_uuid, 'Regular Season', 1, 'Round Robin', 
         '{"round_names": ["Regular Season", "Playoffs", "Grand Final"], "seeding_rules": "performance", "bye_rules": "none", "points_system": "3-1-0"}')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample tournament teams
INSERT INTO tournament_teams (tournament_id, team_id, seed)
SELECT t.id, tm.id, ROW_NUMBER() OVER (ORDER BY RANDOM())
FROM tournaments t
CROSS JOIN teams tm
WHERE t.name = 'MPL Indonesia Season 12'
AND tm.team_code IN ('EVOS', 'RRQ', 'ONIC', 'AE', 'BTR', 'TODAK', 'TS', 'RSG')
ON CONFLICT (tournament_id, team_id) DO NOTHING;
