-- Arenarium Database Schema
-- Mobile Legends Wiki Database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    team_code VARCHAR(50) UNIQUE NOT NULL,
    logo TEXT,
    region VARCHAR(100) NOT NULL,
    region_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    real_name VARCHAR(255) NOT NULL,
    in_game_name VARCHAR(255) NOT NULL,
    team_code VARCHAR(50) REFERENCES teams(team_code),
    player_photo TEXT,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Heroes table
CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    hero_name VARCHAR(255) NOT NULL UNIQUE,
    hero_img TEXT,
    hero_role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL,
    skill_hero INTEGER REFERENCES heroes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL UNIQUE,
    item_img TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Emblems table
CREATE TABLE emblems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Talents table
CREATE TABLE talents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Spells table
CREATE TABLE spells (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tournaments table
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    prize_pool DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    tournament_type VARCHAR(50) DEFAULT 'single_elimination' CHECK (tournament_type IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'league')),
    region VARCHAR(100),
    organizer VARCHAR(255),
    logo TEXT,
    banner TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tournament Teams (Many-to-Many relationship)
CREATE TABLE tournament_teams (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    seed INTEGER,
    final_position INTEGER,
    prize_money DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(tournament_id, team_id)
);

-- Matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    team1_id INTEGER REFERENCES teams(id),
    team2_id INTEGER REFERENCES teams(id),
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    match_type VARCHAR(50) DEFAULT 'bo1' CHECK (match_type IN ('bo1', 'bo3', 'bo5', 'bo7')),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    winner_id INTEGER REFERENCES teams(id),
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    stage VARCHAR(100) DEFAULT 'group_stage', -- group_stage, quarterfinal, semifinal, final, etc.
    round_number INTEGER DEFAULT 1,
    match_number INTEGER DEFAULT 1,
    venue VARCHAR(255),
    stream_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Games table (Individual games within a match)
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    game_number INTEGER NOT NULL,
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    winner_id INTEGER REFERENCES teams(id),
    duration INTEGER DEFAULT 0, -- in seconds
    patch_version VARCHAR(50),
    game_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Player Performance table (Detailed stats per game)
CREATE TABLE player_performances (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id),
    team_id INTEGER REFERENCES teams(id),
    hero_id INTEGER REFERENCES heroes(id),
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    kda DECIMAL(5,2) DEFAULT 0,
    gold INTEGER DEFAULT 0,
    damage_dealt INTEGER DEFAULT 0,
    damage_taken INTEGER DEFAULT 0,
    turret_damage INTEGER DEFAULT 0,
    objective_damage INTEGER DEFAULT 0,
    healing INTEGER DEFAULT 0,
    mvp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tournament Brackets table
CREATE TABLE tournament_brackets (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    bracket_name VARCHAR(100) NOT NULL,
    bracket_type VARCHAR(50) DEFAULT 'single_elimination',
    round_number INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    team1_id INTEGER REFERENCES teams(id),
    team2_id INTEGER REFERENCES teams(id),
    winner_id INTEGER REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Statistics table for charts and analytics
CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    tournament_id INTEGER REFERENCES tournaments(id),
    match_id INTEGER REFERENCES matches(id),
    stat_type VARCHAR(100) NOT NULL, -- 'win_rate', 'avg_game_duration', 'most_used_hero', etc.
    stat_value DECIMAL(10,4),
    stat_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_teams_region ON teams(region);
CREATE INDEX idx_players_team_code ON players(team_code);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_heroes_role ON heroes(hero_role);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_games_match ON games(match_id);
CREATE INDEX idx_player_performances_game ON player_performances(game_id);
CREATE INDEX idx_player_performances_player ON player_performances(player_id);
CREATE INDEX idx_statistics_team ON statistics(team_id);
CREATE INDEX idx_statistics_date ON statistics(stat_date);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE emblems ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow public read access to players" ON players FOR SELECT USING (true);
CREATE POLICY "Allow public read access to heroes" ON heroes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access to items" ON items FOR SELECT USING (true);
CREATE POLICY "Allow public read access to emblems" ON emblems FOR SELECT USING (true);
CREATE POLICY "Allow public read access to talents" ON talents FOR SELECT USING (true);
CREATE POLICY "Allow public read access to spells" ON spells FOR SELECT USING (true);
CREATE POLICY "Allow public read access to roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tournament_teams" ON tournament_teams FOR SELECT USING (true);
CREATE POLICY "Allow public read access to matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow public read access to games" ON games FOR SELECT USING (true);
CREATE POLICY "Allow public read access to player_performances" ON player_performances FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tournament_brackets" ON tournament_brackets FOR SELECT USING (true);
CREATE POLICY "Allow public read access to statistics" ON statistics FOR SELECT USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON heroes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emblems_updated_at BEFORE UPDATE ON emblems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON talents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spells_updated_at BEFORE UPDATE ON spells FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_teams_updated_at BEFORE UPDATE ON tournament_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_performances_updated_at BEFORE UPDATE ON player_performances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_brackets_updated_at BEFORE UPDATE ON tournament_brackets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
