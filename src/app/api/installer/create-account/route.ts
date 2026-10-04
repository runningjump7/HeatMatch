import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { claimId, password, confirmPassword } = await request.json();

    // Validate input
    if (!claimId || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Get the claim
    const claimResult = await query(
      'SELECT installer_id, email FROM installer_claims WHERE id = $1 AND status = $2',
      [claimId, 'pending']
    );

    if (claimResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found or already processed' },
        { status: 404 }
      );
    }

    const claim = claimResult.rows[0];
    const installerId = claim.installer_id;
    const email = claim.email;

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user account
    const userResult = await query(
      `INSERT INTO users (email, password_hash, installer_id, verified_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [email, passwordHash, installerId]
    );

    const userId = userResult.rows[0].id;

    // Mark claim as approved
    await query(
      'UPDATE installer_claims SET status = $1, reviewed_at = NOW(), reviewed_by = $2 WHERE id = $3',
      ['approved', userId, claimId]
    );

    // Update installer status
    await query(
      'UPDATE installers SET account_status = $1 WHERE id = $2',
      ['verified', installerId]
    );

    // TODO: Send welcome email

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        userId,
        nextStep: 'redirect_to_dashboard',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Create account error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
