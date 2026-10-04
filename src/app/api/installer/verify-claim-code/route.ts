import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { claimId, code } = await request.json();

    if (!claimId || !code) {
      return NextResponse.json(
        { success: false, error: 'Missing claimId or code' },
        { status: 400 }
      );
    }

    // Get the claim
    const claimResult = await query(
      'SELECT * FROM installer_claims WHERE id = $1',
      [claimId]
    );

    if (claimResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    const claim = claimResult.rows[0];

    // Check if already verified
    if (claim.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'This claim has already been processed' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > new Date(claim.claim_token_expires)) {
      return NextResponse.json(
        { success: false, error: 'Code has expired. Request a new one.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (claim.verification_attempts >= 3) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Request a new code.' },
        { status: 400 }
      );
    }

    // Verify code
    if (code !== claim.claim_token) {
      // Increment attempts
      await query(
        'UPDATE installer_claims SET verification_attempts = verification_attempts + 1 WHERE id = $1',
        [claimId]
      );

      return NextResponse.json(
        { success: false, error: 'Invalid code. Please try again.' },
        { status: 400 }
      );
    }

    // Code is correct! Don't create account yet - just mark as verified
    // Account creation happens in the next step when they set password
    await query(
      'UPDATE installer_claims SET verification_attempts = 0 WHERE id = $1',
      [claimId]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Code verified successfully',
        claimId,
        nextStep: 'createPassword',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
