// MLBB MPL Verification script to test Supabase connection
// Run with: node verify-mlbb-setup.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMLBBSetup() {
  console.log('🎮 Verifying MLBB MPL setup...\n')

  try {
    // Test 1: Check if we can connect
    console.log('1. Testing connection...')
    const { data, error } = await supabase.from('teams').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return
    }
    console.log('✅ Connection successful!')

    // Test 2: Check if MLBB tables exist
    console.log('\n2. Checking MLBB MPL tables...')
    const mlbbTables = ['teams', 'players', 'heroes', 'tournaments', 'tournament_stages', 'tournament_teams', 'matches', 'games', 'game_stats', 'statistics']
    
    for (const table of mlbbTables) {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        console.error(`❌ Table '${table}' not found or not accessible`)
      } else {
        console.log(`✅ Table '${table}' is accessible`)
      }
    }

    // Test 3: Check MPL teams data
    console.log('\n3. Checking MPL teams...')
    const { data: teams, error: teamsError } = await supabase.from('teams').select('*').limit(10)
    if (teamsError) {
      console.error('❌ Could not fetch teams:', teamsError.message)
    } else {
      console.log(`✅ Found ${teams.length} MPL teams`)
      teams.forEach(team => console.log(`   - ${team.team_name} (${team.team_code}) - ${team.region}`))
    }

    // Test 4: Check MLBB heroes
    console.log('\n4. Checking MLBB heroes...')
    const { data: heroes, error: heroesError } = await supabase.from('heroes').select('*').limit(10)
    if (heroesError) {
      console.error('❌ Could not fetch heroes:', heroesError.message)
    } else {
      console.log(`✅ Found ${heroes.length} MLBB heroes`)
      heroes.forEach(hero => console.log(`   - ${hero.hero_name} (${hero.role}) - Difficulty: ${hero.difficulty_level}`))
    }

    // Test 5: Check MPL tournaments
    console.log('\n5. Checking MPL tournaments...')
    const { data: tournaments, error: tournamentsError } = await supabase.from('tournaments').select('*').limit(5)
    if (tournamentsError) {
      console.error('❌ Could not fetch tournaments:', tournamentsError.message)
    } else {
      console.log(`✅ Found ${tournaments.length} tournaments`)
      tournaments.forEach(tournament => console.log(`   - ${tournament.name} (${tournament.season}) - ${tournament.status}`))
    }

    // Test 6: Check storage buckets
    console.log('\n6. Checking MLBB storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error('❌ Could not fetch storage buckets:', bucketsError.message)
    } else {
      const bucketNames = buckets.map(bucket => bucket.name)
      console.log(`✅ Found ${buckets.length} storage buckets:`, bucketNames)
      
      const requiredMLBBBuckets = ['team-logos', 'player-photos', 'hero-images', 'tournament-assets', 'match-screenshots']
      for (const requiredBucket of requiredMLBBBuckets) {
        if (bucketNames.includes(requiredBucket)) {
          console.log(`   ✅ MLBB bucket '${requiredBucket}' exists`)
        } else {
          console.log(`   ❌ MLBB bucket '${requiredBucket}' missing`)
        }
      }
    }

    // Test 7: Check tournament teams relationship
    console.log('\n7. Checking tournament teams...')
    const { data: tournamentTeams, error: tournamentTeamsError } = await supabase
      .from('tournament_teams')
      .select(`
        *,
        team:teams(team_name, team_code, region),
        tournament:tournaments(name, season)
      `)
      .limit(5)
    
    if (tournamentTeamsError) {
      console.error('❌ Could not fetch tournament teams:', tournamentTeamsError.message)
    } else {
      console.log(`✅ Found ${tournamentTeams.length} tournament team registrations`)
      tournamentTeams.forEach(tt => {
        console.log(`   - ${tt.team.team_name} in ${tt.tournament.name} (Seed: ${tt.seed})`)
      })
    }

    console.log('\n🎉 MLBB MPL setup verification complete!')
    console.log('\nNext steps:')
    console.log('1. Run: npm run dev')
    console.log('2. Visit: http://localhost:3000')
    console.log('3. Check if you can see MPL teams and tournaments')
    console.log('4. Test team logo uploads in the admin panel')

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifyMLBBSetup()
