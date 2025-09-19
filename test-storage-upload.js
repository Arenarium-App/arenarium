const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testStorageUpload() {
  console.log('🧪 Testing storage upload...');
  
  try {
    // Create a simple test file
    const testContent = 'Hello, MLBB MPL!';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    // Test upload to team-logos bucket
    console.log('📤 Uploading test file to team-logos bucket...');
    
    const { data, error } = await supabase.storage
      .from('team-logos')
      .upload(`test-${Date.now()}.txt`, testFile);
    
    if (error) {
      console.error('❌ Upload failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Upload successful!');
      console.log('File path:', data.path);
      
      // Test getting the file
      console.log('📥 Testing file retrieval...');
      const { data: fileData, error: getError } = await supabase.storage
        .from('team-logos')
        .download(data.path);
      
      if (getError) {
        console.error('❌ File retrieval failed:', getError);
      } else {
        console.log('✅ File retrieval successful!');
        
        // Clean up test file
        console.log('🧹 Cleaning up test file...');
        const { error: deleteError } = await supabase.storage
          .from('team-logos')
          .remove([data.path]);
        
        if (deleteError) {
          console.error('❌ Cleanup failed:', deleteError);
        } else {
          console.log('✅ Cleanup successful!');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testStorageUpload();
