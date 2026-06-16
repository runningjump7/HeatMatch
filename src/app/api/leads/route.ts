import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { customer_name, customer_email, customer_phone, suburb, description, contact_preference } = await request.json();

    // Validate required fields
    if (!customer_name || !customer_email || !suburb || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lead
    const leadId = uuidv4();
    await query(
      `INSERT INTO leads (id, customer_name, customer_email, customer_phone, suburb, description, contact_preference)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [leadId, customer_name, customer_email, customer_phone, suburb, description, contact_preference]
    );

    // Find installers serving this suburb
    const installersResult = await query(
      `SELECT id FROM installers
       WHERE approved = true AND service_suburbs @> $1::text[]`,
      [[suburb]]
    );

    // Send lead to each installer
    for (const installer of installersResult.rows) {
      await query(
        `INSERT INTO leads_sent (lead_id, installer_id)
         VALUES ($1, $2)`,
        [leadId, installer.id]
      );
    }

    return NextResponse.json({
      success: true,
      leadId,
      installersNotified: installersResult.rows.length,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
