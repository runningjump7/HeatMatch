import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const installerResult = await query(
      `SELECT
        id,
        business_name,
        email,
        phone,
        suburb_primary,
        service_suburbs,
        photo_url,
        bio,
        years_in_business,
        images
      FROM installers
      WHERE id = $1 AND approved = true AND profile_active = true`,
      [id]
    );

    if (!installerResult.rows.length) {
      return NextResponse.json({ error: 'Installer not found' }, { status: 404 });
    }

    await query(
      `INSERT INTO analytics (installer_id, date, profile_views)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (installer_id, date)
       DO UPDATE SET profile_views = analytics.profile_views + 1`,
      [id]
    );

    return NextResponse.json({ installer: installerResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching installer profile:', error);
    return NextResponse.json({ error: 'Failed to fetch installer profile' }, { status: 500 });
  }
}