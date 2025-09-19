# Database Setup Instructions

## Step 1: Drop Existing Tables

Run the `drop-tables.sql` script first to clean up the existing database:

```sql
-- Copy and paste the contents of drop-tables.sql
```

## Step 2: Create New Schema

Run the new database schema from `database-schema.sql`:

```sql
-- Copy and paste the contents of database-schema.sql
```

## Step 3: Insert Sample Data

Run the sample data from `sample-data.sql`:

```sql
-- Copy and paste the contents of sample-data.sql
```

## Important Notes

1. **Backup First**: If you have important data, make sure to backup your database before dropping tables
2. **Run in Order**: Execute the scripts in the exact order shown above
3. **Check for Errors**: Make sure each script runs successfully before moving to the next
4. **Verify Tables**: After completion, verify that all tables were created successfully

## Tables Created

### Core Tables
- `teams` - Team information
- `players` - Player profiles
- `heroes` - Hero database
- `skills` - Hero skills
- `items` - Game items
- `emblems` - Emblems
- `talents` - Talents
- `spells` - Spells
- `roles` - Player roles

### New Tournament System Tables
- `tournaments` - Tournament information
- `tournament_teams` - Tournament-team relationships
- `matches` - Match data
- `games` - Individual game data within matches
- `player_performances` - Detailed player stats per game
- `tournament_brackets` - Tournament bracket structure
- `statistics` - Analytics and statistics

## Verification

After setup, you should have:
- ✅ All tables created successfully
- ✅ Sample data populated
- ✅ RLS policies configured
- ✅ Indexes created
- ✅ Triggers set up

## Troubleshooting

If you encounter errors:
1. Check if all previous tables were dropped successfully
2. Verify that you have the necessary permissions
3. Ensure you're running the scripts in the correct database
4. Check for any syntax errors in the SQL scripts
