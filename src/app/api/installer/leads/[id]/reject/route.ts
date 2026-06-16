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
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 });
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

    // Update lead status to "rejected"
    await query(
      `UPDATE leads SET status = 'rejected', rejection_reason = $1 WHERE id = $2 AND installer_id = $3`,
      [reason, id, installerId]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error rejecting lead:', error);
    return NextResponse.json({ error: 'Failed to reject lead' }, { status: 500 });
  }
}
