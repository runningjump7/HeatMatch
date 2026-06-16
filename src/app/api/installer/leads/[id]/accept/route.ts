import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('tradeev2_session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get installer ID
    const userResult = await query(
      `SELECT installer_id FROM users WHERE id = $1`,
      [session.value]
    );

    if (!userResult.rows.length) {
      return NextResponse.json({ error: 'Installer not found' }, { status: 404 });
    }

    const installerId = userResult.rows[0].installer_id;

    // Update lead status to "accepted"
    await query(
      `UPDATE leads SET status = 'accepted' WHERE id = $1 AND installer_id = $2`,
      [id, installerId]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error accepting lead:', error);
    return NextResponse.json({ error: 'Failed to accept lead' }, { status: 500 });
  }
}
