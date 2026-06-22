import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanupOldFields() {
  const client = await pool.connect();
  try {
    console.log('Cleaning up old leads table columns...');

    // Check which old columns exist
    const columnResult = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='leads' AND column_name IN ('customer_name', 'customer_email', 'customer_phone', 'address', 'description')
    `);

    const existingColumns = columnResult.rows.map((r: any) => r.column_name);
    console.log('Old columns found:', existingColumns);

    // Drop old columns if they exist
    if (existingColumns.length > 0) {
      const dropQuery = `
        ALTER TABLE leads
        DROP COLUMN IF EXISTS customer_name,
        DROP COLUMN IF EXISTS customer_email,
        DROP COLUMN IF EXISTS customer_phone,
        DROP COLUMN IF EXISTS address,
        DROP COLUMN IF EXISTS description,
        DROP COLUMN IF EXISTS contact_preference,
        DROP COLUMN IF EXISTS urgency,
        DROP COLUMN IF EXISTS budget,
        DROP COLUMN IF EXISTS system_type;
      `;
      await client.query(dropQuery);
      console.log('✓ Dropped old columns');
    }

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('Error cleaning up old fields:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupOldFields();
