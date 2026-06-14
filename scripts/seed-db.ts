import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('Seeding database with test installers...');

    const testInstallers = [
      {
        id: uuidv4(),
        business_name: 'Cool Comfort Heat Pumps',
        email: 'info@coolcomfort.co.nz',
        phone: '09 234 5678',
        suburb_primary: 'Takapuna',
        service_suburbs: ['Takapuna', 'Devonport', 'Birkenhead'],
        bio: 'Expert heat pump installers with 15+ years experience. Specializing in residential heat pump systems.',
      },
      {
        id: uuidv4(),
        business_name: 'North Shore Heat Solutions',
        email: 'service@northshoreheat.co.nz',
        phone: '09 345 6789',
        suburb_primary: 'Devonport',
        service_suburbs: ['Devonport', 'Milford', 'Takapuna'],
        bio: 'Licensed heat pump specialists. Fast response times, fully insured.',
      },
      {
        id: uuidv4(),
        business_name: 'Auckland Heat Pump Pro',
        email: 'admin@heatpumppro.co.nz',
        phone: '09 456 7890',
        suburb_primary: 'Birkenhead',
        service_suburbs: ['Birkenhead', 'Northcote', 'Long Bay'],
        bio: 'Certified heat pump installers. Warmer Kiwi Homes approved.',
      },
      {
        id: uuidv4(),
        business_name: 'Thermal Comfort Ltd',
        email: 'quotes@thermalcomfort.co.nz',
        phone: '09 567 8901',
        suburb_primary: 'Milford',
        service_suburbs: ['Milford', 'Glenfield', 'Unsworth Heights'],
        bio: 'Premium heat pump installation services. Energy efficient solutions.',
      },
      {
        id: uuidv4(),
        business_name: 'Elite Heat Pump Services',
        email: 'hello@eliteheatpump.co.nz',
        phone: '09 678 9012',
        suburb_primary: 'Long Bay',
        service_suburbs: ['Long Bay', 'Northcote', 'Beach Haven'],
        bio: 'Specialist heat pump installers serving North Shore. Same-day quotes available.',
      },
    ];

    for (const installer of testInstallers) {
      await client.query(
        `INSERT INTO installers (id, business_name, email, phone, suburb_primary, service_suburbs, bio, approved, approved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP)`,
        [
          installer.id,
          installer.business_name,
          installer.email,
          installer.phone,
          installer.suburb_primary,
          installer.service_suburbs,
          installer.bio,
        ]
      );
      console.log(`✓ Created installer: ${installer.business_name}`);
    }

    console.log('✓ Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch(console.error);
