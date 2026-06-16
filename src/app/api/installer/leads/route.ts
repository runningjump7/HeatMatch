import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

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
    const status = request.nextUrl.searchParams.get('status');

    let whereClause = `installer_id = $1`;
    if (status && status !== 'all') {
      whereClause += ` AND status = '${status}'`;
    }

    const leadsResult = await query(
      `SELECT
        l.id,
        l.customer_name,
        l.customer_email,
        l.customer_phone,
        l.suburb,
        l.description,
        l.status,
        l.rejection_reason,
        l.completed_notes,
        l.created_at
      FROM leads l
      WHERE ${whereClause}
      ORDER BY l.created_at DESC`,
      [installerId]
    );

    return NextResponse.json({ leads: leadsResult.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
