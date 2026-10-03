/**
 * Integration tests for v1.2 Installer Directory APIs
 *
 * Tests:
 * - GET /api/installers (list with pagination, filtering, language support)
 * - GET /api/installers/[slug] (detail view with language fallback)
 */

import { query } from '@/lib/db';

// Test data setup
const TEST_INSTALLERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    slug: 'abc-heating-and-cooling-550e8400',
    business_name: 'ABC Heating and Cooling',
    email: 'contact@abc-heating.co.nz',
    phone: '09-555-1234',
    business_number: '12-345-678',
    suburb_primary: 'Waitemata',
    service_suburbs: ['Waitemata', 'Birkenhead', 'Devonport'],
    photo_url: 'https://example.com/photo.jpg',
    bio: 'Family-owned business operating since 2011...',
    years_in_business: 15,
    status: 'verified',
    verified_at: new Date('2026-06-15').toISOString(),
    profile_active: true,
    clerk_user_id: 'user_abc123',
    created_at: new Date('2026-01-10').toISOString(),
    updated_at: new Date('2026-09-20').toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    slug: 'cooltech-install-660e8400',
    business_name: 'CoolTech Install',
    email: 'hello@cooltech.co.nz',
    phone: '09-555-5678',
    business_number: null,
    suburb_primary: 'Takapuna',
    service_suburbs: ['Takapuna', 'Devonport', 'Waitemata'],
    photo_url: null,
    bio: null,
    years_in_business: null,
    status: 'unclaimed',
    verified_at: null,
    profile_active: true,
    clerk_user_id: null,
    created_at: new Date('2026-02-15').toISOString(),
    updated_at: new Date('2026-08-20').toISOString(),
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    slug: 'pro-hvac-systems-770e8400',
    business_name: 'Pro HVAC Systems',
    email: 'info@prohvac.co.nz',
    phone: '09-555-9999',
    business_number: '98-765-432',
    suburb_primary: 'Milford',
    service_suburbs: ['Milford', 'Castor Bay', 'Takapuna'],
    photo_url: null,
    bio: 'Professional HVAC installation and service...',
    years_in_business: 8,
    status: 'verified',
    verified_at: new Date('2026-05-20').toISOString(),
    profile_active: true,
    clerk_user_id: 'user_pro789',
    created_at: new Date('2026-01-20').toISOString(),
    updated_at: new Date('2026-09-15').toISOString(),
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    slug: 'inactive-installer-880e8400',
    business_name: 'Inactive Installer',
    email: 'inactive@example.co.nz',
    phone: '09-555-0000',
    business_number: null,
    suburb_primary: 'Milford',
    service_suburbs: ['Milford'],
    photo_url: null,
    bio: 'This installer should not appear in listings',
    years_in_business: 5,
    status: 'verified',
    verified_at: new Date('2026-06-01').toISOString(),
    profile_active: false, // INACTIVE - should be filtered out
    clerk_user_id: null,
    created_at: new Date('2026-03-10').toISOString(),
    updated_at: new Date('2026-09-10').toISOString(),
  },
];

const TEST_TRANSLATIONS = [
  {
    installer_id: '550e8400-e29b-41d4-a716-446655440000',
    language: 'en',
    business_name: 'ABC Heating and Cooling',
    bio: 'Family-owned business operating since 2011. We specialize in heat pump installation...',
  },
  {
    installer_id: '550e8400-e29b-41d4-a716-446655440000',
    language: 'zh-cn',
    business_name: 'ABC 加热与冷却',
    bio: '家族经营的企业自2011年以来运营。我们专门从事热泵安装...',
  },
  {
    installer_id: '550e8400-e29b-41d4-a716-446655440000',
    language: 'zh-tw',
    business_name: 'ABC 加熱與冷卻',
    bio: '家族經營的企業自2011年以來運營。我們專門從事熱泵安裝...',
  },
  {
    installer_id: '660e8400-e29b-41d4-a716-446655440001',
    language: 'en',
    business_name: 'CoolTech Install',
    bio: null,
  },
  {
    installer_id: '770e8400-e29b-41d4-a716-446655440002',
    language: 'en',
    business_name: 'Pro HVAC Systems',
    bio: 'Professional HVAC installation and service for North Shore...',
  },
  {
    installer_id: '880e8400-e29b-41d4-a716-446655440003',
    language: 'en',
    business_name: 'Inactive Installer',
    bio: 'This installer should not appear in listings',
  },
];

// Helper functions
async function setupTestData() {
  try {
    // Clear existing test data (optional)
    await query('DELETE FROM installer_translations WHERE installer_id = ANY($1)', [
      TEST_INSTALLERS.map((i) => i.id),
    ]);
    await query('DELETE FROM installers WHERE id = ANY($1)', [TEST_INSTALLERS.map((i) => i.id)]);

    // Insert installers
    for (const installer of TEST_INSTALLERS) {
      await query(
        `INSERT INTO installers (
          id, slug, business_name, email, phone, business_number, suburb_primary,
          service_suburbs, photo_url, bio, years_in_business, status, verified_at,
          profile_active, clerk_user_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          installer.id,
          installer.slug,
          installer.business_name,
          installer.email,
          installer.phone,
          installer.business_number,
          installer.suburb_primary,
          installer.service_suburbs,
          installer.photo_url,
          installer.bio,
          installer.years_in_business,
          installer.status,
          installer.verified_at,
          installer.profile_active,
          installer.clerk_user_id,
          installer.created_at,
          installer.updated_at,
        ]
      );
    }

    // Insert translations
    for (const translation of TEST_TRANSLATIONS) {
      await query(
        `INSERT INTO installer_translations (installer_id, language, business_name, bio)
         VALUES ($1, $2, $3, $4)`,
        [
          translation.installer_id,
          translation.language,
          translation.business_name,
          translation.bio,
        ]
      );
    }

    console.log('✓ Test data setup complete');
  } catch (error) {
    console.error('✗ Failed to setup test data:', error);
    throw error;
  }
}

async function teardownTestData() {
  try {
    await query('DELETE FROM installer_translations WHERE installer_id = ANY($1)', [
      TEST_INSTALLERS.map((i) => i.id),
    ]);
    await query('DELETE FROM installers WHERE id = ANY($1)', [TEST_INSTALLERS.map((i) => i.id)]);
    console.log('✓ Test data teardown complete');
  } catch (error) {
    console.error('✗ Failed to teardown test data:', error);
    throw error;
  }
}

// Test suites
async function testListInstallers() {
  console.log('\n📋 Testing GET /api/installers');

  const baseUrl = 'http://localhost:3000/api/installers';

  // Test 1: Default request
  console.log('\n  Test 1: Default request (no filters)');
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();

    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!data.success) throw new Error('success should be true');
    if (!Array.isArray(data.data.installers)) throw new Error('installers should be an array');
    if (data.data.installers.length === 0) throw new Error('Should have results');
    if (data.data.pagination.page !== 1) throw new Error('Default page should be 1');
    if (data.data.pagination.limit !== 20) throw new Error('Default limit should be 20');

    // Should include both verified and unclaimed, but not inactive
    const hasVerified = data.data.installers.some((i: any) => i.status === 'verified');
    const hasUnclaimed = data.data.installers.some((i: any) => i.status === 'unclaimed');
    if (!hasVerified) throw new Error('Should have verified installers');
    if (!hasUnclaimed) throw new Error('Should have unclaimed installers');

    const inactiveInstaller = data.data.installers.find(
      (i: any) => i.slug === 'inactive-installer-880e8400'
    );
    if (inactiveInstaller) throw new Error('Should not include inactive installers');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 2: Pagination
  console.log('\n  Test 2: Pagination (page=1, limit=2)');
  try {
    const response = await fetch(`${baseUrl}?page=1&limit=2`);
    const data = await response.json();

    if (data.data.pagination.page !== 1) throw new Error('Page should be 1');
    if (data.data.pagination.limit !== 2) throw new Error('Limit should be 2');
    if (data.data.installers.length > 2) throw new Error('Should not exceed limit');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 3: Out-of-range page
  console.log('\n  Test 3: Out-of-range page (page=999)');
  try {
    const response = await fetch(`${baseUrl}?page=999`);
    const data = await response.json();

    if (!data.success) throw new Error('Should still succeed with empty results');
    if (data.data.installers.length !== 0) throw new Error('Should return empty array');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 4: Suburb filter
  console.log('\n  Test 4: Suburb filter (suburb=Waitemata)');
  try {
    const response = await fetch(`${baseUrl}?suburb=Waitemata`);
    const data = await response.json();

    if (data.data.installers.length === 0) throw new Error('Should have results for Waitemata');

    // All should have Waitemata in primary suburb or service suburbs
    for (const installer of data.data.installers) {
      const hasWaitemata =
        installer.suburb === 'Waitemata' || installer.serviceSuburbs.includes('Waitemata');
      if (!hasWaitemata) throw new Error(`Installer ${installer.id} does not have Waitemata`);
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 5: Case-insensitive suburb filter
  console.log('\n  Test 5: Case-insensitive suburb filter (suburb=waitemata)');
  try {
    const response1 = await fetch(`${baseUrl}?suburb=Waitemata`);
    const data1 = await response1.json();

    const response2 = await fetch(`${baseUrl}?suburb=waitemata`);
    const data2 = await response2.json();

    if (data1.data.installers.length !== data2.data.installers.length) {
      throw new Error('Case-insensitive filter should return same results');
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 6: Language parameter (English)
  console.log('\n  Test 6: Language parameter (lang=en)');
  try {
    const response = await fetch(`${baseUrl}?lang=en`);
    const data = await response.json();

    if (data.data.installers.length === 0) throw new Error('Should have results');
    const first = data.data.installers[0];
    if (!first.businessName) throw new Error('businessName should be present');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 7: Language parameter (Chinese)
  console.log('\n  Test 7: Language parameter (lang=zh-cn)');
  try {
    const response = await fetch(`${baseUrl}?lang=zh-cn`);
    const data = await response.json();

    // ABC installer should have Chinese translation
    const abc = data.data.installers.find((i: any) => i.slug === 'abc-heating-and-cooling-550e8400');
    if (!abc) throw new Error('ABC installer should exist');
    if (!abc.businessName.includes('加热')) throw new Error('Should have Chinese translation');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 8: Invalid language
  console.log('\n  Test 8: Invalid language (lang=fr)');
  try {
    const response = await fetch(`${baseUrl}?lang=fr`);
    const data = await response.json();

    if (response.status !== 400) throw new Error(`Expected 400, got ${response.status}`);
    if (data.success !== false) throw new Error('Should return error');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 9: Status filter (verified)
  console.log('\n  Test 9: Status filter (status=verified)');
  try {
    const response = await fetch(`${baseUrl}?status=verified`);
    const data = await response.json();

    if (data.data.installers.length === 0) throw new Error('Should have verified installers');

    for (const installer of data.data.installers) {
      if (installer.status !== 'verified') throw new Error('All should be verified');
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 10: Status filter (unclaimed)
  console.log('\n  Test 10: Status filter (status=unclaimed)');
  try {
    const response = await fetch(`${baseUrl}?status=unclaimed`);
    const data = await response.json();

    if (data.data.installers.length === 0) throw new Error('Should have unclaimed installers');

    for (const installer of data.data.installers) {
      if (installer.status !== 'unclaimed') throw new Error('All should be unclaimed');
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 11: Invalid limit
  console.log('\n  Test 11: Invalid limit (limit=101)');
  try {
    const response = await fetch(`${baseUrl}?limit=101`);
    const data = await response.json();

    if (data.data.pagination.limit > 100) throw new Error('Limit should be capped at 100');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 12: Cache headers
  console.log('\n  Test 12: Cache headers');
  try {
    const response = await fetch(baseUrl);

    const cacheControl = response.headers.get('Cache-Control');
    if (!cacheControl || !cacheControl.includes('max-age=300')) {
      throw new Error('Should have Cache-Control: max-age=300');
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }
}

async function testDetailInstaller() {
  console.log('\n🔍 Testing GET /api/installers/[slug]');

  const baseUrl = 'http://localhost:3000/api/installers';

  // Test 1: Valid slug
  console.log('\n  Test 1: Valid slug');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400`);
    const data = await response.json();

    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!data.success) throw new Error('success should be true');
    if (!data.data.id) throw new Error('Should have installer data');
    if (data.data.status !== 'verified') throw new Error('ABC should be verified');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 2: Invalid slug
  console.log('\n  Test 2: Invalid slug');
  try {
    const response = await fetch(`${baseUrl}/nonexistent-slug-xyz`);
    const data = await response.json();

    if (response.status !== 404) throw new Error(`Expected 404, got ${response.status}`);
    if (data.success !== false) throw new Error('Should return error');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 3: Language parameter (English)
  console.log('\n  Test 3: Language parameter (lang=en)');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400?lang=en`);
    const data = await response.json();

    if (data.data.businessName !== 'ABC Heating and Cooling') {
      throw new Error('Should have English translation');
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 4: Language parameter (Chinese with fallback)
  console.log('\n  Test 4: Language parameter (lang=zh-cn with fallback chain)');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400?lang=zh-cn`);
    const data = await response.json();

    if (!data.data.businessName.includes('加热')) throw new Error('Should have Chinese translation');
    if (!data.data.fallbackLangs) throw new Error('Should have fallbackLangs');
    if (data.data.language !== 'zh-cn') throw new Error('Should indicate language used');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 5: Invalid language
  console.log('\n  Test 5: Invalid language');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400?lang=fr`);
    const data = await response.json();

    if (response.status !== 400) throw new Error(`Expected 400, got ${response.status}`);

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 6: Verified installer
  console.log('\n  Test 6: Verified installer details');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400`);
    const data = await response.json();

    if (data.data.status !== 'verified') throw new Error('Should be verified');
    if (!data.data.verifiedAt) throw new Error('Should have verifiedAt');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 7: Unclaimed installer
  console.log('\n  Test 7: Unclaimed installer details');
  try {
    const response = await fetch(`${baseUrl}/cooltech-install-660e8400`);
    const data = await response.json();

    if (data.data.status !== 'unclaimed') throw new Error('Should be unclaimed');
    if (data.data.verifiedAt !== null) throw new Error('Should not have verifiedAt');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 8: Null fields
  console.log('\n  Test 8: Null field handling');
  try {
    const response = await fetch(`${baseUrl}/cooltech-install-660e8400`);
    const data = await response.json();

    // CoolTech has null photoUrl and yearsInBusiness
    if (data.data.photoUrl !== null) throw new Error('photoUrl should be null');
    if (data.data.yearsInBusiness !== null) throw new Error('yearsInBusiness should be null');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 9: Service suburbs array
  console.log('\n  Test 9: Service suburbs array');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400`);
    const data = await response.json();

    if (!Array.isArray(data.data.serviceSuburbs)) throw new Error('serviceSuburbs should be array');
    if (data.data.serviceSuburbs.length === 0) throw new Error('Should have service suburbs');

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }

  // Test 10: Cache headers
  console.log('\n  Test 10: Cache headers');
  try {
    const response = await fetch(`${baseUrl}/abc-heating-and-cooling-550e8400`);

    const cacheControl = response.headers.get('Cache-Control');
    if (!cacheControl || !cacheControl.includes('max-age=600')) {
      throw new Error('Should have Cache-Control: max-age=600');
    }

    console.log('    ✓ Passed');
  } catch (error) {
    console.error('    ✗ Failed:', error);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Installer Directory API Tests\n');

  try {
    console.log('⚙️  Setting up test data...');
    await setupTestData();

    await testListInstallers();
    await testDetailInstaller();

    console.log('\n⚙️  Tearing down test data...');
    await teardownTestData();

    console.log('\n✅ All tests complete!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests, setupTestData, teardownTestData };
