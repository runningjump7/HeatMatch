import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, isAdminAuthenticated } from '@/lib/adminAuth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query('SELECT * FROM installers ORDER BY business_name');

    return NextResponse.json({ installers: result.rows });
  } catch (error) {
    console.error('Error fetching installers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!isAdminAuthenticated(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      phone,
      email,
      primary_suburb,
      service_suburbs,
      active,
      notes,
    } = await request.json();

    if (!name || !phone || !email || !primary_suburb) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = uuidv4();

    await query(
      `INSERT INTO installers (id, business_name, phone, email, primary_suburb, service_suburbs, active, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [id, name, phone, email, primary_suburb, service_suburbs || [], active !== false, notes || '']
    );

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('Error creating installer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
