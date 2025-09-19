const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStorage() {
  console.log('🔍 Checking storage setup...');
  
  try {
    // Check existing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error fetching buckets:', bucketsError);
      return;
    }
    
    console.log('\n📦 Existing buckets:');
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
    });
    
    // Check if MLBB buckets exist
    const requiredBuckets = ['team-logos', 'player-photos', 'hero-images', 'tournament-assets', 'match-screenshots'];
    const existingBucketNames = buckets.map(b => b.name);
    
    console.log('\n🎯 MLBB MPL bucket status:');
    requiredBuckets.forEach(bucketName => {
      if (existingBucketNames.includes(bucketName)) {
        console.log(`  ✅ ${bucketName} - EXISTS`);
      } else {
        console.log(`  ❌ ${bucketName} - MISSING`);
      }
    });
    
    // Check RLS policies
    console.log('\n🔒 Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'objects');
    
    if (policiesError) {
      console.log('❌ Could not fetch RLS policies:', policiesError.message);
    } else {
      console.log(`Found ${policies.length} RLS policies for storage.objects`);
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkStorage();
