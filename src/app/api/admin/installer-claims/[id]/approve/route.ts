import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

// Generate temp password (12 chars: alphanumeric + special chars)
function generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { admin_notes = '' } = await request.json();

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

    // Generate temp password
    const tempPassword = generateTempPassword();
    const passwordHash = crypto.createHash('sha256').update(tempPassword).digest('hex');

    // Start transaction-like operations
    // 1. Create user
    const userResult = await query(
      `INSERT INTO users (email, password_hash, installer_id, verified_at, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW(), NOW())
       RETURNING id`,
      [claim.email, passwordHash, claim.installer_id]
    );

    const userId = userResult.rows[0].id;

    // 2. Update claim to approved
    await query(
      `UPDATE installer_claims
       SET status = $1, reviewed_at = NOW(), reviewed_by = $2, admin_notes = $3
       WHERE id = $4`,
      ['approved', userId, admin_notes, id]
    );

    // 3. Update installer to verified
    await query(
      `UPDATE installers
       SET account_status = $1
       WHERE id = $2`,
      ['verified', claim.installer_id]
    );

    // 4. Auto-reject other pending claims for same installer
    await query(
      `UPDATE installer_claims
       SET status = $1, admin_notes = $2
       WHERE installer_id = $3 AND status = 'pending' AND id != $4`,
      ['rejected', 'Another claim for this business was already approved', claim.installer_id, id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Claim approved',
        temp_password: tempPassword,
        user_id: userId,
        claim: {
          id: claim.id,
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve claim' },
      { status: 500 }
    );
  }
}
