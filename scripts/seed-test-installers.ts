import { query } from '@/lib/db';

const testInstallers = [
  {
    slug: 'green-energy-solutions',
    businessName: 'Green Energy Solutions',
    email: 'info@greenenergy.nz',
    phone: '09 555 0001',
    suburbPrimary: 'Takapuna',
    serviceSuburbs: ['Takapuna', 'Devonport', 'Birkenhead'],
    yearsInBusiness: 8,
    bio: 'Award-winning heat pump installers specializing in premium residential solutions across the North Shore.',
    photoUrl: '/images/heat-pump-1.jpg',
    status: 'verified',
  },
  {
    slug: 'thermal-comfort-nz',
    businessName: 'Thermal Comfort NZ',
    email: 'hello@thermalcomfort.nz',
    phone: '09 555 0002',
    suburbPrimary: 'Albany',
    serviceSuburbs: ['Albany', 'Glenfield', 'Mairangi Bay'],
    yearsInBusiness: 5,
    bio: 'Expert heat pump installation and maintenance. Fast, reliable service with 5-year warranty.',
    photoUrl: '/images/heat-pump-2.jpg',
    status: 'verified',
  },
  {
    slug: 'cozy-climate-installers',
    businessName: 'Cozy Climate Installers',
    email: 'contact@cozyclimate.nz',
    phone: '09 555 0003',
    suburbPrimary: 'Browns Bay',
    serviceSuburbs: ['Browns Bay', 'Long Bay', 'Milford'],
    yearsInBusiness: 3,
    bio: 'New to the market but fully certified. Competitive pricing on quality heat pump systems.',
    photoUrl: '/images/heat-pump-3.jpg',
    status: 'verified',
  },
  {
    slug: 'north-shore-climate',
    businessName: 'North Shore Climate Control',
    email: 'info@northshoreclimate.co.nz',
    phone: '09 555 0004',
    suburbPrimary: 'Glenfield',
    serviceSuburbs: ['Glenfield', 'Sunnyvale', 'Paremoremo'],
    yearsInBusiness: null,
    bio: 'Professional heat pump installation and maintenance services for residential and small commercial properties.',
    photoUrl: '/images/unclaimed-placeholder.svg',
    status: 'unclaimed',
  },
  {
    slug: 'eco-comfort-systems',
    businessName: 'Eco Comfort Systems',
    email: 'contact@ecocomfort.co.nz',
    phone: '09 555 0005',
    suburbPrimary: 'Northcote',
    serviceSuburbs: ['Northcote', 'Birkenhead', 'Takapuna'],
    yearsInBusiness: null,
    bio: 'Specializing in energy-efficient climate control solutions with eco-friendly heat pump technology.',
    photoUrl: '/images/unclaimed-placeholder.svg',
    status: 'unclaimed',
  },
];

async function seedInstallers() {
  try {
    // Delete old test installers
    const slugs = testInstallers.map(i => i.slug);
    await query('DELETE FROM installers WHERE slug = ANY($1)', [slugs]);
    console.log('✓ Deleted old test installers');

    // Create new ones with images
    for (const installer of testInstallers) {
      const sql = `
        INSERT INTO installers (
          slug,
          business_name,
          email,
          phone,
          suburb_primary,
          service_suburbs,
          years_in_business,
          bio,
          photo_url,
          status,
          profile_active,
          verified_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6::text[], $7, $8, $9, $10, true, NOW()
        )
      `;

      await query(sql, [
        installer.slug,
        installer.businessName,
        installer.email,
        installer.phone,
        installer.suburbPrimary,
        installer.serviceSuburbs,
        installer.yearsInBusiness,
        installer.bio,
        installer.photoUrl,
        installer.status,
      ]);

      console.log(`✓ Created ${installer.businessName} with image: ${installer.photoUrl}`);
    }

    console.log('\n✓ Test installers recreated successfully with images!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding installers:', error);
    process.exit(1);
  }
}

seedInstallers();
