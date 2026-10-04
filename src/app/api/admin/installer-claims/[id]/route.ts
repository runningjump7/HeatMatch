import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await query(
      `SELECT
        ic.id,
        ic.installer_id,
        ic.email,
        ic.full_name,
        ic.status,
        ic.submitted_at,
        ic.reviewed_at,
        ic.admin_notes,
        i.business_name,
        i.slug,
        i.phone,
        i.email as business_email
      FROM installer_claims ic
      JOIN installers i ON ic.installer_id = i.id
      WHERE ic.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        claim: {
          id: row.id,
          installer_id: row.installer_id,
          installer_name: row.business_name,
          slug: row.slug,
          business_phone: row.phone,
          business_email: row.business_email,
          claimed_by_email: row.email,
          claimed_by_name: row.full_name,
          status: row.status,
          submitted_at: row.submitted_at,
          reviewed_at: row.reviewed_at,
          admin_notes: row.admin_notes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claim' },
      { status: 500 }
    );
  }
}
