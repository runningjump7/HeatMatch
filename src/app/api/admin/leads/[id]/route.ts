import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { admin_notes, status, assigned_installers } = await request.json();

    await query(
      `UPDATE leads
       SET admin_notes = $1, status = $2, assigned_installers = $3, updated_at = NOW()
       WHERE id = $4`,
      [admin_notes, status, assigned_installers || [], id]
    );

    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
