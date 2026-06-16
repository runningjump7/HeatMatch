import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createUsersTable() {
  const client = await pool.connect();
  try {
    console.log('Creating users table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'installer',
        installer_id UUID REFERENCES installers(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password_reset_token VARCHAR(255) UNIQUE,
        password_reset_expires_at TIMESTAMP,
        last_login_at TIMESTAMP,
        CONSTRAINT role_check CHECK (role IN ('installer', 'admin'))
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_installer_id ON users(installer_id);
    `);

    console.log('✓ Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createUsersTable().catch(console.error);
