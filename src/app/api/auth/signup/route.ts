import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Email, password, and confirmation required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join('; ') },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    const existingUser = await query(
      `SELECT id FROM users WHERE email = $1`,
      [emailLower]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create installer first
    const installerResult = await query(
      `INSERT INTO installers (approval_status)
       VALUES ('unverified')
       RETURNING id`,
      []
    );

    const installerId = installerResult.rows[0].id;

    // Create user with installer_id
    const result = await query(
      `INSERT INTO users (email, password_hash, role, installer_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email`,
      [emailLower, hashedPassword, 'installer', installerId]
    );

    const userId = result.rows[0].id;

    // Auto-login by setting session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        userId,
        installerId,
      },
      { status: 201 }
    );

    response.cookies.set('tradeev2_session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
