import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      suburb,
      address,
      description,
      urgency,
      budget,
      property_type,
      system_type,
      contact_preference,
      installer_id,
    } = await request.json();

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !suburb || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leadId = uuidv4();
    let leadStatus = 'unconfirmed';
    let resolvedInstallerId: string | null = null;

    if (installer_id) {
      const installerResult = await query(
        `SELECT id
         FROM installers
         WHERE id = $1 AND approved = true AND profile_active = true`,
        [installer_id]
      );

      if (!installerResult.rows.length) {
        return NextResponse.json(
          { error: 'Installer not available' },
          { status: 404 }
        );
      }

      resolvedInstallerId = installer_id;
      leadStatus = 'new';
    }

    const detailLines = [
      description.trim(),
      '',
      'Project details:',
      `Address: ${address || 'Not provided'}`,
      `Urgency: ${urgency || 'Not provided'}`,
      `Budget: ${budget || 'Not provided'}`,
      `Property type: ${property_type || 'Not provided'}`,
      `System type: ${system_type || 'Not provided'}`,
    ];

    await query(
      `INSERT INTO leads (
        id,
        customer_name,
        customer_email,
        customer_phone,
        suburb,
        description,
        contact_preference,
        installer_id,
        status
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        leadId,
        customer_name,
        customer_email.toLowerCase(),
        customer_phone,
        suburb,
        detailLines.join('\n'),
        contact_preference || 'email',
        resolvedInstallerId,
        leadStatus,
      ]
    );

    if (resolvedInstallerId) {
      await query(
        `INSERT INTO analytics (installer_id, date, leads_received_count)
         VALUES ($1, CURRENT_DATE, 1)
         ON CONFLICT (installer_id, date)
         DO UPDATE SET leads_received_count = analytics.leads_received_count + 1`,
        [resolvedInstallerId]
      );
    }

    return NextResponse.json({
      success: true,
      leadId,
      status: leadStatus,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
