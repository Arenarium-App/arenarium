# Data Management Guide for Arenarium

This guide will help you add, manage, and update data in your Arenarium database.

## 📊 Database Tables Overview

Your database contains the following main tables:

1. **teams** - Competitive teams
2. **players** - Player profiles
3. **heroes** - Mobile Legends heroes
4. **skills** - Hero abilities
5. **items** - Game items
6. **emblems** - Emblems
7. **talents** - Talents
8. **spells** - Battle spells
9. **roles** - Player roles
10. **games** - Match data

## 🚀 Quick Start: Adding Sample Data

### Step 1: Set up Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings > API

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Run Database Schema

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL to create all tables

### Step 4: Add Sample Data

1. In the SQL Editor, copy and paste the contents of `sample-data.sql`
2. Run the SQL to populate your database with sample data

## 📝 Adding New Data

### Adding Teams

```sql
INSERT INTO teams (team_name, team_code, logo, region, region_id) VALUES
('Your Team Name', 'TEAM_CODE', 'https://example.com/logo.png', 'Indonesia', 1);
```

**Required fields:**
- `team_name`: Full team name
- `team_code`: Unique team code (3-5 characters)
- `logo`: URL to team logo
- `region`: Team region (Indonesia, Malaysia, Philippines, Singapore, Myanmar)
- `region_id`: Numeric region ID (1=Indonesia, 2=Malaysia, 3=Philippines, 4=Singapore, 5=Myanmar)

### Adding Players

```sql
INSERT INTO players (real_name, in_game_name, team_code, player_photo, role, status) VALUES
('Real Name', 'InGameName', 'TEAM_CODE', 'https://example.com/photo.png', 'Tank', 'active');
```

**Required fields:**
- `real_name`: Player's real name
- `in_game_name`: Player's in-game name
- `team_code`: Must match an existing team code
- `player_photo`: URL to player photo
- `role`: Player role (Tank, Fighter, Assassin, Mage, Marksman, Support)
- `status`: Player status (active, inactive)

### Adding Heroes

```sql
INSERT INTO heroes (hero_name, hero_img, hero_role) VALUES
('Hero Name', 'https://example.com/hero.png', 'Tank');
```

**Required fields:**
- `hero_name`: Hero name
- `hero_img`: URL to hero image
- `hero_role`: Hero role (Tank, Fighter, Assassin, Mage, Marksman, Support)

### Adding Items

```sql
INSERT INTO items (item_name, item_img, price) VALUES
('Item Name', 'https://example.com/item.png', 2000);
```

**Required fields:**
- `item_name`: Item name
- `item_img`: URL to item image
- `price`: Item price (integer)

## 🔄 Updating Existing Data

### Update Team Information

```sql
UPDATE teams 
SET team_name = 'New Team Name', 
    logo = 'https://example.com/new-logo.png'
WHERE team_code = 'TEAM_CODE';
```

### Update Player Information

```sql
UPDATE players 
SET role = 'Mage', 
    status = 'inactive'
WHERE in_game_name = 'PlayerName';
```

### Update Hero Information

```sql
UPDATE heroes 
SET hero_role = 'Fighter', 
    hero_img = 'https://example.com/new-hero.png'
WHERE hero_name = 'Hero Name';
```

## 🗑️ Deleting Data

### Delete Team

```sql
DELETE FROM teams WHERE team_code = 'TEAM_CODE';
```

**Note:** This will also delete all players associated with this team due to foreign key constraints.

### Delete Player

```sql
DELETE FROM players WHERE in_game_name = 'PlayerName';
```

### Delete Hero

```sql
DELETE FROM heroes WHERE hero_name = 'Hero Name';
```

**Note:** This will also delete all skills associated with this hero due to foreign key constraints.

## 📊 Sample Data Structure

### Teams Sample

```sql
-- Indonesian Teams
('Evos Legends', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=EVOS', 'Indonesia', 1),
('RRQ Hoshi', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=RRQ', 'Indonesia', 1),
('ONIC Esports', 'ONIC', 'https://via.placeholder.com/150x150/059669/FFFFFF?text=ONIC', 'Indonesia', 1);

-- Malaysian Teams
('Todak', 'TDK', 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=TDK', 'Malaysia', 2),
('Orange Esports', 'OG', 'https://via.placeholder.com/150x150/EA580C/FFFFFF?text=OG', 'Malaysia', 2);
```

### Players Sample

```sql
-- EVOS Players
('Lemon', 'Lemon', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=L', 'Tank', 'active'),
('Luminaire', 'Luminaire', 'EVOS', 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Lum', 'Marksman', 'active');

-- RRQ Players
('Lycannn', 'Lycannn', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Lyc', 'Tank', 'active'),
('Skylar', 'Skylar', 'RRQ', 'https://via.placeholder.com/150x150/1E3A8A/FFFFFF?text=Sky', 'Marksman', 'active');
```

### Heroes Sample

```sql
-- Tank Heroes
('Tigreal', 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=Tigreal', 'Tank'),
('Franco', 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=Franco', 'Tank');

-- Fighter Heroes
('Yu Zhong', 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=YuZhong', 'Fighter'),
('Paquito', 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=Paquito', 'Fighter');
```

## 🎯 Best Practices

### 1. Data Consistency
- Always use consistent naming conventions for team codes
- Maintain consistent image URL formats
- Use standardized role names

### 2. Image URLs
- Use placeholder images for testing: `https://via.placeholder.com/150x150/COLOR/FFFFFF?text=TEXT`
- Store actual images in a CDN or image hosting service
- Ensure images are accessible and have appropriate dimensions

### 3. Team Codes
- Use 3-5 character codes (e.g., EVOS, RRQ, ONIC)
- Keep codes unique and memorable
- Use uppercase letters

### 4. Player Names
- Store both real names and in-game names
- Use consistent formatting for in-game names
- Include team associations

## 🔍 Querying Data

### Get All Teams

```sql
SELECT * FROM teams ORDER BY region_id, team_name;
```

### Get Players by Team

```sql
SELECT p.*, t.team_name 
FROM players p 
JOIN teams t ON p.team_code = t.team_code 
WHERE p.team_code = 'EVOS';
```

### Get Heroes by Role

```sql
SELECT * FROM heroes WHERE hero_role = 'Tank' ORDER BY hero_name;
```

### Get Players by Role

```sql
SELECT p.*, t.team_name 
FROM players p 
JOIN teams t ON p.team_code = t.team_code 
WHERE p.role = 'Tank' AND p.status = 'active';
```

## 🛠️ Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**
   - Ensure team codes exist before adding players
   - Ensure heroes exist before adding skills

2. **Unique Constraint Violations**
   - Check for duplicate team codes, hero names, or item names
   - Use different codes/names for new entries

3. **Invalid URLs**
   - Test image URLs before adding
   - Use placeholder images for testing

### Getting Help

1. Check the Supabase dashboard for error messages
2. Verify your environment variables are correct
3. Ensure your database schema is properly set up
4. Check the `database-schema.sql` file for reference

## 📈 Next Steps

1. **Add More Data**: Use the sample data as a template to add more teams, players, and heroes
2. **Customize Images**: Replace placeholder images with actual team/player photos
3. **Add Match Data**: Populate the games table with actual match data
4. **Set up RLS**: Configure Row Level Security policies for production use
5. **Backup Data**: Regularly backup your database data

## 🎉 Congratulations!

You now have a fully functional Mobile Legends wiki database! Your Arenarium project is ready to showcase competitive gaming data with a beautiful, modern interface.
