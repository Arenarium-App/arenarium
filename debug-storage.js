const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugStorage() {
  console.log('🔍 Debugging storage setup...');
  
  try {
    // Check buckets
    console.log('\n📦 Checking buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error fetching buckets:', bucketsError);
      return;
    }
    
    console.log('Existing buckets:');
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
    });
    
    // Check if team-logos bucket exists and is public
    const teamLogosBucket = buckets.find(b => b.name === 'team-logos');
    if (teamLogosBucket) {
      console.log(`\n✅ team-logos bucket exists: ${teamLogosBucket.public ? 'Public' : 'Private'}`);
    } else {
      console.log('\n❌ team-logos bucket does not exist!');
      return;
    }
    
    // Check RLS policies
    console.log('\n🔒 Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT policyname, permissive, roles, cmd, qual 
              FROM pg_policies 
              WHERE tablename = 'objects' AND schemaname = 'storage'
              ORDER BY policyname;` 
      });
    
    if (policiesError) {
      console.log('❌ Could not fetch RLS policies:', policiesError.message);
    } else {
      console.log(`Found ${policies.length} RLS policies for storage.objects:`);
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname} (${policy.cmd})`);
      });
    }
    
    // Test upload with different approaches
    console.log('\n🧪 Testing upload approaches...');
    
    // Test 1: Simple text file
    console.log('\n1. Testing with text file...');
    const textFile = new Blob(['test'], { type: 'text/plain' });
    const { data: textData, error: textError } = await supabase.storage
      .from('team-logos')
      .upload(`test-text-${Date.now()}.txt`, textFile);
    
    if (textError) {
      console.log('❌ Text upload failed:', textError.message);
    } else {
      console.log('✅ Text upload successful');
      // Clean up
      await supabase.storage.from('team-logos').remove([textData.path]);
    }
    
    // Test 2: Image file
    console.log('\n2. Testing with image file...');
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(imageData, 'base64');
    const imageFile = new Blob([imageBuffer], { type: 'image/png' });
    
    const { data: imageDataResult, error: imageError } = await supabase.storage
      .from('team-logos')
      .upload(`test-image-${Date.now()}.png`, imageFile);
    
    if (imageError) {
      console.log('❌ Image upload failed:', imageError.message);
      console.log('Error details:', JSON.stringify(imageError, null, 2));
    } else {
      console.log('✅ Image upload successful');
      // Clean up
      await supabase.storage.from('team-logos').remove([imageDataResult.path]);
    }
    
    // Test 3: Check authentication
    console.log('\n3. Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else if (user) {
      console.log('✅ User authenticated:', user.email);
    } else {
      console.log('⚠️ No user authenticated (this might be the issue)');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugStorage();
