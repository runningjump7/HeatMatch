import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('tradeev2_session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT id, business_name, email, phone, service_suburbs, created_at
       FROM installers
       WHERE approved = false
       ORDER BY created_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending installers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
