console.log('\n=== API VALIDATION TEST ===\n');

// Test 1: Commercial property (should accept square_meters)
console.log('TEST 1: Commercial Property Submission');
const commercialPayload = {
  service_type: 'new_install',
  property_type: 'office',
  bedrooms: null,
  square_meters: '500',
  heat_pumps_needed: '2',
  location_to_install: ['Reception Area'],
  existing_unit: 'no',
  photos: [],
  timeline: 'asap',
  homeowner_name: 'Alex Commercial',
  phone: '0912345678',
  email: 'commercial@test.com',
  suburb: 'Auckland',
  consent_given: true
};

try {
  const res = await fetch('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commercialPayload)
  });
  
  const data = await res.json();
  if (res.ok) {
    console.log('✅ PASS: Commercial submission accepted');
    console.log('   Lead ID:', data.leadId);
  } else {
    console.log('❌ FAIL: Commercial rejected with', res.status);
    console.log('   Error:', data);
  }
} catch (e) {
  console.log('❌ ERROR:', e.message);
}

// Test 2: Residential property (should accept bedrooms)
console.log('\nTEST 2: Residential Property Submission');
const residentialPayload = {
  service_type: 'new_install',
  property_type: 'home',
  bedrooms: '3',
  square_meters: null,
  heat_pumps_needed: '1',
  location_to_install: ['Lounge'],
  existing_unit: 'yes',
  photos: [],
  timeline: 'asap',
  homeowner_name: 'Jane Residential',
  phone: '0987654321',
  email: 'residential@test.com',
  suburb: 'Takapuna',
  consent_given: true
};

try {
  const res = await fetch('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(residentialPayload)
  });
  
  const data = await res.json();
  if (res.ok) {
    console.log('✅ PASS: Residential submission accepted');
    console.log('   Lead ID:', data.leadId);
  } else {
    console.log('❌ FAIL: Residential rejected with', res.status);
    console.log('   Error:', data);
  }
} catch (e) {
  console.log('❌ ERROR:', e.message);
}

console.log('\n=== TESTS COMPLETE ===\n');
