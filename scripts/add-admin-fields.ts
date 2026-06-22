import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addAdminFields() {
  const client = await pool.connect();
  try {
    console.log('Adding admin fields to leads and installers tables...');

    // Add admin fields to leads table
    console.log('Updating leads table...');
    await client.query(`
      ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS admin_notes TEXT,
      ADD COLUMN IF NOT EXISTS assigned_installers UUID[] DEFAULT ARRAY[]::UUID[],
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);
    console.log('✓ leads table updated');

    // Ensure installers table has all required fields
    console.log('Updating installers table...');
    await client.query(`
      ALTER TABLE installers
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS primary_suburb VARCHAR(100),
      ADD COLUMN IF NOT EXISTS service_suburbs TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS notes TEXT,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);
    console.log('✓ installers table updated');

    // Create index on assigned_installers for faster queries
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_assigned_installers ON leads USING GIN (assigned_installers);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    `);
    console.log('✓ Indexes created');

    console.log('\n✅ Admin fields migration complete!');
  } catch (error) {
    console.error('Error adding admin fields:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addAdminFields();
