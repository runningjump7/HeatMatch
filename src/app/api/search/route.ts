import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const suburb = request.nextUrl.searchParams.get('suburb')?.trim() || '';
    const suburbPattern = `%${suburb}%`;

    const installersResult = await query(
      `SELECT
        id,
        business_name,
        phone,
        email,
        suburb_primary,
        service_suburbs,
        photo_url,
        bio,
        years_in_business,
        images
      FROM installers
      WHERE approved = true
        AND profile_active = true
        AND (
          $1 = ''
          OR suburb_primary ILIKE $2
          OR EXISTS (
            SELECT 1
            FROM unnest(COALESCE(service_suburbs, ARRAY[]::TEXT[])) AS service_suburb
            WHERE service_suburb ILIKE $2
          )
        )
      ORDER BY years_in_business DESC NULLS LAST, business_name ASC`,
      [suburb, suburbPattern]
    );

    if (installersResult.rows.length > 0) {
      for (const installer of installersResult.rows) {
        await query(
          `INSERT INTO analytics (installer_id, date, search_impressions)
           VALUES ($1, CURRENT_DATE, 1)
           ON CONFLICT (installer_id, date)
           DO UPDATE SET search_impressions = analytics.search_impressions + 1`,
          [installer.id]
        );
      }
    }

    const suburbsResult = await query(
      `SELECT name
       FROM suburbs
       ORDER BY name ASC`
    );

    return NextResponse.json(
      {
        installers: installersResult.rows,
        suburbs: suburbsResult.rows.map((row) => row.name),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error searching installers:', error);
    return NextResponse.json({ error: 'Failed to search installers' }, { status: 500 });
  }
}