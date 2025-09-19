const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test admin client creation
function testAdminClient() {
  console.log('🧪 Testing admin client creation...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
    return;
  }
  
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
    return;
  }
  
  try {
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('✅ Admin client created successfully');
    
    // Test upload with admin client
    console.log('📤 Testing upload with admin client...');
    
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(imageData, 'base64');
    const imageFile = new Blob([imageBuffer], { type: 'image/png' });
    
    adminClient.storage
      .from('team-logos')
      .upload(`admin-test-${Date.now()}.png`, imageFile)
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Admin upload failed:', error);
        } else {
          console.log('✅ Admin upload successful!');
          console.log('File path:', data.path);
          
          // Clean up
          adminClient.storage
            .from('team-logos')
            .remove([data.path])
            .then(() => console.log('✅ Cleanup successful'));
        }
      });
      
  } catch (error) {
    console.error('❌ Admin client creation failed:', error);
  }
}

testAdminClient();
