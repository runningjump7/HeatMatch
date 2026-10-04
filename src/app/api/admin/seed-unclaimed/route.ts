import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

const unclaimedInstallers = [
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

export async function POST() {
  try {
    // Delete old unclaimed test installers
    const slugs = unclaimedInstallers.map(i => i.slug);
    await query('DELETE FROM installers WHERE slug = ANY($1)', [slugs]);

    // Create new ones
    for (const installer of unclaimedInstallers) {
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
          $1, $2, $3, $4, $5, $6::text[], $7, $8, $9, $10, true, CASE WHEN $10 = 'verified' THEN NOW() ELSE NULL END
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
    }

    return NextResponse.json({ success: true, count: unclaimedInstallers.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
