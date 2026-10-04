/**
 * Heat Pump Installer Scraper
 *
 * Fetches installer data from Google Maps API and local directories.
 * Creates unclaimed installer profiles in the database.
 *
 * Usage:
 *   npx tsx scripts/scrape-installers.ts --limit 50
 */

import { query } from '@/lib/db';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface ScrapedInstaller {
  businessName: string;
  phone?: string;
  website?: string;
  suburb: string;
  photoUrl?: string;
}

/**
 * Fetch installers from Google Maps API
 * Requires: GOOGLE_MAPS_API_KEY env var
 */
async function scrapeGoogleMaps(
  searchQuery: string = 'heat pump installers',
  location: string = 'Auckland, New Zealand',
  limit: number = 50
): Promise<ScrapedInstaller[]> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY env var required');
  }

  console.log(`🔍 Scraping Google Maps for "${searchQuery}" near ${location}...`);

  // Note: This is a placeholder for the actual Google Maps API call
  // Real implementation would use @googlemaps/js-client library
  // Example:
  // const response = await googleMapsClient.placesNearby({
  //   location: { lat: -37.0749, lng: 174.9008 }, // Auckland coords
  //   radius: 30000, // 30km
  //   keyword: searchQuery,
  //   type: 'plumber', // closest service type
  // });

  console.log('⚠️  Google Maps API integration requires setup');
  return [];
}

/**
 * Deduplicate by business name + phone (fuzzy matching)
 */
function deduplicateInstallers(installers: ScrapedInstaller[]): ScrapedInstaller[] {
  const seen = new Set<string>();
  const deduped: ScrapedInstaller[] = [];

  for (const installer of installers) {
    const key = `${installer.businessName.toLowerCase().trim()}|${installer.phone || 'unknown'}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(installer);
    }
  }

  return deduped;
}

/**
 * Generate slug from business name
 */
function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

/**
 * Insert scraped installers into database
 */
async function insertScrapedInstallers(installers: ScrapedInstaller[]): Promise<number> {
  let inserted = 0;

  for (const installer of installers) {
    try {
      const slug = generateSlug(installer.businessName);

      // Check if already exists
      const existing = await query(
        'SELECT id FROM installers WHERE slug = $1',
        [slug]
      );

      if (existing.rows.length > 0) {
        console.log(`⏭️  Skipping ${installer.businessName} (already exists)`);
        continue;
      }

      // Insert as unclaimed
      await query(
        `INSERT INTO installers (
          slug,
          business_name,
          email,
          phone,
          suburb_primary,
          service_suburbs,
          bio,
          photo_url,
          status,
          profile_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          slug,
          installer.businessName,
          null, // email not from scraper
          installer.phone,
          installer.suburb,
          [installer.suburb], // service_suburbs
          `Professional heat pump installation and maintenance in ${installer.suburb}.`,
          installer.photoUrl || '/images/unclaimed-placeholder.svg',
          'unclaimed',
          true,
        ]
      );

      inserted++;
      console.log(`✅ Added ${installer.businessName} (${installer.suburb})`);
    } catch (error) {
      console.error(`❌ Failed to insert ${installer.businessName}:`, error);
    }
  }

  return inserted;
}

/**
 * Main scraper
 */
async function main() {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1], 10) : 50;

  try {
    console.log('Starting installer scraper...\n');

    // Scrape from sources
    const googleResults = await scrapeGoogleMaps(
      'heat pump installers',
      'Auckland North Shore, New Zealand',
      limit
    );

    console.log(`\n📊 Results: ${googleResults.length} installers found\n`);

    if (googleResults.length === 0) {
      console.log('ℹ️  No results. To enable Google Maps scraping:');
      console.log('   1. Get API key: https://developers.google.com/maps/documentation/places/web-service');
      console.log('   2. Set GOOGLE_MAPS_API_KEY env var');
      console.log('   3. Install @googlemaps/js-client package');
      return;
    }

    // Deduplicate
    const deduped = deduplicateInstallers(googleResults);
    console.log(`🧹 After dedup: ${deduped.length} installers`);

    // Insert into database
    const inserted = await insertScrapedInstallers(deduped);

    console.log(`\n✨ Successfully added ${inserted} unclaimed installers to database`);
    process.exit(0);
  } catch (error) {
    console.error('Scraper error:', error);
    process.exit(1);
  }
}

main();
