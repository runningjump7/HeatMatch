import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('Creating database schema...');

    // Installers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS installers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_user_id VARCHAR(255) UNIQUE,
        business_name VARCHAR(255) NOT NULL,
        business_number VARCHAR(20),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        suburb_primary VARCHAR(100),
        service_suburbs TEXT[],
        photo_url VARCHAR(500),
        bio TEXT,
        approved BOOLEAN DEFAULT false,
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created installers table');

    // Installer licenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS installer_licenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        installer_id UUID NOT NULL REFERENCES installers(id) ON DELETE CASCADE,
        license_type VARCHAR(100),
        license_number VARCHAR(255),
        verified BOOLEAN DEFAULT false,
        verified_at TIMESTAMP,
        document_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created installer_licenses table');

    // Leads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        suburb VARCHAR(100),
        description TEXT,
        contact_preference VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created leads table');

    // Leads sent table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads_sent (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        installer_id UUID NOT NULL REFERENCES installers(id) ON DELETE CASCADE,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        installer_response VARCHAR(50),
        responded_at TIMESTAMP
      );
    `);
    console.log('✓ Created leads_sent table');

    // Analytics daily table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_daily (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        installer_id UUID NOT NULL REFERENCES installers(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        search_impressions INT DEFAULT 0,
        profile_views INT DEFAULT 0,
        call_button_clicks INT DEFAULT 0,
        email_button_clicks INT DEFAULT 0,
        leads_received INT DEFAULT 0,
        leads_interested INT DEFAULT 0,
        UNIQUE(installer_id, date)
      );
    `);
    console.log('✓ Created analytics_daily table');

    // Create indices
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_installers_approved ON installers(approved);
      CREATE INDEX IF NOT EXISTS idx_installers_service_suburbs ON installers USING GIN(service_suburbs);
      CREATE INDEX IF NOT EXISTS idx_leads_suburb ON leads(suburb);
      CREATE INDEX IF NOT EXISTS idx_leads_sent_lead_id ON leads_sent(lead_id);
      CREATE INDEX IF NOT EXISTS idx_leads_sent_installer_id ON leads_sent(installer_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_daily_installer_id ON analytics_daily(installer_id);
    `);
    console.log('✓ Created indices');

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch(console.error);
