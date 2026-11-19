import { readFileSync } from 'fs';

// Load .env.local manually
const envContent = readFileSync('./.env.local', 'utf8');
const envLines = envContent.split('\n');
for (const line of envLines) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    const value = valueParts.join('=').trim();
    if (key === 'DATABASE_URL') {
      process.env.DATABASE_URL = value;
      break;
    }
  }
}

import { query } from '../lib/db/index.js';

async function migrateMatches() {
  try {
    // Check if columns exist
    const result = await query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'matches' AND column_name IN ('team_a_id', 'team_b_id');
    `);
    const existingColumns = result.map(r => r.column_name);

    if (!existingColumns.includes('team_a_id')) {
      await query(`ALTER TABLE matches ADD COLUMN team_a_id TEXT NOT NULL REFERENCES teams(id);`);
      console.log('Added team_a_id column');
    }
    if (!existingColumns.includes('team_b_id')) {
      await query(`ALTER TABLE matches ADD COLUMN team_b_id TEXT NOT NULL REFERENCES teams(id);`);
      console.log('Added team_b_id column');
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateMatches();