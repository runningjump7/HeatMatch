import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const {
      business_name,
      phone,
      years_in_business,
      bio,
      primary_suburb,
      service_suburbs,
      website,
      images,
    } = await request.json();

    // Validate required fields
    if (!business_name || !phone || !primary_suburb) {
      return NextResponse.json(
        { error: 'Missing required fields: business_name, phone, primary_suburb' },
        { status: 400 }
      );
    }

    // Create a slug from business name
    const slug = business_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = uuidv4();
    const now = new Date().toISOString();

    // Insert installer
    await query(
      `INSERT INTO installers (
        id, slug, business_name, bio, phone, email,
        suburb_primary, service_suburbs, years_in_business,
        website, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        slug,
        business_name,
        bio || null,
        phone,
        `${slug}@heatmatch.local`, // placeholder email
        primary_suburb,
        JSON.stringify(service_suburbs || []),
        years_in_business || null,
        website || null,
        'pending', // initial status
        now,
        now,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile submitted for approval',
      installerId: id,
      slug,
    });
  } catch (error) {
    console.error('Error during onboarding:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
