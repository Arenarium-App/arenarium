-- Sample data for Arenarium Mobile Legends Wiki
-- This file contains sample data to populate the database

-- Insert sample teams
INSERT INTO teams (team_name, team_code, logo, region, region_id) VALUES
('Evos Legends', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=EVOS', 'Indonesia', 1),
('RRQ Hoshi', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=RRQ', 'Indonesia', 1),
('ONIC Esports', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=ONIC', 'Indonesia', 1),
('Alter Ego', 'AE', 'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=AE', 'Indonesia', 1),
('Bigetron Alpha', 'BTK', 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=BTK', 'Indonesia', 1),
('Todak', 'TDK', 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=TDK', 'Malaysia', 2),
('Orange Esports', 'OG', 'https://via.placeholder.com/150x150/EA580C/FFFFFF?text=OG', 'Malaysia', 2),
('Team SMG', 'SMG', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=SMG', 'Malaysia', 2),
('Blacklist International', 'BLI', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=BLI', 'Philippines', 3),
('Bren Esports', 'BREN', 'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=BREN', 'Philippines', 3),
('RSG SG', 'RSG', 'https://via.placeholder.com/150x150/1E40AF/FFFFFF?text=RSG', 'Singapore', 4),
('Team Flash', 'FLASH', 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=FLASH', 'Singapore', 4),
('M8H', 'M8H', 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=M8H', 'Myanmar', 5),
('Falcon Esports', 'FALCON', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=FALCON', 'Myanmar', 5),
('Team Secret', 'SECRET', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=SECRET', 'Philippines', 3),
('EXE', 'EXE', 'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=EXE', 'Indonesia', 1),
('GPX Basreng', 'GPX', 'https://via.placeholder.com/150x150/1E40AF/FFFFFF?text=GPX', 'Indonesia', 1),
('Aura Fire', 'AURA', 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=AURA', 'Indonesia', 1),
('Genflix Aerowolf', 'GENF', 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=GENF', 'Indonesia', 1),
('LiGe Gaming', 'LIGE', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=LIGE', 'Indonesia', 1);

-- Insert sample roles
INSERT INTO roles (name, img) VALUES
('Tank', 'https://via.placeholder.com/100x100/374151/FFFFFF?text=Tank'),
('Fighter', 'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=Fighter'),
('Assassin', 'https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=Assassin'),
('Mage', 'https://via.placeholder.com/100x100/059669/FFFFFF?text=Mage'),
('Marksman', 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Marksman'),
('Support', 'https://via.placeholder.com/100x100/1E40AF/FFFFFF?text=Support');

-- Insert sample heroes
INSERT INTO heroes (hero_name, hero_img, hero_role) VALUES
('Layla', 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Layla', 'Marksman'),
('Miya', 'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=Miya', 'Marksman'),
('Alucard', 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=Alucard', 'Fighter'),
('Tigreal', 'https://via.placeholder.com/150x150/374151/FFFFFF?text=Tigreal', 'Tank'),
('Eudora', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=Eudora', 'Mage'),
('Rafaela', 'https://via.placeholder.com/150x150/1E40AF/FFFFFF?text=Rafaela', 'Support'),
('Jawhead', 'https://via.placeholder.com/150x150/EA580C/FFFFFF?text=Jawhead', 'Fighter'),
('Harley', 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=Harley', 'Mage'),
('Grock', 'https://via.placeholder.com/150x150/374151/FFFFFF?text=Grock', 'Tank'),
('Angela', 'https://via.placeholder.com/150x150/1E40AF/FFFFFF?text=Angela', 'Support');

-- Insert sample players
INSERT INTO players (real_name, in_game_name, team_code, player_photo, role, status) VALUES
('Lucky', 'Lucky', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Lucky', 'Marksman', 'active'),
('Wannn', 'Wannn', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Wannn', 'Support', 'active'),
('Rext', 'Rext', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Rext', 'Tank', 'active'),
('D2', 'D2', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=D2', 'Fighter', 'active'),
('Baxia', 'Baxia', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Baxia', 'Mage', 'active'),
('Lemon', 'Lemon', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Lemon', 'Marksman', 'active'),
('Clayyy', 'Clayyy', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Clayyy', 'Support', 'active'),
('Vyn', 'Vyn', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Vyn', 'Tank', 'active'),
('Skylar', 'Skylar', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Skylar', 'Fighter', 'active'),
('Alberttt', 'Alberttt', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Alberttt', 'Mage', 'active'),
('Kairi', 'Kairi', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=Kairi', 'Marksman', 'active'),
('Sanz', 'Sanz', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=Sanz', 'Support', 'active'),
('Kiboy', 'Kiboy', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=Kiboy', 'Tank', 'active'),
('Butsss', 'Butsss', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=Butsss', 'Fighter', 'active'),
('Drian', 'Drian', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=Drian', 'Mage', 'active'),
('MobaZane', 'MobaZane', 'BLI', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=MobaZane', 'Marksman', 'active'),
('Eson', 'Eson', 'BLI', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Eson', 'Support', 'active'),
('Edward', 'Edward', 'BLI', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Edward', 'Tank', 'active'),
('Dex Star', 'Dex Star', 'BLI', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Dex Star', 'Fighter', 'active'),
('OHEB', 'OHEB', 'BLI', 'https://via.placeholder.com/150x150/000000/FFFFFF?text=OHEB', 'Mage', 'active');

-- Insert sample items
INSERT INTO items (item_name, item_img, price) VALUES
('Haas Claws', 'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=Haas', 2050),
('Berserker Fury', 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Berserker', 2250),
('Endless Battle', 'https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=Endless', 2470),
('Blade of Despair', 'https://via.placeholder.com/100x100/374151/FFFFFF?text=Blade', 3010),
('Malefic Roar', 'https://via.placeholder.com/100x100/059669/FFFFFF?text=Malefic', 2060),
('Immortality', 'https://via.placeholder.com/100x100/1E40AF/FFFFFF?text=Immortality', 2120),
('Athena Shield', 'https://via.placeholder.com/100x100/EA580C/FFFFFF?text=Athena', 2150),
('Oracle', 'https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=Oracle', 2350),
('Ice Queen Wand', 'https://via.placeholder.com/100x100/059669/FFFFFF?text=Ice Queen', 2250),
('Glowing Wand', 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Glowing', 2150);

-- Insert sample tournaments
INSERT INTO tournaments (name, description, start_date, end_date, prize_pool, currency, status, tournament_type, region, organizer, logo) VALUES
('M4 World Championship', 'The fourth Mobile Legends: Bang Bang World Championship featuring top teams from around the world', '2024-01-15', '2024-01-28', 800000, 'USD', 'completed', 'single_elimination', 'Global', 'Moonton', 'https://via.placeholder.com/300x150/7C3AED/FFFFFF?text=M4 World'),
('MPL PH Season 13', 'Mobile Legends Professional League Philippines Season 13', '2024-03-01', '2024-05-15', 150000, 'USD', 'ongoing', 'league', 'Philippines', 'Moonton', 'https://via.placeholder.com/300x150/DC2626/FFFFFF?text=MPL PH'),
('MSC 2024', 'Mobile Legends Southeast Asia Cup 2024', '2024-06-10', '2024-06-20', 300000, 'USD', 'upcoming', 'single_elimination', 'Southeast Asia', 'Moonton', 'https://via.placeholder.com/300x150/059669/FFFFFF?text=MSC 2024'),
('MPL ID Season 13', 'Mobile Legends Professional League Indonesia Season 13', '2024-02-01', '2024-04-30', 120000, 'USD', 'completed', 'league', 'Indonesia', 'Moonton', 'https://via.placeholder.com/300x150/F59E0B/FFFFFF?text=MPL ID'),
('MSI 2024', 'Mid-Season Invitational 2024', '2024-07-01', '2024-07-15', 500000, 'USD', 'upcoming', 'single_elimination', 'Global', 'Moonton', 'https://via.placeholder.com/300x150/1E40AF/FFFFFF?text=MSI 2024');

-- Insert tournament teams
INSERT INTO tournament_teams (tournament_id, team_id, seed, final_position, prize_money) VALUES
(1, 1, 1, 3, 80000),
(1, 2, 2, 2, 160000),
(1, 3, 3, 1, 400000),
(1, 4, 4, 4, 40000),
(1, 5, 5, 8, 20000),
(2, 9, 1, NULL, 0),
(2, 10, 2, NULL, 0),
(2, 15, 3, NULL, 0),
(3, 1, 1, NULL, 0),
(3, 2, 2, NULL, 0),
(3, 3, 3, NULL, 0),
(3, 4, 4, NULL, 0),
(4, 1, 1, 2, 30000),
(4, 2, 2, 1, 50000),
(4, 3, 3, 3, 20000),
(4, 4, 4, 4, 10000);

-- Insert sample matches
INSERT INTO matches (tournament_id, team1_id, team2_id, match_date, match_type, status, winner_id, team1_score, team2_score, stage, round_number, match_number, venue, stream_url) VALUES
(1, 3, 2, '2024-01-28 15:00:00', 'bo5', 'completed', 3, 3, 2, 'Grand Final', 1, 1, 'Jakarta Convention Center', 'https://youtube.com/watch?v=example1'),
(1, 1, 4, '2024-01-27 14:00:00', 'bo5', 'completed', 1, 3, 1, 'Semi Final', 1, 1, 'Jakarta Convention Center', 'https://youtube.com/watch?v=example2'),
(1, 2, 5, '2024-01-27 18:00:00', 'bo5', 'completed', 2, 3, 0, 'Semi Final', 1, 2, 'Jakarta Convention Center', 'https://youtube.com/watch?v=example3'),
(2, 9, 10, '2024-03-15 16:00:00', 'bo3', 'live', NULL, 1, 1, 'Regular Season', 1, 1, 'Online', 'https://youtube.com/watch?v=example4'),
(2, 15, 9, '2024-03-10 14:00:00', 'bo3', 'completed', 15, 2, 1, 'Regular Season', 1, 2, 'Online', 'https://youtube.com/watch?v=example5'),
(3, 1, 2, '2024-06-10 15:00:00', 'bo5', 'scheduled', NULL, 0, 0, 'Quarter Final', 1, 1, 'Bangkok Convention Center', NULL),
(3, 3, 4, '2024-06-11 16:00:00', 'bo5', 'scheduled', NULL, 0, 0, 'Quarter Final', 1, 2, 'Bangkok Convention Center', NULL),
(4, 2, 1, '2024-04-15 14:00:00', 'bo5', 'completed', 2, 3, 2, 'Grand Final', 1, 1, 'Jakarta Convention Center', 'https://youtube.com/watch?v=example6'),
(4, 3, 4, '2024-04-14 16:00:00', 'bo5', 'completed', 3, 3, 1, 'Semi Final', 1, 1, 'Jakarta Convention Center', 'https://youtube.com/watch?v=example7');

-- Insert sample games
INSERT INTO games (match_id, game_number, team1_score, team2_score, winner_id, duration, patch_version, game_date) VALUES
(1, 1, 1, 0, 3, 1800, '1.8.40', '2024-01-28 15:00:00'),
(1, 2, 0, 1, 2, 1920, '1.8.40', '2024-01-28 15:30:00'),
(1, 3, 1, 0, 3, 2100, '1.8.40', '2024-01-28 16:00:00'),
(1, 4, 0, 1, 2, 1680, '1.8.40', '2024-01-28 16:30:00'),
(1, 5, 1, 0, 3, 2400, '1.8.40', '2024-01-28 17:00:00'),
(2, 1, 1, 0, 1, 1750, '1.8.40', '2024-01-27 14:00:00'),
(2, 2, 1, 0, 1, 1950, '1.8.40', '2024-01-27 14:30:00'),
(2, 3, 1, 0, 1, 1820, '1.8.40', '2024-01-27 15:00:00'),
(2, 4, 0, 1, 4, 2100, '1.8.40', '2024-01-27 15:30:00'),
(2, 5, 1, 0, 1, 1980, '1.8.40', '2024-01-27 16:00:00'),
(3, 1, 1, 0, 2, 1680, '1.8.40', '2024-01-27 18:00:00'),
(3, 2, 1, 0, 2, 1920, '1.8.40', '2024-01-27 18:30:00'),
(3, 3, 1, 0, 2, 2100, '1.8.40', '2024-01-27 19:00:00'),
(8, 1, 1, 0, 2, 1820, '1.8.35', '2024-04-15 14:00:00'),
(8, 2, 0, 1, 1, 1950, '1.8.35', '2024-04-15 14:30:00'),
(8, 3, 1, 0, 2, 2100, '1.8.35', '2024-04-15 15:00:00'),
(8, 4, 0, 1, 1, 1880, '1.8.35', '2024-04-15 15:30:00'),
(8, 5, 1, 0, 2, 2400, '1.8.35', '2024-04-15 16:00:00');

-- Insert sample player performances
INSERT INTO player_performances (game_id, player_id, team_id, hero_id, kills, deaths, assists, kda, gold, damage_dealt, damage_taken, turret_damage, objective_damage, healing, mvp) VALUES
(1, 1, 1, 1, 8, 2, 5, 6.5, 15000, 45000, 25000, 8000, 2000, 0, true),
(1, 11, 3, 1, 6, 3, 8, 4.7, 14000, 42000, 22000, 7500, 1800, 0, false),
(1, 2, 1, 6, 2, 4, 12, 3.5, 12000, 15000, 30000, 2000, 1000, 25000, false),
(1, 12, 3, 6, 1, 3, 15, 5.3, 11500, 12000, 28000, 1500, 800, 30000, false),
(2, 1, 1, 1, 7, 1, 3, 10.0, 16000, 48000, 20000, 9000, 2500, 0, true),
(2, 11, 3, 1, 4, 4, 6, 2.5, 13000, 38000, 24000, 6000, 1500, 0, false),
(3, 1, 1, 1, 9, 2, 4, 6.5, 15500, 46000, 21000, 8500, 2200, 0, true),
(3, 11, 3, 1, 5, 3, 7, 4.0, 13500, 40000, 23000, 7000, 1900, 0, false);

-- Insert sample statistics
INSERT INTO statistics (team_id, tournament_id, match_id, stat_type, stat_value, stat_date) VALUES
(1, 1, 2, 'win_rate', 0.75, '2024-01-27'),
(1, 1, 2, 'match_count', 5, '2024-01-27'),
(1, 1, 2, 'total_wins', 4, '2024-01-27'),
(2, 1, 1, 'win_rate', 0.80, '2024-01-28'),
(2, 1, 1, 'match_count', 5, '2024-01-28'),
(2, 1, 1, 'total_wins', 4, '2024-01-28'),
(3, 1, 1, 'win_rate', 0.60, '2024-01-28'),
(3, 1, 1, 'match_count', 5, '2024-01-28'),
(3, 1, 1, 'total_wins', 3, '2024-01-28'),
(4, 1, 2, 'win_rate', 0.25, '2024-01-27'),
(4, 1, 2, 'match_count', 4, '2024-01-27'),
(4, 1, 2, 'total_wins', 1, '2024-01-27'),
(9, 2, 4, 'win_rate', 0.55, '2024-03-15'),
(9, 2, 4, 'match_count', 15, '2024-03-15'),
(9, 2, 4, 'total_wins', 8, '2024-03-15'),
(10, 2, 4, 'win_rate', 0.45, '2024-03-15'),
(10, 2, 4, 'match_count', 15, '2024-03-15'),
(10, 2, 4, 'total_wins', 7, '2024-03-15'),
(15, 2, 5, 'win_rate', 0.65, '2024-03-10'),
(15, 2, 5, 'match_count', 14, '2024-03-10'),
(15, 2, 5, 'total_wins', 9, '2024-03-10');
