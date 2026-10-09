import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import * as emailTemplates from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: true, message: 'If that email exists, you will receive a reset link' },
        { status: 200 }
      );
    }

    // Look up user by email
    const userResult = await query(
      `SELECT id, email FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    // Don't reveal whether email exists (security)
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: true, message: 'If that email exists, you will receive a reset link' },
        { status: 200 }
      );
    }

    const user = userResult.rows[0];
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    await query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    // Send email with reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const emailTemplate = emailTemplates.passwordResetEmail(user.email, resetLink);

    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return NextResponse.json({
      success: true,
      message: 'If that email exists, you will receive a reset link',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset' },
      { status: 500 }
    );
  }
}
