import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Look up token
    const tokenResult = await query(
      `SELECT user_id, expires_at FROM password_reset_tokens
       WHERE token = $1 AND used_at IS NULL`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or expired token',
      });
    }

    const tokenRecord = tokenResult.rows[0];
    const now = new Date();
    const expiresAt = new Date(tokenRecord.expires_at);

    if (now > expiresAt) {
      return NextResponse.json({
        valid: false,
        error: 'Token has expired',
      });
    }

    // Get user email for confirmation
    const userResult = await query(
      `SELECT email FROM users WHERE id = $1`,
      [tokenRecord.user_id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        valid: false,
        error: 'User not found',
      });
    }

    return NextResponse.json({
      valid: true,
      email: userResult.rows[0].email,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
