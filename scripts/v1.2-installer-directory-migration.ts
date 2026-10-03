import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrateUp() {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting v1.2 Installer Directory Migration (UP)...\n');

    // Wrap entire migration in transaction for safety
    await client.query('BEGIN;');

    // Step 1: Create installer_translations table
    console.log('Step 1: Creating installer_translations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS installer_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        installer_id UUID NOT NULL REFERENCES installers(id) ON DELETE CASCADE,
        language VARCHAR(10) NOT NULL DEFAULT 'en',
        business_name VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(installer_id, language)
      );
    `);
    console.log('✅ Created installer_translations table\n');

    // Step 2: Add new columns to installers table
    console.log('Step 2: Adding new columns to installers table...');
    await client.query(`
      ALTER TABLE installers
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'unclaimed',
      ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;
    `);
    console.log('✅ Added columns: slug, status, verified_at\n');

    // Step 3: Bulk generate slugs from business_name (single query, idempotent)
    console.log('Step 3: Generating slugs from business names...');
    const slugResult = await client.query(`
      UPDATE installers
      SET slug = LOWER(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(COALESCE(business_name, 'installer'), '[^\w\s-]', '', 'g'),
            '\s+', '-', 'g'
          ),
          '-+', '-', 'g'
        ) || '-' || SUBSTRING(id::text, 1, 8)
      )
      WHERE slug IS NULL;
    `);
    console.log(`✅ Generated slugs for ${slugResult.rowCount} installers\n`);

    // Step 4: Migrate approved → status + set verified_at (idempotent)
    console.log('Step 4: Migrating approved boolean to status enum...');
    const statusResult = await client.query(`
      UPDATE installers
      SET
        status = CASE WHEN approved = true THEN 'verified' ELSE 'unclaimed' END,
        verified_at = CASE WHEN approved = true THEN approved_at ELSE NULL END
      WHERE (approved IS NOT NULL OR approved_at IS NOT NULL) AND status = 'unclaimed';
    `);
    console.log(`✅ Migrated ${statusResult.rowCount} installers\n`);

    // Step 5: Bulk backfill installer_translations with existing EN content
    console.log('Step 5: Backfilling installer_translations with English content...');
    const translationResult = await client.query(`
      INSERT INTO installer_translations (installer_id, language, business_name, bio)
      SELECT id, 'en', business_name, bio FROM installers
      WHERE business_name IS NOT NULL
      ON CONFLICT (installer_id, language) DO NOTHING;
    `);
    console.log(`✅ Backfilled ${translationResult.rowCount} EN translations\n`);

    // Step 6: Create indices for performance
    console.log('Step 6: Creating indices...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_installers_slug ON installers(slug);
      CREATE INDEX IF NOT EXISTS idx_installers_status ON installers(status);
      CREATE INDEX IF NOT EXISTS idx_installers_verified_at ON installers(verified_at);
      CREATE INDEX IF NOT EXISTS idx_installer_translations_installer_id ON installer_translations(installer_id);
      CREATE INDEX IF NOT EXISTS idx_installer_translations_language ON installer_translations(language);
    `);
    console.log('✅ Created indices\n');

    // Commit transaction
    await client.query('COMMIT;');

    console.log('✅✅✅ Migration UP complete! ✅✅✅');
    console.log('\n📋 Summary:');
    console.log('  • Created installer_translations table (EN/ZH-CN/ZH-TW ready)');
    console.log('  • Added slug, status, verified_at columns');
    console.log('  • Backfilled slugs and English translations');
    console.log('  • Migrated approved → status (verified/unclaimed)');
    console.log('  • Created 5 new indices for performance');
    console.log('  • Wrapped in transaction for data safety\n');
  } catch (error) {
    console.error('❌ Error during migration UP, rolling back...');
    try {
      await client.query('ROLLBACK;');
    } catch (rollbackError) {
      console.error('❌ Rollback failed:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function migrateDown() {
  const client = await pool.connect();
  try {
    console.log('🔄 Rolling back v1.2 Installer Directory Migration (DOWN)...\n');

    // Wrap entire rollback in transaction for safety
    await client.query('BEGIN;');

    // Step 1: Drop indices
    console.log('Step 1: Dropping indices...');
    await client.query(`
      DROP INDEX IF EXISTS idx_installer_translations_language;
      DROP INDEX IF EXISTS idx_installer_translations_installer_id;
      DROP INDEX IF EXISTS idx_installers_verified_at;
      DROP INDEX IF EXISTS idx_installers_status;
      DROP INDEX IF EXISTS idx_installers_slug;
    `);
    console.log('✅ Dropped indices\n');

    // Step 2: Drop translations table
    console.log('Step 2: Dropping installer_translations table...');
    await client.query('DROP TABLE IF EXISTS installer_translations CASCADE;');
    console.log('✅ Dropped installer_translations table\n');

    // Step 3: Restore approved boolean from status
    console.log('Step 3: Restoring approved boolean from status...');
    const restoreResult = await client.query(`
      UPDATE installers
      SET approved = (status = 'verified')
      WHERE status IS NOT NULL;
    `);
    console.log(`✅ Restored approved column for ${restoreResult.rowCount} installers\n`);

    // Step 4: Drop new columns
    console.log('Step 4: Removing new columns...');
    await client.query(`
      ALTER TABLE installers
      DROP COLUMN IF EXISTS slug,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS verified_at;
    `);
    console.log('✅ Removed slug, status, verified_at columns\n');

    // Commit transaction
    await client.query('COMMIT;');

    console.log('✅✅✅ Rollback complete! ✅✅✅');
    console.log('\n📋 Summary:');
    console.log('  • Dropped installer_translations table');
    console.log('  • Removed slug, status, verified_at columns');
    console.log('  • Restored approved boolean from status');
    console.log('  • Wrapped in transaction for data safety\n');
  } catch (error) {
    console.error('❌ Error during migration DOWN, rolling back transaction...');
    try {
      await client.query('ROLLBACK;');
    } catch (rollbackError) {
      console.error('❌ Rollback failed:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Main CLI
const command = process.argv[2];
if (command === 'down') {
  migrateDown().catch(console.error);
} else {
  migrateUp().catch(console.error);
}
