import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = request.cookies.get('tradeev2_session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'approve') {
      await query(
        `UPDATE installers SET approved = true, approved_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [params.id]
      );
      return NextResponse.json({ success: true, message: 'Installer approved' });
    } else if (action === 'reject') {
      await query(`DELETE FROM installers WHERE id = $1`, [params.id]);
      return NextResponse.json({ success: true, message: 'Installer rejected' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error approving installer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
