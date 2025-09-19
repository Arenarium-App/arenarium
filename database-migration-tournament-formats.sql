-- Tournament Format Management Migration
-- This script adds support for multi-stage tournaments with different formats

-- 1. Create tournament_formats table
CREATE TABLE IF NOT EXISTS tournament_formats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create tournament_stages table
CREATE TABLE IF NOT EXISTS tournament_stages (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    format_type VARCHAR(50) NOT NULL,
    format_config JSONB, -- Store format-specific configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, stage_order)
);

-- 3. Insert default tournament formats
INSERT INTO tournament_formats (name, description) VALUES
('Single Elimination', 'Teams are eliminated after one loss. Winner advances to next round.'),
('Double Elimination', 'Teams must lose twice to be eliminated. Losers bracket provides second chance.'),
('Round Robin', 'Each team plays against every other team once.'),
('Round Robin 2 Legs', 'Each team plays against every other team twice (home and away).'),
('Swiss System', 'Teams are paired against others with similar records.'),
('Leaderboard', 'Teams accumulate points over multiple matches.'),
('Group Stage + Playoffs', 'Initial group stage followed by elimination playoffs.'),
('League Format', 'Season-long competition with regular matches and playoffs.')
ON CONFLICT (name) DO NOTHING;

-- 4. Add new columns to tournaments table
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS format_config JSONB,
ADD COLUMN IF NOT EXISTS has_multiple_stages BOOLEAN DEFAULT false;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tournament_stages_tournament_id ON tournament_stages(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_stages_order ON tournament_stages(stage_order);
CREATE INDEX IF NOT EXISTS idx_tournament_formats_active ON tournament_formats(is_active);

-- 6. Update existing tournaments to use new format system
-- This will set all existing tournaments to have a single stage with their current tournament_type
INSERT INTO tournament_stages (tournament_id, stage_name, stage_order, format_type, format_config)
SELECT 
    id,
    'Main Stage',
    1,
    CASE 
        WHEN tournament_type = 'single_elimination' THEN 'Single Elimination'
        WHEN tournament_type = 'double_elimination' THEN 'Double Elimination'
        WHEN tournament_type = 'round_robin' THEN 'Round Robin'
        WHEN tournament_type = 'swiss' THEN 'Swiss System'
        WHEN tournament_type = 'league' THEN 'League Format'
        ELSE 'Single Elimination'
    END,
    jsonb_build_object(
        'original_type', tournament_type,
        'teams_count', 0,
        'matches_per_round', 1
    )
FROM tournaments
WHERE id NOT IN (SELECT DISTINCT tournament_id FROM tournament_stages);

-- 7. Create RLS policies for new tables
ALTER TABLE tournament_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_stages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to formats
CREATE POLICY "Allow public read access to tournament formats" ON tournament_formats
    FOR SELECT USING (true);

-- Allow public read access to stages
CREATE POLICY "Allow public read access to tournament stages" ON tournament_stages
    FOR SELECT USING (true);

-- Allow authenticated users to manage formats (for admins)
CREATE POLICY "Allow authenticated users to manage tournament formats" ON tournament_formats
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage stages (for admins)
CREATE POLICY "Allow authenticated users to manage tournament stages" ON tournament_stages
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. Create function to update tournament format
CREATE OR REPLACE FUNCTION update_tournament_format(
    p_tournament_id INTEGER,
    p_format_config JSONB,
    p_stages JSONB
)
RETURNS VOID AS $$
BEGIN
    -- Update tournament format config
    UPDATE tournaments 
    SET format_config = p_format_config,
        has_multiple_stages = CASE WHEN jsonb_array_length(p_stages) > 1 THEN true ELSE false END,
        updated_at = NOW()
    WHERE id = p_tournament_id;
    
    -- Delete existing stages
    DELETE FROM tournament_stages WHERE tournament_id = p_tournament_id;
    
    -- Insert new stages
    INSERT INTO tournament_stages (tournament_id, stage_name, stage_order, format_type, format_config)
    SELECT 
        p_tournament_id,
        (stage->>'stage_name')::VARCHAR,
        (stage->>'stage_order')::INTEGER,
        (stage->>'format_type')::VARCHAR,
        stage->'format_config'
    FROM jsonb_array_elements(p_stages) AS stage
    ORDER BY (stage->>'stage_order')::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- 9. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON tournament_formats TO anon, authenticated;
GRANT ALL ON tournament_stages TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_tournament_format(INTEGER, JSONB, JSONB) TO anon, authenticated;

-- 10. Verify the migration
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as tournament_formats_count FROM tournament_formats;
SELECT COUNT(*) as tournament_stages_count FROM tournament_stages;
