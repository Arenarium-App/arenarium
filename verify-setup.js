// Verification script to test Supabase connection
// Run with: node verify-setup.js

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

async function verifySetup() {
  console.log('🔍 Verifying Supabase setup...\n')

  try {
    // Test 1: Check if we can connect
    console.log('1. Testing connection...')
    const { data, error } = await supabase.from('teams').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return
    }
    console.log('✅ Connection successful!')

    // Test 2: Check if tables exist
    console.log('\n2. Checking tables...')
    const tables = ['teams', 'tournaments', 'tournament_stages', 'tournament_teams', 'matches', 'statistics']
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        console.error(`❌ Table '${table}' not found or not accessible`)
      } else {
        console.log(`✅ Table '${table}' is accessible`)
      }
    }

    // Test 3: Check sample data
    console.log('\n3. Checking sample data...')
    const { data: teams, error: teamsError } = await supabase.from('teams').select('*').limit(5)
    if (teamsError) {
      console.error('❌ Could not fetch teams:', teamsError.message)
    } else {
      console.log(`✅ Found ${teams.length} teams`)
      teams.forEach(team => console.log(`   - ${team.team_name} (${team.team_code})`))
    }

    const { data: tournaments, error: tournamentsError } = await supabase.from('tournaments').select('*').limit(5)
    if (tournamentsError) {
      console.error('❌ Could not fetch tournaments:', tournamentsError.message)
    } else {
      console.log(`✅ Found ${tournaments.length} tournaments`)
      tournaments.forEach(tournament => console.log(`   - ${tournament.name} (${tournament.status})`))
    }

    // Test 4: Check storage buckets
    console.log('\n4. Checking storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error('❌ Could not fetch storage buckets:', bucketsError.message)
    } else {
      const bucketNames = buckets.map(bucket => bucket.name)
      console.log(`✅ Found ${buckets.length} storage buckets:`, bucketNames)
      
      const requiredBuckets = ['team-logos', 'tournament-assets']
      for (const requiredBucket of requiredBuckets) {
        if (bucketNames.includes(requiredBucket)) {
          console.log(`   ✅ Required bucket '${requiredBucket}' exists`)
        } else {
          console.log(`   ❌ Required bucket '${requiredBucket}' missing`)
        }
      }
    }

    console.log('\n🎉 Setup verification complete!')
    console.log('\nNext steps:')
    console.log('1. Run: npm run dev')
    console.log('2. Visit: http://localhost:3000')
    console.log('3. Check if the application loads correctly')

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifySetup()
