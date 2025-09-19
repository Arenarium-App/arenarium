-- Backup script to export existing data before MLBB MPL setup
-- This creates backup tables with your existing data

-- Create backup tables
CREATE TABLE IF NOT EXISTS teams_backup AS SELECT * FROM teams;
CREATE TABLE IF NOT EXISTS tournaments_backup AS SELECT * FROM tournaments;
CREATE TABLE IF NOT EXISTS tournament_stages_backup AS SELECT * FROM tournament_stages;
CREATE TABLE IF NOT EXISTS tournament_teams_backup AS SELECT * FROM tournament_teams;
CREATE TABLE IF NOT EXISTS matches_backup AS SELECT * FROM matches;
CREATE TABLE IF NOT EXISTS statistics_backup AS SELECT * FROM statistics;
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;
CREATE TABLE IF NOT EXISTS team_members_backup AS SELECT * FROM team_members;

-- Add backup timestamp
ALTER TABLE teams_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE tournaments_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE tournament_stages_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE tournament_teams_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE matches_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE statistics_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE users_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();
ALTER TABLE team_members_backup ADD COLUMN backup_date TIMESTAMP DEFAULT NOW();

-- Show backup summary
SELECT 
    'teams_backup' as table_name, 
    COUNT(*) as record_count 
FROM teams_backup
UNION ALL
SELECT 
    'tournaments_backup' as table_name, 
    COUNT(*) as record_count 
FROM tournaments_backup
UNION ALL
SELECT 
    'tournament_stages_backup' as table_name, 
    COUNT(*) as record_count 
FROM tournament_stages_backup
UNION ALL
SELECT 
    'tournament_teams_backup' as table_name, 
    COUNT(*) as record_count 
FROM tournament_teams_backup
UNION ALL
SELECT 
    'matches_backup' as table_name, 
    COUNT(*) as record_count 
FROM matches_backup
UNION ALL
SELECT 
    'statistics_backup' as table_name, 
    COUNT(*) as record_count 
FROM statistics_backup
UNION ALL
SELECT 
    'users_backup' as table_name, 
    COUNT(*) as record_count 
FROM users_backup
UNION ALL
SELECT 
    'team_members_backup' as table_name, 
    COUNT(*) as record_count 
FROM team_members_backup;
