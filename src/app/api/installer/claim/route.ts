import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import * as emailTemplates from '@/lib/email-templates';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { slug, email, fullName } = await request.json();

    // Validate input
    if (!slug || !email || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug, email, fullName' },
        { status: 400 }
      );
    }

    // Get installer by slug
    const installerResult = await query(
      'SELECT id, business_name, status FROM installers WHERE slug = $1',
      [slug]
    );

    if (installerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Installer not found' },
        { status: 404 }
      );
    }

    const installer = installerResult.rows[0];

    // Check if already verified
    if (installer.status === 'verified') {
      return NextResponse.json(
        { success: false, error: 'This business has already been claimed' },
        { status: 400 }
      );
    }

    // Extract email domain
    const emailDomain = email.split('@')[1]?.toLowerCase() || '';

    // Extract business name and convert to domain-like format
    // e.g., "North Shore Climate Control" → "northshoreclimate" or "northshore" or similar variations
    const businessNameLower = installer.business_name.toLowerCase();
    const businessNameNormalized = businessNameLower
      .replace(/[^a-z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, '') // Remove spaces
      .substring(0, 20); // Take first 20 chars

    // Check if email domain matches business name
    const domainWithoutTld = emailDomain.split('.')[0] || '';
    const isMatchingEmail =
      domainWithoutTld.includes(businessNameNormalized) ||
      businessNameNormalized.includes(domainWithoutTld);

    if (!isMatchingEmail) {
      // Phase 2: Email mismatch - create pending claim for admin review
      const existingPending = await query(
        'SELECT id FROM installer_claims WHERE installer_id = $1 AND email = $2 AND status = $3',
        [installer.id, email, 'pending']
      );

      let claimId: string;
      const isNewClaim = existingPending.rows.length === 0;

      if (existingPending.rows.length > 0) {
        claimId = existingPending.rows[0].id;
      } else {
        const createResult = await query(
          `INSERT INTO installer_claims (installer_id, email, full_name, status, submitted_at)
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING id`,
          [installer.id, email, fullName, 'pending']
        );
        claimId = createResult.rows[0].id;
      }

      // Send claim submitted email (only for new claims, not resends)
      if (isNewClaim) {
        const emailTemplate = emailTemplates.claimSubmittedEmail(fullName, installer.business_name, email);
        await sendEmail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Email domain does not match this business. Admin will review your claim.',
          requiresAdminReview: true,
          claimId,
        },
        { status: 400 }
      );
    }

    // Phase 1: Email matches - generate code for instant verification
    const claimToken = Math.random().toString().slice(2, 8).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if there's already a pending claim for this email
    const existingClaim = await query(
      'SELECT id FROM installer_claims WHERE installer_id = $1 AND email = $2 AND status = $3',
      [installer.id, email, 'pending']
    );

    let claimId: string;

    if (existingClaim.rows.length > 0) {
      // Update existing claim with new token
      claimId = existingClaim.rows[0].id;
      await query(
        'UPDATE installer_claims SET claim_token = $1, claim_token_expires = $2, verification_attempts = 0, resend_count = resend_count + 1 WHERE id = $3',
        [claimToken, expiresAt, claimId]
      );
    } else {
      // Create new claim
      const createResult = await query(
        `INSERT INTO installer_claims (installer_id, email, full_name, status, claim_token, claim_token_expires)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [installer.id, email, fullName, 'pending', claimToken, expiresAt]
      );
      claimId = createResult.rows[0].id;
    }

    // Send verification code email
    const emailTemplate = emailTemplates.verificationCodeEmail(claimToken, fullName, installer.business_name);
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    console.log(`[DEBUG] Claim ${claimId}: Code sent to ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Verification code sent to your email',
        claimId,
        email, // Echo back for UI
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Claim error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process claim' },
      { status: 500 }
    );
  }
}
