#!/usr/bin/env node

const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Please set up your Supabase credentials in .env.local first!');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function addTeam() {
  console.log('\n🏆 Adding a new team...\n');
  
  const teamName = await question('Team name: ');
  const teamCode = await question('Team code (3-5 characters): ');
  const logo = await question('Logo URL (or press Enter for placeholder): ') || `https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=${teamCode}`;
  const region = await question('Region (Indonesia/Malaysia/Philippines/Singapore/Myanmar): ');
  
  const regionMap = {
    'Indonesia': 1,
    'Malaysia': 2,
    'Philippines': 3,
    'Singapore': 4,
    'Myanmar': 5
  };
  
  const regionId = regionMap[region] || 1;
  
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          team_name: teamName,
          team_code: teamCode,
          logo: logo,
          region: region,
          region_id: regionId
        }
      ]);
    
    if (error) {
      console.log('❌ Error adding team:', error.message);
    } else {
      console.log('✅ Team added successfully!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function addPlayer() {
  console.log('\n👤 Adding a new player...\n');
  
  const realName = await question('Real name: ');
  const inGameName = await question('In-game name: ');
  const teamCode = await question('Team code: ');
  const playerPhoto = await question('Player photo URL (or press Enter for placeholder): ') || `https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=${inGameName.charAt(0)}`;
  const role = await question('Role (Tank/Fighter/Assassin/Mage/Marksman/Support): ');
  const status = await question('Status (active/inactive): ') || 'active';
  
  try {
    const { data, error } = await supabase
      .from('players')
      .insert([
        {
          real_name: realName,
          in_game_name: inGameName,
          team_code: teamCode,
          player_photo: playerPhoto,
          role: role,
          status: status
        }
      ]);
    
    if (error) {
      console.log('❌ Error adding player:', error.message);
    } else {
      console.log('✅ Player added successfully!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function addHero() {
  console.log('\n⚔️ Adding a new hero...\n');
  
  const heroName = await question('Hero name: ');
  const heroImg = await question('Hero image URL (or press Enter for placeholder): ') || `https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=${heroName}`;
  const heroRole = await question('Hero role (Tank/Fighter/Assassin/Mage/Marksman/Support): ');
  
  try {
    const { data, error } = await supabase
      .from('heroes')
      .insert([
        {
          hero_name: heroName,
          hero_img: heroImg,
          hero_role: heroRole
        }
      ]);
    
    if (error) {
      console.log('❌ Error adding hero:', error.message);
    } else {
      console.log('✅ Hero added successfully!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function addItem() {
  console.log('\n🛡️ Adding a new item...\n');
  
  const itemName = await question('Item name: ');
  const itemImg = await question('Item image URL (or press Enter for placeholder): ') || `https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=${itemName.replace(/\s+/g, '').substring(0, 3)}`;
  const price = await question('Price: ');
  
  try {
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          item_name: itemName,
          item_img: itemImg,
          price: parseInt(price)
        }
      ]);
    
    if (error) {
      console.log('❌ Error adding item:', error.message);
    } else {
      console.log('✅ Item added successfully!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function showMenu() {
  console.log('\n🎮 Arenarium Data Management Tool\n');
  console.log('1. Add Team');
  console.log('2. Add Player');
  console.log('3. Add Hero');
  console.log('4. Add Item');
  console.log('5. Exit');
  
  const choice = await question('\nSelect an option (1-5): ');
  
  switch (choice) {
    case '1':
      await addTeam();
      break;
    case '2':
      await addPlayer();
      break;
    case '3':
      await addHero();
      break;
    case '4':
      await addItem();
      break;
    case '5':
      console.log('👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('❌ Invalid option. Please try again.');
  }
  
  // Show menu again
  await showMenu();
}

// Start the application
console.log('🚀 Welcome to Arenarium Data Management Tool!');
showMenu().catch(console.error);
