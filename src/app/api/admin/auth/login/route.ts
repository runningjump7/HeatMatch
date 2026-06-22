import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';

// Hardcoded admin user
const ADMIN_USER = {
  email: 'alex@alexvaz.org',
  // Password: Testing123 (hashed with bcryptjs)
  passwordHash: '$2a$10$8w5rku4gY5m7WPY1.AVAGOgF52d7KqU98Jt87tSwxjm8afteohvz.',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Check email
    if (email !== ADMIN_USER.email) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const passwordMatch = await compare(password, ADMIN_USER.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      email: ADMIN_USER.email,
    });

    // Set session cookie (7 days, HTTP-only)
    response.cookies.set('admin_session', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
