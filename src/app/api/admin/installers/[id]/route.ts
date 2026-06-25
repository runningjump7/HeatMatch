import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, isAdminAuthenticated } from '@/lib/adminAuth';

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
    const {
      name,
      phone,
      email,
      primary_suburb,
      service_suburbs,
      approved,
      bio,
    } = await request.json();

    await query(
      `UPDATE installers
       SET business_name = $1, phone = $2, email = $3, suburb_primary = $4, service_suburbs = $5, approved = $6, bio = $7, updated_at = NOW()
       WHERE id = $8`,
      [name, phone, email, primary_suburb, service_suburbs || [], approved, bio || '', id]
    );

    const result = await query('SELECT * FROM installers WHERE id = $1', [id]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating installer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await query('DELETE FROM installers WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting installer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
