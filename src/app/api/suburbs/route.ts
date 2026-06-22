import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');

    if (!q || q.length < 1) {
      return NextResponse.json({ suburbs: [] });
    }

    const result = await query(
      `SELECT name FROM suburbs WHERE LOWER(name) LIKE LOWER($1) ORDER BY name LIMIT 10`,
      [`${q}%`]
    );

    const suburbs = result.rows.map((row: any) => row.name);

    return NextResponse.json({ suburbs });
  } catch (error) {
    console.error('Error fetching suburbs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
