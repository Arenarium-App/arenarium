-- Complete Database Setup for Arenarium Esports Tournament Platform
-- Run this in your new Supabase project's SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE tournament_type AS ENUM ('Single Elimination', 'Double Elimination', 'Round Robin', 'Round Robin 2 Legs', 'Complex Tournament');
CREATE TYPE match_status AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
CREATE TYPE team_role AS ENUM ('admin', 'member');

-- 1. TEAMS TABLE
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_code VARCHAR(10) NOT NULL UNIQUE,
    logo TEXT,
    region VARCHAR(50),
    region_id VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TOURNAMENTS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TOURNAMENT_STAGES TABLE
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

-- 4. TOURNAMENT_TEAMS TABLE
CREATE TABLE tournament_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    seed INTEGER,
    final_position INTEGER,
    prize_money DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- 5. MATCHES TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. STATISTICS TABLE
CREATE TABLE statistics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    matches_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    goal_difference INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- 7. USERS TABLE (for admin authentication)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    role team_role DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TEAM_MEMBERS TABLE
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role team_role DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_type ON tournaments(tournament_type);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournament_stages_tournament ON tournament_stages(tournament_id);
CREATE INDEX idx_tournament_teams_tournament ON tournament_teams(tournament_id);
CREATE INDEX idx_tournament_teams_team ON tournament_teams(team_id);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_stage ON matches(stage_id);
CREATE INDEX idx_matches_teams ON matches(team1_id, team2_id);
CREATE INDEX idx_matches_scheduled ON matches(scheduled_time);
CREATE INDEX idx_statistics_tournament ON statistics(tournament_id);
CREATE INDEX idx_statistics_team ON statistics(team_id);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, customize as needed)
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on tournaments" ON tournaments FOR ALL USING (true);
CREATE POLICY "Allow all operations on tournament_stages" ON tournament_stages FOR ALL USING (true);
CREATE POLICY "Allow all operations on tournament_teams" ON tournament_teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
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
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_stages_updated_at BEFORE UPDATE ON tournament_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_teams_updated_at BEFORE UPDATE ON tournament_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO teams (team_name, team_code, region, region_id) VALUES
('Evil Geniuses', 'EG', 'North America', 'NA'),
('Team Liquid', 'TL', 'North America', 'NA'),
('Cloud9', 'C9', 'North America', 'NA'),
('TSM', 'TSM', 'North America', 'NA'),
('G2 Esports', 'G2', 'Europe', 'EU'),
('Fnatic', 'FNC', 'Europe', 'EU'),
('T1', 'T1', 'Korea', 'KR'),
('Gen.G', 'GEN', 'Korea', 'KR'),
('EDward Gaming', 'EDG', 'China', 'CN'),
('FunPlus Phoenix', 'FPX', 'China', 'CN');

-- Insert sample tournament
INSERT INTO tournaments (name, description, start_date, end_date, tournament_type, prize_pool, max_teams, format_config) VALUES
('Arenarium Championship 2024', 'The ultimate esports tournament featuring the best teams from around the world', 
 NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days', 'Single Elimination', 100000.00, 16,
 '{"round_names": ["Round of 16", "Quarter Finals", "Semi Finals", "Grand Final"], "seeding_rules": "random", "bye_rules": "none"}');

-- Get the tournament ID for stage creation
DO $$
DECLARE
    tournament_uuid UUID;
BEGIN
    SELECT id INTO tournament_uuid FROM tournaments WHERE name = 'Arenarium Championship 2024';
    
    -- Insert tournament stage
    INSERT INTO tournament_stages (tournament_id, stage_name, stage_order, format_type, format_config) VALUES
    (tournament_uuid, 'Main Bracket', 1, 'Single Elimination', 
     '{"round_names": ["Round of 16", "Quarter Finals", "Semi Finals", "Grand Final"], "seeding_rules": "random", "bye_rules": "none"}');
END $$;

-- Insert sample tournament teams
INSERT INTO tournament_teams (tournament_id, team_id, seed)
SELECT t.id, tm.id, ROW_NUMBER() OVER (ORDER BY RANDOM())
FROM tournaments t
CROSS JOIN teams tm
WHERE t.name = 'Arenarium Championship 2024'
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
