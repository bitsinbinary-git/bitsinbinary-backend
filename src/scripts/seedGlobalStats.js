import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GlobalStats from '../models/GlobalStats.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = [
  {
    platform: 'instagram',
    followers: 5000,
  },
  {
    platform: 'youtube',
    followers: 12,
  },
  {
    platform: 'facebook',
    followers: 21,
  },
  {
    platform: 'twitter',
    followers: 1,
  },
  {
    platform: 'linkedin',
    followers: 22,
  },
  {
    platform: 'github',
    followers: 1,
  }
];

async function seedGlobalStats() {
  try {
    await connectDB();

    // Clear existing data
    await GlobalStats.deleteMany({});
    console.log('✅ Cleared existing global stats');

    // Insert seed data
    await GlobalStats.insertMany(seedData);
    console.log('✅ Global stats seeded successfully');

    // Display the seeded data
    const stats = await GlobalStats.getAllWithTotal();
    console.log('\n📊 Seeded Stats:');
    stats.platforms.forEach(platform => {
      console.log(`   ${platform.platform}: ${platform.formattedFollowers} (${platform.followers})`);
    });
    console.log(`   Total: ${stats.total.formatted} (${stats.total.count})`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedGlobalStats();
