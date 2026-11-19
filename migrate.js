import { readFileSync } from 'fs';
import { Pool } from 'pg';

// Read .env.local
const envContent = readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');
let databaseUrl = '';
for (const line of envLines) {
  if (line.startsWith('DATABASE_URL=')) {
    databaseUrl = line.split('=')[1].trim();
    break;
  }
}

if (!databaseUrl) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  try {
    // Check existing columns
    const result = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'matches'
      ORDER BY ordinal_position;
    `);
    const existingColumns = result.rows.map(r => r.column_name);
    console.log('Existing columns:', existingColumns);

    const requiredColumns = {
      id: 'TEXT PRIMARY KEY',
      slug: 'TEXT NOT NULL',
      status: 'TEXT NOT NULL',
      format: 'TEXT NOT NULL',
      series_id: 'TEXT REFERENCES series(id) ON DELETE SET NULL',
      series_name: 'TEXT NOT NULL',
      venue: 'TEXT NOT NULL',
      toss: 'TEXT',
      summary: 'TEXT',
      result_text: 'TEXT',
      start_at: 'TIMESTAMPTZ',
      last_updated_at: 'TIMESTAMPTZ',
      current_run_rate: 'NUMERIC(8,2)',
      required_run_rate: 'NUMERIC(8,2)',
      target: 'INTEGER',
      overs: 'TEXT',
      team_a_id: 'TEXT REFERENCES teams(id)',
      team_b_id: 'TEXT REFERENCES teams(id)',
      team_a_score: 'TEXT',
      team_b_score: 'TEXT'
    };

    for (const [col, type] of Object.entries(requiredColumns)) {
      if (!existingColumns.includes(col)) {
        // For NOT NULL columns, first add as nullable, then update data, then make NOT NULL
        if (type.includes('NOT NULL')) {
          const nullableType = type.replace(' NOT NULL', '');
          await pool.query(`ALTER TABLE matches ADD COLUMN ${col} ${nullableType};`);
          console.log(`Added ${col} column (nullable)`);

          // Provide defaults for existing rows
          if (col === 'slug') {
            await pool.query(`UPDATE matches SET ${col} = 'match-' || id WHERE ${col} IS NULL;`);
          } else if (col === 'format') {
            await pool.query(`UPDATE matches SET ${col} = 'ODI' WHERE ${col} IS NULL;`);
          } else if (col === 'series_name') {
            await pool.query(`UPDATE matches SET ${col} = 'Unknown Series' WHERE ${col} IS NULL;`);
          } else if (col === 'venue') {
            // venue already exists, skip
          } else if (col === 'status') {
            // status already exists, skip
          } else {
            // For other NOT NULL, set empty string or 0
            if (type.includes('TEXT')) {
              await pool.query(`UPDATE matches SET ${col} = '' WHERE ${col} IS NULL;`);
            } else if (type.includes('INTEGER')) {
              await pool.query(`UPDATE matches SET ${col} = 0 WHERE ${col} IS NULL;`);
            }
          }

          // Now make it NOT NULL
          await pool.query(`ALTER TABLE matches ALTER COLUMN ${col} SET NOT NULL;`);
          console.log(`Made ${col} NOT NULL`);
        } else {
          await pool.query(`ALTER TABLE matches ADD COLUMN ${col} ${type};`);
          console.log(`Added ${col} column`);
        }
      }
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await pool.end();
  }
}

migrate();