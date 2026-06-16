import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateSchema() {
  const client = await pool.connect();
  try {
    console.log('Updating database schema for MVP...');

    // 1. Update installers table
    console.log('Updating installers table...');
    await client.query(`
      ALTER TABLE installers
      ADD COLUMN IF NOT EXISTS years_in_business INTEGER,
      ADD COLUMN IF NOT EXISTS profile_active BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);
    console.log('✓ installers table updated');

    // 2. Update leads table
    console.log('Updating leads table...');
    await client.query(`
      ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
      ADD COLUMN IF NOT EXISTS completed_notes TEXT,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    `);
    console.log('✓ leads table updated');

    // 3. Create index on leads status
    console.log('Creating index on leads.status...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    `);
    console.log('✓ Index created');

    // 4. Create suburbs table
    console.log('Creating suburbs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS suburbs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        postcode VARCHAR(10),
        region VARCHAR(100)
      );
    `);
    console.log('✓ suburbs table created');

    // 5. Create analytics table
    console.log('Creating analytics table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        installer_id UUID NOT NULL REFERENCES installers(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        search_impressions INTEGER DEFAULT 0,
        profile_views INTEGER DEFAULT 0,
        leads_received_count INTEGER DEFAULT 0,
        leads_accepted_count INTEGER DEFAULT 0,
        UNIQUE(installer_id, date)
      );
    `);
    console.log('✓ analytics table created');

    // 6. Seed North Shore suburbs for MVP
    console.log('Seeding North Shore suburbs...');
    const northShoreSuburbs = [
      { name: 'Takapuna', postcode: '0622', region: 'North Shore' },
      { name: 'Devonport', postcode: '0624', region: 'North Shore' },
      { name: 'Birkenhead', postcode: '0626', region: 'North Shore' },
      { name: 'Milford', postcode: '0620', region: 'North Shore' },
      { name: 'Long Bay', postcode: '0632', region: 'North Shore' },
      { name: 'Northcote', postcode: '0627', region: 'North Shore' },
      { name: 'Beach Haven', postcode: '0614', region: 'North Shore' },
      { name: 'Glenfield', postcode: '0629', region: 'North Shore' },
      { name: 'Unsworth Heights', postcode: '0632', region: 'North Shore' },
    ];

    for (const suburb of northShoreSuburbs) {
      await client.query(
        `INSERT INTO suburbs (name, postcode, region)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO NOTHING`,
        [suburb.name, suburb.postcode, suburb.region]
      );
    }
    console.log(`✓ Seeded ${northShoreSuburbs.length} suburbs`);

    console.log('\n✅ Schema update complete!');
  } catch (error) {
    console.error('Error updating schema:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateSchema().catch(console.error);
