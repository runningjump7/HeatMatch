import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addApprovalStatus() {
  const client = await pool.connect();
  try {
    console.log('Adding approval_status column to installers table...');

    await client.query(`
      ALTER TABLE installers
      ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'unverified',
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS business_name TEXT;
    `);

    console.log('✅ approval_status column added');
  } catch (error) {
    console.error('Error adding column:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addApprovalStatus().catch(console.error);
