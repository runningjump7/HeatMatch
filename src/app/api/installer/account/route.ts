import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('tradeev2_session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, username, currentPassword, newPassword } = body;

    // Get user and installer info
    const userResult = await query(
      `SELECT id, password_hash, installer_id FROM users WHERE id = $1`,
      [session.value]
    );

    if (!userResult.rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required' }, { status: 400 });
      }

      const isValid = await comparePassword(currentPassword, user.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      await query(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        [hashedNewPassword, session.value]
      );
    }

    // Update installer info
    if (phone || username) {
      let updateQuery = 'UPDATE installers SET';
      const updates = [];
      const params = [];
      let paramNum = 1;

      if (phone) {
        updates.push(`phone = $${paramNum++}`);
        params.push(phone);
      }
      if (username) {
        updates.push(`business_name = $${paramNum++}`);
        params.push(username);
      }

      updates.push(`updated_at = NOW()`);
      params.push(user.installer_id);

      updateQuery += ' ' + updates.join(', ') + ` WHERE id = $${paramNum}`;

      await query(updateQuery, params);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('tradeev2_session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and installer info
    const userResult = await query(
      `SELECT u.id, u.email, i.phone, i.business_name
       FROM users u
       LEFT JOIN installers i ON u.installer_id = i.id
       WHERE u.id = $1`,
      [session.value]
    );

    if (!userResult.rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ account: userResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 });
  }
}
