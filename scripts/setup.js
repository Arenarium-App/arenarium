#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Arenarium...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update the Supabase credentials in .env.local');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Set up a Supabase project at https://supabase.com');
console.log('2. Run the database-schema.sql in your Supabase SQL editor');
console.log('3. Update the environment variables in .env.local');
console.log('4. Run "npm run dev" to start the development server');
console.log('\n🎉 Happy coding!');
