import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('tradeev2_session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { business_name, years_in_business, bio, images, profile_active } = body;

    // Get installer ID
    const userResult = await query(
      `SELECT installer_id FROM users WHERE id = $1`,
      [session.value]
    );

    if (!userResult.rows.length) {
      return NextResponse.json({ error: 'Installer not found' }, { status: 404 });
    }

    const installerId = userResult.rows[0].installer_id;

    // Update installer profile
    await query(
      `UPDATE installers SET
        business_name = $1,
        years_in_business = $2,
        bio = $3,
        images = $4,
        profile_active = $5,
        updated_at = NOW()
      WHERE id = $6`,
      [business_name, years_in_business, bio, images, profile_active, installerId]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('tradeev2_session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get installer ID
    const userResult = await query(
      `SELECT installer_id FROM users WHERE id = $1`,
      [session.value]
    );

    if (!userResult.rows.length) {
      return NextResponse.json({ error: 'Installer not found' }, { status: 404 });
    }

    const installerId = userResult.rows[0].installer_id;

    // Get installer profile
    const profileResult = await query(
      `SELECT * FROM installers WHERE id = $1`,
      [installerId]
    );

    if (!profileResult.rows.length) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: profileResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
