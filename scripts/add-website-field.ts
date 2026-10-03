import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addWebsiteField() {
  const client = await pool.connect();
  try {
    console.log('Adding website field to installers table...');
    await client.query(`
      ALTER TABLE installers
      ADD COLUMN IF NOT EXISTS website VARCHAR(255);
    `);
    console.log('✓ website field added to installers table');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addWebsiteField().catch(console.error);
