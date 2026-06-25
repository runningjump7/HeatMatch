/**
 * API Integration Tests for Quote Form
 *
 * Tests that the API accepts both residential and commercial property submissions
 * with their respective required fields:
 * - Residential (home/apartment): requires bedrooms
 * - Commercial (office/commercial): requires square_meters
 */

const API_URL = process.env.API_URL || 'http://localhost:3000/api/leads';

async function testCommercialProperty() {
  console.log('\n🧪 TEST: Commercial Property Submission');
  console.log('─'.repeat(50));

  const payload = {
    service_type: 'new_install',
    property_type: 'office',
    bedrooms: null,
    square_meters: '500',
    heat_pumps_needed: '2',
    location_to_install: ['Reception Area', 'Conference Room'],
    existing_unit: 'no',
    photos: [],
    timeline: 'asap',
    homeowner_name: 'Commercial Test',
    phone: '0912345678',
    email: 'commercial@test.com',
    suburb: 'Auckland',
    consent_given: true
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.leadId) {
      console.log('✅ PASS - Commercial submission accepted');
      console.log(`   Created lead: ${data.leadId}`);
      return true;
    } else {
      console.log('❌ FAIL - Commercial rejected');
      console.log(`   Status: ${res.status}`);
      console.log(`   Error: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`);
    return false;
  }
}

async function testResidentialProperty() {
  console.log('\n🧪 TEST: Residential Property Submission');
  console.log('─'.repeat(50));

  const payload = {
    service_type: 'new_install',
    property_type: 'home',
    bedrooms: '3',
    square_meters: null,
    heat_pumps_needed: '1',
    location_to_install: ['Lounge', 'Main Bedroom'],
    existing_unit: 'yes',
    photos: [],
    timeline: 'asap',
    homeowner_name: 'Residential Test',
    phone: '0987654321',
    email: 'residential@test.com',
    suburb: 'Takapuna',
    consent_given: true
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.leadId) {
      console.log('✅ PASS - Residential submission accepted');
      console.log(`   Created lead: ${data.leadId}`);
      return true;
    } else {
      console.log('❌ FAIL - Residential rejected');
      console.log(`   Status: ${res.status}`);
      console.log(`   Error: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  HEATMATCH QUOTE FORM - API INTEGRATION TESTS     ║');
  console.log('╚════════════════════════════════════════════════════╝');

  const test1 = await testCommercialProperty();
  const test2 = await testResidentialProperty();

  console.log('\n╔════════════════════════════════════════════════════╗');
  if (test1 && test2) {
    console.log('║  ✅ ALL TESTS PASSED                               ║');
    console.log('║  Form can submit both property types               ║');
  } else {
    console.log('║  ❌ SOME TESTS FAILED                              ║');
    console.log('║  Fix errors before deploying                       ║');
  }
  console.log('╚════════════════════════════════════════════════════╝\n');

  process.exit(test1 && test2 ? 0 : 1);
}

runTests();
