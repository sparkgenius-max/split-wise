#!/usr/bin/env node

/**
 * Database Setup Script for Split-Wise App
 * 
 * This script helps you set up your database for the first time.
 * Run this after you've created your Neon database and have the connection string.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Split-Wise Database Setup\n');

// Check if DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('❌ DATABASE_URL environment variable is not set.');
  console.log('\nPlease set it with your Neon database connection string:');
  console.log('export DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"');
  console.log('\nOr create a .env file with:');
  console.log('DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require');
  process.exit(1);
}

console.log('✅ DATABASE_URL is configured');

try {
  // Generate migration files
  console.log('\n📝 Generating migration files...');
  execSync('npx drizzle-kit generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('\n🗄️  Pushing schema to database...');
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('\n🎯 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Test the application at http://localhost:5000');
  console.log('3. Deploy to Vercel or Google App Engine');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔍 Troubleshooting:');
  console.log('1. Check if your DATABASE_URL is correct');
  console.log('2. Ensure your database is accessible');
  console.log('3. Verify your network connection');
  process.exit(1);
}
