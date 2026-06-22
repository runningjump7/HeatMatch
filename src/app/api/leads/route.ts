import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const {
      service_type,
      property_type,
      bedrooms,
      heat_pumps_needed,
      location_to_install,
      existing_unit,
      photos,
      timeline,
      homeowner_name,
      phone,
      email,
      suburb,
      consent_given,
    } = await request.json();

    // Validate required string/non-array fields
    if (
      !service_type ||
      !property_type ||
      !bedrooms ||
      !heat_pumps_needed ||
      !existing_unit ||
      !timeline ||
      !homeowner_name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !suburb?.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate location_to_install is an array with at least one item
    if (!Array.isArray(location_to_install) || location_to_install.length === 0) {
      return NextResponse.json(
        { error: 'At least one location must be selected' },
        { status: 400 }
      );
    }

    if (!consent_given) {
      return NextResponse.json(
        { error: 'Consent required' },
        { status: 400 }
      );
    }

    const leadId = uuidv4();

    await query(
      `INSERT INTO leads (
        id,
        service_type,
        property_type,
        bedrooms,
        heat_pumps_needed,
        location_to_install,
        existing_unit,
        photos,
        timeline,
        homeowner_name,
        phone,
        email,
        suburb,
        consent_given,
        status,
        created_at
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())`,
      [
        leadId,
        service_type,
        property_type,
        bedrooms,
        heat_pumps_needed,
        location_to_install,
        existing_unit,
        photos || [],
        timeline,
        homeowner_name.trim(),
        phone.trim(),
        email.toLowerCase().trim(),
        suburb.trim(),
        consent_given,
        'new',
      ]
    );

    return NextResponse.json({
      success: true,
      leadId,
      status: 'new',
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
