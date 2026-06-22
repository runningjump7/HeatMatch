import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addStepperFields() {
  const client = await pool.connect();
  try {
    console.log('Adding stepper form fields to leads table...');

    await client.query(`
      ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS property_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS bedrooms VARCHAR(10),
      ADD COLUMN IF NOT EXISTS heat_pumps_needed VARCHAR(10),
      ADD COLUMN IF NOT EXISTS location_to_install TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS existing_unit VARCHAR(50),
      ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS timeline VARCHAR(50),
      ADD COLUMN IF NOT EXISTS homeowner_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT FALSE;
    `);

    console.log('✓ Added stepper form fields to leads table');

    // Rename old customer fields to new homeowner fields if they exist
    const checkResult = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='leads' AND column_name='customer_name'
    `);

    if (checkResult.rows.length > 0) {
      console.log('Migrating old customer fields to new homeowner fields...');
      await client.query(`
        ALTER TABLE leads
        RENAME COLUMN customer_name TO homeowner_name_old;
      `);

      await client.query(`
        UPDATE leads
        SET homeowner_name = homeowner_name_old
        WHERE homeowner_name IS NULL AND homeowner_name_old IS NOT NULL;
      `);

      await client.query(`
        ALTER TABLE leads
        DROP COLUMN homeowner_name_old;
      `);
      console.log('✓ Migrated customer fields');
    }

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Error adding stepper fields:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addStepperFields();
