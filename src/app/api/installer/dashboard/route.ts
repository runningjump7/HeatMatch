import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session cookie
    const sessionCookie = request.cookies.get('tradeev2_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Look up user
    const userResult = await query(
      `SELECT id, email, installer_id FROM users WHERE id = $1`,
      [sessionCookie]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Get installer details
    const installerResult = await query(
      `SELECT business_name, slug, verified_at FROM installers WHERE id = $1`,
      [user.installer_id]
    );

    if (installerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Installer profile not found' },
        { status: 404 }
      );
    }

    const installer = installerResult.rows[0];

    return NextResponse.json({
      businessName: installer.business_name,
      email: user.email,
      installerSlug: installer.slug,
      verifiedAt: installer.verified_at,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
