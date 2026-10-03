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
    photoUrl: 'https://via.placeholder.com/400x300?text=Green+Energy+Solutions',
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
    photoUrl: 'https://via.placeholder.com/400x300?text=Thermal+Comfort',
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
    photoUrl: 'https://via.placeholder.com/400x300?text=Cozy+Climate',
    status: 'verified',
  },
];

async function seedInstallers() {
  try {
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
        ON CONFLICT (slug) DO NOTHING
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

      console.log(`✓ Added ${installer.businessName}`);
    }

    console.log('\n✓ Test installers seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding installers:', error);
    process.exit(1);
  }
}

seedInstallers();
