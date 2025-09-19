# Arenarium - Multi-Game Competitive Gaming Wiki

A modern, comprehensive competitive gaming wiki and database built with Next.js, TypeScript, and Supabase. Currently focusing on **Mobile Legends: Bang Bang** with plans to expand to other competitive games like **Valorant**, **League of Legends**, **Dota 2**, and more.

## 🎮 Current Game Support

### ✅ Mobile Legends: Bang Bang (MLBB)
- **Teams Management**: Browse and search competitive teams with filters by region
- **Players Database**: Explore player profiles, statistics, and achievements  
- **Heroes Catalog**: Discover heroes, their abilities, and roles
- **Items Database**: Browse items, their effects, and pricing
- **Match History**: View detailed match results, statistics, and performance data

### 🚧 Coming Soon
- **Valorant**: Teams, players, agents, maps, and match data
- **League of Legends**: Teams, players, champions, and competitive scene
- **Dota 2**: Teams, players, heroes, and tournament data
- **CS:GO/CS2**: Teams, players, maps, and match statistics

## 🌟 Features

- **Multi-Game Support**: Designed to support multiple competitive games
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Real-time Data**: Powered by Supabase for real-time updates
- **Scalable Architecture**: Built to easily add new games and features
- **Type-Safe**: Full TypeScript support for better development experience

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Netlify
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/arenarium.git
cd arenarium
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings > API

### 2. Run Database Schema

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL to create all tables

### 3. Add Sample Data

1. In the SQL Editor, copy and paste the contents of `sample-data.sql`
2. Run the SQL to populate your database with sample data

## Data Management

### Adding Data via CLI Tool

We've created a convenient CLI tool to help you add data to your database:

```bash
# Install dependencies (if not already done)
npm install

# Run the data management tool
npm run add-data
```

This interactive tool allows you to:
- Add new teams
- Add new players
- Add new heroes
- Add new items

### Adding Data via SQL

You can also add data directly using SQL. See `DATA_GUIDE.md` for comprehensive examples.

#### Example: Adding a Team

```sql
INSERT INTO teams (team_name, team_code, logo, region, region_id) VALUES
('New Team', 'NEW', 'https://example.com/logo.png', 'Indonesia', 1);
```

#### Example: Adding a Player

```sql
INSERT INTO players (real_name, in_game_name, team_code, player_photo, role, status) VALUES
('John Doe', 'PlayerName', 'NEW', 'https://example.com/photo.png', 'Tank', 'active');
```

### Sample Data

The `sample-data.sql` file contains:
- 20 teams from different regions (Indonesia, Malaysia, Philippines, Singapore, Myanmar)
- 25 players across various teams
- 30 heroes with different roles
- 15 items with prices
- 6 roles, emblems, talents, and spells

## Database Schema

### Current Tables (MLBB)

1. **teams**: Team information (id, team_name, team_code, logo, region, region_id)
2. **players**: Player profiles (id, real_name, in_game_name, team_code, player_photo, role, status)
3. **heroes**: Hero data (id, hero_name, hero_img, hero_role)
4. **skills**: Hero skills (id, skill_name, skill_hero)
5. **items**: Game items (id, item_name, item_img, price)
6. **emblems**: Emblems (id, name, img)
7. **talents**: Talents (id, name, img)
8. **spells**: Spells (id, name, img)
9. **roles**: Roles (id, name, img)
10. **games**: Match and game data (comprehensive match statistics)

### Future Tables (Valorant & Other Games)

- **games**: Expanded to support multiple game types
- **maps**: Game-specific maps and locations
- **agents/champions/heroes**: Game-specific characters
- **tournaments**: Multi-game tournament support
- **seasons**: Seasonal competition data

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── teams/             # Teams pages
│   ├── players/           # Players pages
│   ├── heroes/            # Heroes pages (MLBB)
│   ├── items/             # Items pages (MLBB)
│   ├── matches/           # Matches pages
│   └── games/             # Future game-specific pages
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   ├── TeamsList.tsx      # Teams listing component
│   ├── PlayersList.tsx    # Players listing component
│   └── ...
├── lib/                   # Utility functions
│   └── supabase.ts        # Supabase client configuration
├── types/                 # TypeScript type definitions
│   └── database.ts        # Database types
└── styles/                # Global styles
scripts/
├── setup.js              # Initial setup script
└── add-data.js           # Data management tool
```

## Future Roadmap

### Phase 1: Mobile Legends (Current)
- ✅ Core functionality implemented
- ✅ Teams, players, heroes, items
- ✅ Match data and statistics
- 🔄 UI/UX refinements

### Phase 2: Valorant (Next)
- 🎯 Agent database and abilities
- 🎯 Map information and strategies
- 🎯 Team and player profiles
- 🎯 Match statistics and analytics

### Phase 3: Multi-Game Platform
- 🎯 Unified database schema
- 🎯 Game switching interface
- 🎯 Cross-game comparisons
- 🎯 Tournament management

### Phase 4: Advanced Features
- 🎯 User authentication and profiles
- 🎯 Community features and discussions
- 🎯 API for third-party integrations
- 🎯 Mobile app development

## Deployment

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

### Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@arenarium.com or create an issue in the repository.
