import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addResponseColumns() {
  const client = await pool.connect();
  try {
    console.log('Adding installer response tracking columns to leads table...');

    // Add columns one by one with IF NOT EXISTS logic
    try {
      await client.query(`
        ALTER TABLE leads
        ADD COLUMN installer_response VARCHAR(50);
      `);
      console.log('✓ Added installer_response column');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('✓ installer_response column already exists');
      } else {
        throw error;
      }
    }

    try {
      await client.query(`
        ALTER TABLE leads
        ADD COLUMN installer_response_at TIMESTAMP;
      `);
      console.log('✓ Added installer_response_at column');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('✓ installer_response_at column already exists');
      } else {
        throw error;
      }
    }

    try {
      await client.query(`
        ALTER TABLE leads
        ADD COLUMN installer_response_from UUID;
      `);
      console.log('✓ Added installer_response_from column');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('✓ installer_response_from column already exists');
      } else {
        throw error;
      }
    }

    // Create index for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_installer_response
      ON leads(installer_response);
    `);

    console.log('✓ Created index on installer_response');
  } catch (error) {
    console.error('Error adding columns:', error);
    throw error;
  } finally {
    client.release();
  }
}

addResponseColumns()
  .then(() => {
    console.log('Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
