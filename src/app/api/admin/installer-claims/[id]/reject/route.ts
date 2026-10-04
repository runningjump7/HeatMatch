import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason = '' } = await request.json();

    // Fetch the claim
    const claimResult = await query(
      'SELECT * FROM installer_claims WHERE id = $1',
      [id]
    );

    if (claimResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    const claim = claimResult.rows[0];

    if (claim.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Claim is not pending' },
        { status: 400 }
      );
    }

    // Update claim to rejected
    await query(
      `UPDATE installer_claims
       SET status = $1, reviewed_at = NOW(), reviewed_by = $2, admin_notes = $3
       WHERE id = $4`,
      ['rejected', null, reason, id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Claim rejected',
        claim: {
          id: claim.id,
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error rejecting claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject claim' },
      { status: 500 }
    );
  }
}
