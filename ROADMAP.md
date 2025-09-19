# Arenarium Development Roadmap

## 🎯 Vision

Arenarium aims to become the ultimate multi-game competitive gaming wiki and database, providing comprehensive coverage of competitive gaming scenes across multiple titles.

## 📊 Current Status

### ✅ Phase 1: Mobile Legends: Bang Bang (COMPLETED)
- ✅ Core database schema implemented
- ✅ Teams management system
- ✅ Players database and profiles
- ✅ Heroes catalog with abilities
- ✅ Items database and pricing
- ✅ Match history and statistics
- ✅ Modern, responsive UI
- ✅ Real-time data with Supabase
- ✅ Sample data populated
- ✅ Image optimization and CDN support

## 🚧 Phase 2: Valorant (NEXT)

### Database Schema Extensions
```sql
-- New tables for Valorant
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL UNIQUE,
    agent_img TEXT,
    agent_role VARCHAR(100) NOT NULL, -- Duelist, Initiator, Controller, Sentinel
    agent_abilities TEXT[], -- Array of ability names
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE maps (
    id SERIAL PRIMARY KEY,
    map_name VARCHAR(255) NOT NULL UNIQUE,
    map_img TEXT,
    map_type VARCHAR(100), -- Spike/Deathmatch/etc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE valorant_matches (
    id SERIAL PRIMARY KEY,
    team_1_id INTEGER REFERENCES teams(id),
    team_2_id INTEGER REFERENCES teams(id),
    map_id INTEGER REFERENCES maps(id),
    match_date TIMESTAMP WITH TIME ZONE,
    winner_id INTEGER REFERENCES teams(id),
    score_team_1 INTEGER DEFAULT 0,
    score_team_2 INTEGER DEFAULT 0,
    tournament_name VARCHAR(255),
    stage VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Features to Implement
- 🎯 Agent database with abilities and roles
- 🗺️ Map information and strategies
- 🏆 Valorant-specific tournament data
- 📊 Match statistics and analytics
- 👥 Team and player profiles for Valorant
- 🎨 Valorant-themed UI components

### UI/UX Enhancements
- Game-specific color schemes and branding
- Agent ability visualizations
- Map layout displays
- Match replay integration (future)

## 🎮 Phase 3: League of Legends

### Database Schema Extensions
```sql
-- New tables for League of Legends
CREATE TABLE champions (
    id SERIAL PRIMARY KEY,
    champion_name VARCHAR(255) NOT NULL UNIQUE,
    champion_img TEXT,
    champion_role VARCHAR(100) NOT NULL, -- Top, Jungle, Mid, ADC, Support
    champion_lane VARCHAR(100),
    champion_type VARCHAR(100), -- Assassin, Fighter, Mage, Marksman, Support, Tank
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE runes (
    id SERIAL PRIMARY KEY,
    rune_name VARCHAR(255) NOT NULL UNIQUE,
    rune_img TEXT,
    rune_tree VARCHAR(100), -- Precision, Domination, Sorcery, Resolve, Inspiration
    rune_type VARCHAR(100), -- Keystone, Slot 1, Slot 2, Slot 3
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Features to Implement
- 🏆 Champion database with abilities and roles
- 🎯 Rune system and builds
- 🌍 Regional competitive scenes (LCS, LEC, LCK, LPL)
- 📊 Advanced match analytics
- 🏅 Tournament tracking and statistics

## ⚔️ Phase 4: Dota 2

### Database Schema Extensions
```sql
-- New tables for Dota 2
CREATE TABLE dota_heroes (
    id SERIAL PRIMARY KEY,
    hero_name VARCHAR(255) NOT NULL UNIQUE,
    hero_img TEXT,
    hero_role VARCHAR(100)[], -- Array of roles: Carry, Support, etc.
    hero_attributes VARCHAR(100), -- Strength, Agility, Intelligence
    hero_complexity INTEGER, -- 1-3 complexity rating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE dota_matches (
    id SERIAL PRIMARY KEY,
    team_1_id INTEGER REFERENCES teams(id),
    team_2_id INTEGER REFERENCES teams(id),
    match_duration INTEGER, -- in seconds
    winner_id INTEGER REFERENCES teams(id),
    tournament_name VARCHAR(255),
    patch_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Features to Implement
- 🎯 Hero database with abilities and roles
- 🗺️ Map strategies and meta analysis
- 🏆 International and Major tournament data
- 📊 Competitive scene statistics
- 🎮 Patch analysis and meta tracking

## 🌐 Phase 5: Multi-Game Platform

### Unified Features
- 🎮 Game switching interface
- 🔄 Cross-game comparisons
- 📊 Unified tournament management
- 👥 Multi-game player profiles
- 🏆 Global rankings and statistics

### Technical Enhancements
- 🔄 Unified database schema
- 🎨 Modular UI components
- 📱 Mobile app development
- 🔌 API for third-party integrations
- 🤖 AI-powered insights and predictions

## 🚀 Phase 6: Advanced Features

### Community Features
- 👤 User authentication and profiles
- 💬 Community discussions and forums
- 📝 User-generated content
- 🎯 Fantasy leagues and predictions
- 🏆 Community tournaments

### Analytics and Insights
- 📊 Advanced analytics dashboard
- 📈 Trend analysis and predictions
- 🎯 Performance metrics
- 📱 Real-time notifications
- 🔍 Advanced search and filtering

### Platform Expansion
- 📱 Mobile app (iOS/Android)
- 🖥️ Desktop application
- 📺 Smart TV integration
- 🎮 Gaming console apps
- 🤖 Discord bot integration

## 🎯 Success Metrics

### Phase 1 (MLBB)
- ✅ 1000+ teams in database
- ✅ 5000+ players tracked
- ✅ 100+ heroes catalogued
- ✅ 200+ items documented
- ✅ 10,000+ matches recorded

### Phase 2 (Valorant)
- 🎯 500+ teams in database
- 🎯 2000+ players tracked
- 🎯 20+ agents documented
- 🎯 7+ maps catalogued
- 🎯 5000+ matches recorded

### Phase 3 (League of Legends)
- 🎯 800+ teams in database
- 🎯 3000+ players tracked
- 🎯 150+ champions documented
- 🎯 5+ regions covered
- 🎯 15,000+ matches recorded

## 🛠️ Technical Considerations

### Scalability
- 🔄 Database optimization for large datasets
- 🚀 CDN implementation for global performance
- 📊 Data caching strategies
- 🔍 Full-text search capabilities

### Security
- 🔐 User authentication and authorization
- 🛡️ Data protection and privacy
- 🔒 API rate limiting
- 🚨 Security monitoring and alerts

### Performance
- ⚡ Fast loading times (<3s)
- 📱 Mobile-first responsive design
- 🎯 Progressive Web App (PWA) features
- 🔄 Real-time data updates

## 📅 Timeline Estimates

- **Phase 1 (MLBB)**: ✅ Completed
- **Phase 2 (Valorant)**: Q2 2024
- **Phase 3 (LoL)**: Q4 2024
- **Phase 4 (Dota 2)**: Q2 2025
- **Phase 5 (Multi-Game)**: Q4 2025
- **Phase 6 (Advanced)**: 2026+

## 🤝 Contributing

We welcome contributions from the gaming community! Here's how you can help:

### For Developers
- 🔧 Code contributions and bug fixes
- 🎨 UI/UX improvements
- 📊 Data accuracy and updates
- 🚀 Performance optimizations

### For Content Creators
- 📝 Game guides and strategies
- 🎯 Meta analysis and insights
- 📊 Tournament coverage
- 🎨 Visual content and graphics

### For Data Enthusiasts
- 📊 Data collection and verification
- 🔍 Statistics and analytics
- 📈 Trend analysis
- 🎯 Performance tracking

## 🎉 Conclusion

Arenarium is more than just a gaming wiki - it's a comprehensive platform designed to celebrate and document the competitive gaming landscape. With each phase, we're building towards a future where fans, players, and teams can access the most comprehensive competitive gaming database in the world.

Join us on this journey to create the ultimate competitive gaming encyclopedia! 🎮✨
