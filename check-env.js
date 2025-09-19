require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Service key length:', process.env.SUPABASE_SERVICE_ROLE_KEY.length);
  console.log('Service key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...');
} else {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
  console.log('This is why uploads are failing - the app is falling back to the regular client which requires authentication.');
}
