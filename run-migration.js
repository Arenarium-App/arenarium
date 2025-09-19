const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🚀 Running MLBB MPL migration...');
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');

// Read the migration script
const fs = require('fs');
const migrationSQL = fs.readFileSync('migrate-to-mlbb-mpl.sql', 'utf8');

console.log('\n📝 Migration SQL loaded, executing...');

// Split the SQL into individual statements and execute them
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute`);

async function runMigration() {
  try {
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`\n${i + 1}/${statements.length}: Executing statement...`);
        console.log(statement.substring(0, 100) + '...');
        
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          // Continue with next statement
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}

runMigration();
