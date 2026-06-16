import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addInstallerIdToLeads() {
  const client = await pool.connect();
  try {
    console.log('Adding installer_id to leads table...');
    await client.query(`
      ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS installer_id UUID REFERENCES installers(id) ON DELETE CASCADE;
    `);
    console.log('✓ installer_id added to leads table');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addInstallerIdToLeads().catch(console.error);
