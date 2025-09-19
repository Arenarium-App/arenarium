-- MLBB MPL Database Setup for Arenarium
-- Run this in your new Supabase project's SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for MLBB
CREATE TYPE tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE tournament_type AS ENUM ('Single Elimination', 'Double Elimination', 'Round Robin', 'Round Robin 2 Legs', 'Complex Tournament');
CREATE TYPE match_status AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
CREATE TYPE team_role AS ENUM ('admin', 'member');
CREATE TYPE hero_role AS ENUM ('Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support');
CREATE TYPE player_status AS ENUM ('active', 'inactive', 'retired');
CREATE TYPE region AS ENUM ('Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Vietnam', 'Thailand', 'Brunei');

-- 1. TEAMS TABLE (MLBB Teams)
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_code VARCHAR(10) NOT NULL UNIQUE,
    logo TEXT,
    region region NOT NULL,
    region_id VARCHAR(10),
    founded_year INTEGER,
    coach_name VARCHAR(100),
    manager_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PLAYERS TABLE (MLBB Players)
CREATE TABLE players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    real_name VARCHAR(100) NOT NULL,
    in_game_name VARCHAR(50) NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    player_photo TEXT,
    role hero_role NOT NULL,
    status player_status DEFAULT 'active',
    join_date DATE,
    country VARCHAR(50),
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HEROES TABLE (MLBB Heroes)
CREATE TABLE heroes (
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

-- 4. TOURNAMENTS TABLE (MLBB Tournaments)
CREATE TABLE tournaments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    banner TEXT,
    logo TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status tournament_status DEFAULT 'upcoming',
    tournament_type tournament_type NOT NULL,
    prize_pool DECIMAL(12,2),
    entry_fee DECIMAL(8,2),
    max_teams INTEGER,
    min_teams INTEGER,
    format_config JSONB,
    has_multiple_stages BOOLEAN DEFAULT false,
    season VARCHAR(20), -- e.g., "Season 12", "MPL ID S12"
    patch_version VARCHAR(20), -- e.g., "1.8.88"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TOURNAMENT_STAGES TABLE
CREATE TABLE tournament_stages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    format_type tournament_type NOT NULL,
    format_config JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TOURNAMENT_TEAMS TABLE
CREATE TABLE tournament_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    seed INTEGER,
    final_position INTEGER,
    prize_money DECIMAL(10,2),
    group_name VARCHAR(20), -- For group stage tournaments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- 7. MATCHES TABLE
CREATE TABLE matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES tournament_stages(id) ON DELETE CASCADE,
    team1_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    team2_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    status match_status DEFAULT 'scheduled',
    round_name VARCHAR(50),
    match_order INTEGER,
    best_of INTEGER DEFAULT 3, -- Best of 3, 5, etc.
    stream_url TEXT,
    venue VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. GAMES TABLE (Individual games within a match)
CREATE TABLE games (
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

-- 9. GAME_STATS TABLE (Player performance in each game)
CREATE TABLE game_stats (
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

-- 10. STATISTICS TABLE (Tournament standings)
CREATE TABLE statistics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    matches_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0, -- Total kills
    goals_against INTEGER DEFAULT 0, -- Total deaths
    goal_difference INTEGER DEFAULT 0, -- Kill difference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- 11. USERS TABLE (for admin authentication)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    role team_role DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. TEAM_MEMBERS TABLE
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role team_role DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_teams_region ON teams(region);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_role ON players(role);
CREATE INDEX idx_heroes_role ON heroes(role);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_season ON tournaments(season);
CREATE INDEX idx_tournaments_type ON tournaments(tournament_type);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournament_stages_tournament ON tournament_stages(tournament_id);
CREATE INDEX idx_tournament_teams_tournament ON tournament_teams(tournament_id);
CREATE INDEX idx_tournament_teams_team ON tournament_teams(team_id);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_stage ON matches(stage_id);
CREATE INDEX idx_matches_teams ON matches(team1_id, team2_id);
CREATE INDEX idx_matches_scheduled ON matches(scheduled_time);
CREATE INDEX idx_games_match ON games(match_id);
CREATE INDEX idx_game_stats_game ON game_stats(game_id);
CREATE INDEX idx_game_stats_player ON game_stats(player_id);
CREATE INDEX idx_statistics_tournament ON statistics(tournament_id);
CREATE INDEX idx_statistics_team ON statistics(team_id);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, customize as needed)
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on heroes" ON heroes FOR ALL USING (true);
CREATE POLICY "Allow all operations on tournaments" ON tournaments FOR ALL USING (true);
CREATE POLICY "Allow all operations on tournament_stages" ON tournament_stages FOR ALL USING (true);
CREATE POLICY "Allow all operations on tournament_teams" ON tournament_teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_stats" ON game_stats FOR ALL USING (true);
CREATE POLICY "Allow all operations on statistics" ON statistics FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON heroes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_stages_updated_at BEFORE UPDATE ON tournament_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_teams_updated_at BEFORE UPDATE ON tournament_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_stats_updated_at BEFORE UPDATE ON game_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample MLBB MPL teams
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
('Blacklist International', 'BLCK', 'Philippines', 2019, 'MobaZane');

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
('Chou', 'CHOU', 'Fighter', 3, true);

-- Insert sample MPL tournament
INSERT INTO tournaments (name, description, start_date, end_date, tournament_type, prize_pool, max_teams, season, patch_version, format_config) VALUES
('MPL Indonesia Season 12', 'Mobile Legends Professional League Indonesia Season 12', 
 NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', 'Round Robin', 150000.00, 8, 'Season 12', '1.8.88',
 '{"round_names": ["Regular Season", "Playoffs", "Grand Final"], "seeding_rules": "performance", "bye_rules": "none", "points_system": "3-1-0"}');

-- Get the tournament ID for stage creation
DO $$
DECLARE
    tournament_uuid UUID;
BEGIN
    SELECT id INTO tournament_uuid FROM tournaments WHERE name = 'MPL Indonesia Season 12';
    
    -- Insert tournament stage
    INSERT INTO tournament_stages (tournament_id, stage_name, stage_order, format_type, format_config) VALUES
    (tournament_uuid, 'Regular Season', 1, 'Round Robin', 
     '{"round_names": ["Regular Season", "Playoffs", "Grand Final"], "seeding_rules": "performance", "bye_rules": "none", "points_system": "3-1-0"}');
END $$;

-- Insert sample tournament teams
INSERT INTO tournament_teams (tournament_id, team_id, seed)
SELECT t.id, tm.id, ROW_NUMBER() OVER (ORDER BY RANDOM())
FROM tournaments t
CROSS JOIN teams tm
WHERE t.name = 'MPL Indonesia Season 12'
LIMIT 8;

-- Create a view for tournament details with team counts
CREATE VIEW tournament_details AS
SELECT 
    t.*,
    COUNT(DISTINCT ts.id) as stages_count,
    COUNT(DISTINCT tt.team_id) as teams_count,
    COUNT(DISTINCT m.id) as matches_count
FROM tournaments t
LEFT JOIN tournament_stages ts ON t.id = ts.tournament_id
LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
LEFT JOIN matches m ON t.id = m.tournament_id
GROUP BY t.id;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
