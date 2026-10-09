import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, hashPassword, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('tradeev2_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Current password and new password required' },
        { status: 400 }
      );
    }

    // Get user
    const userResult = await query(
      `SELECT id, password_hash FROM users WHERE id = $1`,
      [sessionCookie]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValid = await comparePassword(current_password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Validate new password
    const validation = validatePassword(new_password);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(new_password);

    // Update password
    await query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [passwordHash, user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
